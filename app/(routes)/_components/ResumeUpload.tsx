"use client";
import React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  file: File | null | undefined;
  setFile: (file: File | null) => void;
};

function ResumeUpload({ file, setFile }: Props) {
  const handleFileUpload = (files: File[]) => {
    const uploadedFile = files[0];

    if (!uploadedFile) return;

    // Chỉ cho phép PDF
    if (uploadedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file only!");
      return;
    }

    setFile(uploadedFile);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    // 1. KHUNG BAO NGOÀI (Luôn hiển thị khung trắng nét đứt này)
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center p-5">
      {file ? (
        // === TRƯỜNG HỢP 1: ĐÃ CÓ FILE (Hiển thị Card bên trong khung) ===
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          {/* Giữ lại tiêu đề để giao diện không bị trống */}
          <div className="text-center mb-6">
            <h3 className="font-bold text-lg text-neutral-700 dark:text-neutral-200">
              File Uploaded
            </h3>
            <p className="text-neutral-400 text-sm mt-1">
              Your resume is ready for analysis
            </p>
          </div>

          {/* CARD FILE (Giống hình bạn gửi) */}
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
            {/* Icon PDF */}
            <div className="bg-gray-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>

            {/* Thông tin file */}
            <div className="flex flex-col min-w-0 flex-1">
              <h2
                className="text-sm font-semibold text-gray-900 truncate"
                title={file.name}
              >
                {file.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="text-xs text-gray-400">
                  • {formatDate(file.lastModified)}
                </span>
              </div>
            </div>

            {/* Nút xóa */}
            <button
              onClick={() => setFile(null)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        // === TRƯỜNG HỢP 2: CHƯA CÓ FILE (Hiển thị component Upload gốc) ===
        <div className="w-full">
          <FileUpload onChange={handleFileUpload} />
        </div>
      )}

      {/* Footer Text (Luôn hiện ở dưới cùng) */}
      <p className="text-center text-xs text-neutral-400 mt-6">
        Only PDF files supported
      </p>
    </div>
  );
}

export default ResumeUpload;
