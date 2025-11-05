import { useEffect, useState } from "react";
import api from "../api/client";
import ResumeCard from "../components/ResumeCard";
import UploadResume from "../components/UploadResume";

export default function Home() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = () => {
    setLoading(true);
    api.get("/resumes")
      .then((res) => setResumes(res.data.resumes))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Upload Resume</h2>
      <UploadResume onUploadComplete={fetchResumes} />

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Uploaded Resumes</h2>
        {loading && <p className="text-gray-500 text-sm">Refreshing...</p>}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-500">No resumes uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((r) => (
            <ResumeCard key={r.id} {...r} onAnalysisComplete={fetchResumes} />
      ))}
        </div>
      )}
    </div>
  );
}
