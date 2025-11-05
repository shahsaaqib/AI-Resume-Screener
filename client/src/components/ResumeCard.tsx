import { FileText, CheckCircle, Clock, XCircle, Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

interface ResumeProps {
  id: string;
  filename: string;
  createdAt: string;
  status: string;
  analysis?: any;
  onAnalysisComplete?: () => void;
}

export default function ResumeCard({
  id,
  filename,
  createdAt,
  status,
  analysis,
  onAnalysisComplete,
}: ResumeProps) {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusIcon = () => {
    switch (status) {
      case "analyzed":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "failed":
        return <XCircle className="text-red-500 w-5 h-5" />;
      case "processing":
        return <Loader2 className="text-blue-500 w-5 h-5 animate-spin" />;
      default:
        return <Clock className="text-yellow-500 w-5 h-5" />;
    }
  };

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    if (status === "analyzed" || analyzing) return;

    setAnalyzing(true);
    setError(null);

    try {
      await api.post(`/analyze/${id}`);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/resume/${id}`)}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-100 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 w-5 h-5" />
            <h2 className="font-medium text-gray-800 truncate max-w-[160px]">{filename}</h2>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {getStatusIcon()}
            <span className="capitalize">{status}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Uploaded: {new Date(createdAt).toLocaleString()}
        </p>

        {analysis && analysis.overall_score && (
          <div className="mt-1">
            <p className="text-sm text-gray-600">
              Score: <span className="font-semibold">{analysis.overall_score}</span>/100
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${analysis.overall_score}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={analyzing || status === "analyzed" || status === "processing"}
        className={`mt-4 flex items-center justify-center gap-2 rounded-lg text-sm font-medium px-3 py-2 border transition ${
          status === "analyzed"
            ? "bg-green-50 text-green-700 border-green-200 cursor-not-allowed"
            : analyzing || status === "processing"
            ? "bg-blue-50 text-blue-700 border-blue-200 cursor-wait"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {analyzing || status === "processing" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
          </>
        ) : status === "analyzed" ? (
          <>
            <CheckCircle className="w-4 h-4" /> Analyzed
          </>
        ) : (
          <>
            <Brain className="w-4 h-4" /> Analyze
          </>
        )}
      </button>
    </div>
  );
}
