import { useState } from "react";

export function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [ecc, setEcc] = useState("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQR = () => {
    if (!text.trim()) return;

    setIsLoading(true);
    // API parameters
    const size = "300x300";
    const color = fgColor.replace("#", "");
    const bgcolor = bgColor.replace("#", "");

    // Using goqr.me or qrserver API. qrserver is reliable.
    // Documentation: https://goqr.me/api/doc/create-qr-code/
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      text
    )}&size=${size}&color=${color}&bgcolor=${bgcolor}&ecc=${ecc}&margin=10`;

    // Preload image to ensure it's ready
    const img = new Image();
    img.onload = () => {
      setQrUrl(url);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      // Error handling if needed
    };
    img.src = url;
  };

  const downloadQR = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          텍스트 입력
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="URL이나 텍스트를 입력하세요"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow min-h-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            오류 수정 레벨
          </label>
          <select
            value={ecc}
            onChange={(e) => setEcc(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="L">낮음 (7%)</option>
            <option value="M">중간 (15%)</option>
            <option value="Q">사분위수 (25%)</option>
            <option value="H">높음 (30%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            전면색
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="h-10 w-12 rounded cursor-pointer border border-slate-200"
            />
            <span className="text-sm text-slate-500 uppercase">{fgColor}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            배경색
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-12 rounded cursor-pointer border border-slate-200"
            />
            <span className="text-sm text-slate-500 uppercase">{bgColor}</span>
          </div>
        </div>
      </div>

      <button
        onClick={generateQR}
        disabled={!text || isLoading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "생성 중..." : "QR 코드 생성하기"}
      </button>

      {qrUrl && (
        <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="Generated QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <button
            onClick={downloadQR}
            className="flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            이미지 다운로드
          </button>
        </div>
      )}
    </div>
  );
}
