import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { SESSIONS_DATA, PLAYLIST_INFO } from './src/data/playlistData.ts';
import { generateStandaloneHtmlReport } from './src/utils/exportHtmlHelper.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Get playlist and sessions data
app.get('/api/playlist', (_req, res) => {
  res.json({
    playlist: PLAYLIST_INFO,
    sessions: SESSIONS_DATA,
  });
});

// API: Standalone Single-file HTML Download
app.get('/api/download-report-html', (_req, res) => {
  const html = generateStandaloneHtmlReport();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="2026_daangn_sre_day_playbook.html"');
  res.send('\uFEFF' + html);
});

// Helper for Gemini call with fallback
async function generateAnswerWithGemini(prompt: string, systemInstruction?: string) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || '당신은 당근(Karrot) 2026 빌더 밋업 SRE Day 전문가 AI입니다. 발표된 9개 세션의 화면(슬라이드, 아키텍처, 코드)과 음성(발표 내용, 트러블슈팅, 정량 성과)을 정확하고 전문적으로 설명하세요.',
          temperature: 0.3,
        },
      });
      return response.text || '답변을 생성하지 못했습니다.';
    } catch (err) {
      console.warn(`Model ${model} failed, trying next fallback:`, err);
      lastError = err;
    }
  }

  throw lastError;
}

// API: Interactive Chat & Deep Dive Q&A
app.post('/api/chat', async (req, res) => {
  try {
    const { question, sessionId, conversationHistory } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: '질문(question)을 입력해주세요.' });
      return;
    }

    // Build context
    let targetSessionContext = '';
    if (sessionId) {
      const session = SESSIONS_DATA.find((s) => s.id === sessionId || s.videoId === sessionId);
      if (session) {
        targetSessionContext = `
[선택된 집중 세션 정보]
- 제목: ${session.title}
- 발표자: ${session.speaker}
- 카테고리: ${session.category}
- 재생 시간: ${session.duration} | 조회수: ${session.views}
- 요약: ${session.summary}
- 화면 분석: ${session.screenAnalysis.headline} / 다이어그램: ${session.screenAnalysis.diagramDescription}
- 코드 스니펫: ${session.screenAnalysis.codeSnippet?.code || '없음'}
- 음성/발표 분석: ${session.audioAnalysis.headline} / 구두 맥락: ${session.audioAnalysis.spokenContext}
- 트러블슈팅 경험: ${session.audioAnalysis.troubleshootingStory}
- 정량 성과: ${session.audioAnalysis.quantitativeResults.join(', ')}
- 발표자 조언: ${session.audioAnalysis.speakerAdvice}
- 타임스탬프: ${session.timestamps.map((t) => `[${t.time}] ${t.label}`).join(', ')}
`;
      }
    }

    const allSessionsList = SESSIONS_DATA.map(
      (s) =>
        `세션 ${s.index}. [${s.category}] "${s.title}" (ID: ${s.videoId}): ${s.summary} (주요 화면: ${s.screenAnalysis.headline}, 음성 핵심: ${s.audioAnalysis.headline})`
    ).join('\n\n');

    const prompt = `
당신은 2026 당근 빌더 밋업 SRE Day 플레이리스트(PLVJW6xP-wT5Q)의 전체 9개 세션에 대해 화면(슬라이드·도식·코드)과 음성(발표자 구두 설명·트러블슈팅 경험)을 완벽하게 파악하고 있는 수석 SRE 아키텍트입니다.

[전체 9개 세션 개요]
${allSessionsList}

${targetSessionContext}

[사용자의 질문]
${question}

[답변 작성 가이드]
1. 화면(Visual/Diagram/Code) 관점과 음성(Audio/Speech/Insight) 관점을 명확히 구분하여 답변에 녹여내세요.
2. 당근 SRE 팀이 직면했던 구체적인 문제(Pain Point), 기술 선택 배경(Why), 극복한 트러블슈팅, 정량적 수치를 포함하세요.
3. 질문과 관련된 다른 세션과의 연계(예: Karpenter와 캐시 최적화, Grafana 대체와 MCP 에이전트 배포)가 있다면 함께 통찰을 제공하세요.
4. 가독성 높은 한국어 마크다운(불릿 포인트, 굵은 글씨, 코드 블록)으로 작성하세요.
`;

    const answer = await generateAnswerWithGemini(prompt);
    res.json({ answer });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'AI 응답 생성 중 오류가 발생했습니다.',
      details: error?.message || '알 수 없는 오류',
    });
  }
});

// API: Custom URL or custom query analysis
app.post('/api/analyze-custom', async (req, res) => {
  try {
    const { url, instruction } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL을 입력해주세요.' });
      return;
    }

    const prompt = `
다음 유튜브 URL 또는 대상에 대해 화면(영상 화면, 슬라이드, 자막)과 음성(발화 내용)을 포괄하여 전문적인 기술 요약을 생성해주세요.
URL: ${url}
추가 요청: ${instruction || '화면과 음성을 분리하여 핵심 기술 내용과 트러블슈팅 요약'}

SRE/DevOps/플랫폼 엔지니어 관점에서 다음 항목을 정리해주세요:
1. 개요 및 세션 메타데이터
2. 🖥️ 화면(Visual): 슬라이드 아키텍처 다이어그램 및 주요 화면 구성
3. 🎙️ 음성(Audio): 발표자의 구두 핵심 설명 및 트러블슈팅 비하인드
4. 💡 핵심 테크 스택 & 정량 성과
5. 🎯 실무 적용을 위한 핵심 체크리스트
`;

    const answer = await generateAnswerWithGemini(prompt);
    res.json({ summary: answer });
  } catch (error: any) {
    console.error('Custom Analysis Error:', error);
    res.status(500).json({
      error: '분석 생성 중 오류가 발생했습니다.',
      details: error?.message || '알 수 없는 오류',
    });
  }
});

// Vite Middleware for Dev / Static serving for Prod
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

setupServer();
