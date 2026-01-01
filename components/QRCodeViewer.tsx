import { useRef, useState } from "react";
import jsQR from "jsqr";

export function QRCodeViewer() {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    setDecodedText(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        decodeQR(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const decodeQR = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setDecodedText(code.data);
      } else {
        setError("QR 코드를 찾을 수 없습니다.");
      }
    };
    img.src = dataUrl;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-colors min-h-[200px]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded shadow-sm"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded flex items-center justify-center">
              <span className="text-transparent hover:text-white font-medium text-sm">
                변경하려면 클릭
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-slate-900 font-medium">이미지 업로드</p>
            <p className="text-slate-500 text-sm mt-1">
              클릭하거나 이미지를 드래그하세요
            </p>
          </>
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-4 min-h-[100px] border border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          QR 내용
        </h3>
        {decodedText ? (
          <p className="text-slate-900 break-all">{decodedText}</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <p className="text-slate-400 text-sm">
            이미지를 업로드하면 결과가 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}
