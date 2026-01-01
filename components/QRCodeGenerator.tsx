import { useState, useRef, useEffect } from "react";

export function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [ecc, setEcc] = useState("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(10);
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const finalSize = size + margin * 2;

  const generateQR = () => {
    if (!text.trim()) return;

    setIsLoading(true);

    const sizeParam = `${size}x${size}`;
    const color = fgColor.replace("#", "");
    const bgcolor = bgColor.replace("#", "");

    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      text
    )}&size=${sizeParam}&color=${color}&bgcolor=${bgcolor}&ecc=${ecc}&margin=0`;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      setQrUrl(url);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      alert("QR 코드 생성 중 오류가 발생했습니다.");
    };
    img.src = url;
  };

  useEffect(() => {
    if (qrUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        canvas.width = finalSize;
        canvas.height = finalSize;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, finalSize, finalSize);

        ctx.drawImage(img, margin, margin, size, size);
      };
      img.src = qrUrl;
    }
  }, [qrUrl, size, margin, bgColor, finalSize]);

  const downloadQR = () => {
    if (!canvasRef.current) return;

    try {
      const url = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
            className="w-full h-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="L">낮음 (7%)</option>
            <option value="M">중간 (15%)</option>
            <option value="Q">사분위수 (25%)</option>
            <option value="H">높음 (30%)</option>
          </select>
        </div>
        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-slate-700">
              전면색
            </label>
            <div className="relative">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div
                className="w-full h-10 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: fgColor }}
              >
                <span className="text-xs font-medium mix-blend-difference text-white uppercase">
                  {fgColor}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-slate-700">
              배경색
            </label>
            <div className="relative">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />
              <div
                className="w-full h-10 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center transition-transform"
                style={{ backgroundColor: bgColor }}
              >
                <span className="text-xs font-medium mix-blend-exclusion text-white uppercase">
                  {bgColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            QR 크기 (px)
          </label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            min="100"
            max="1024"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            여백 (px)
          </label>
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={generateQR}
          disabled={!text || isLoading}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "생성 중..." : "QR 생성"}
        </button>
        {qrUrl && (
          <button
            onClick={downloadQR}
            className="flex-1 py-3 flex items-center justify-center font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            다운로드
          </button>
        )}
      </div>
      <div className="w-full overflow-auto bg-slate-50 p-8 border border-slate-200 rounded-xl flex items-center justify-center min-h-[300px]">
        {qrUrl ? (
          <canvas
            ref={canvasRef}
            className="shadow-lg max-w-full h-auto"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          <div
            style={{
              width: `${finalSize}px`,
              height: `${finalSize}px`,
              backgroundColor: bgColor,
              padding: `${margin}px`,
              transition: "all 0.3s ease",
            }}
            className="shadow-md flex items-center justify-center box-border bg-white"
          >
            <div className="text-slate-300 text-center p-4">
              <span className="block text-2xl font-bold mb-1">
                {finalSize}x{finalSize}
              </span>
              <span className="text-sm">미리보기</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
