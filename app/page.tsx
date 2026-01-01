"use client";

import { useState } from "react";
import { QRCodeGenerator } from "../components/QRCodeGenerator";
import { QRCodeViewer } from "../components/QRCodeViewer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"create" | "edit">("create");

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">QR Editor</h1>
        <p className="text-slate-500">QR 코드를 생성하고 내용을 확인하세요</p>
      </header>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${
              activeTab === "create"
                ? "text-indigo-600 bg-indigo-50/50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            QR 생성
            {activeTab === "create" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${
              activeTab === "edit"
                ? "text-indigo-600 bg-indigo-50/50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            QR 확인
            {activeTab === "edit" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "create" ? <QRCodeGenerator /> : <QRCodeViewer />}
        </div>
      </div>
    </main>
  );
}
