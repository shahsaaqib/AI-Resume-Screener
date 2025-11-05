import { useState, useRef } from "react";
import api from "../api/client";
import { UploadCloud, Loader2 } from "lucide-react";

interface UploadResumeProps {
  onUploadComplete: () => void;
}

export default function UploadResume({ onUploadComplete }: UploadResumeProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload success:", res.data);
      onUploadComplete();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") handleFileUpload(file);
    else setError("Please upload a valid PDF file.");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") handleFileUpload(file);
    else setError("Please upload a valid PDF file.");
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center transition ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Uploading...</p>
        </div>
      ) : (
        <>
          <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <p className="text-gray-700 mb-2">
            Drag & drop your resume PDF here, or
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse Files
          </button>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </>
      )}
    </div>
  );
}
