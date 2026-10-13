import React, { useState } from 'react';
import { X, Sparkles, Youtube, RefreshCw, Copy, Check, FileText } from 'lucide-react';

interface CustomUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomUrlModal: React.FC<CustomUrlModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState<string>('https://www.youtube.com/playlist?list=PLVJW6xP-wT5Q');
  const [instruction, setInstruction] = useState<string>('화면(슬라이드·아키텍처·코드)과 음성(발표 내용·트러블슈팅·성과)을 분리하여 상세 요약');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/analyze-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), instruction: instruction.trim() }),
      });

      if (!response.ok) {
        throw new Error('요청 처리 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResult(data.summary || '요약 결과를 생성하지 못했습니다.');
    } catch (err: any) {
      setResult(`⚠️ 오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Youtube className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">커스텀 YouTube URL 요약기</h3>
              <p className="text-xs text-slate-400">화면·음성 통합 멀티모달 분석</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                YouTube 동영상 또는 재생목록 URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 playlist?list=..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                분석 지침 및 포커스 (선택 사항)
              </label>
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="예: 트러블슈팅과 아키텍처 다이어그램 중심으로 요약"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini 멀티모달 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>화면·음성 통합 분석 시작</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-orange-400">분석 결과</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사됨' : '복사'}</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
