import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { ArrowLeft } from "lucide-react";

export default function ResumeDetail() {
  const { id } = useParams();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/resume/${id}`)
      .then((res) => {
        setResume(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch resume:", err);
        setError("Failed to load resume details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!resume) return <p className="p-8 text-gray-500">No data available.</p>;

  const a = resume.analysis || {};

  // Defensive extraction (handles both string and object forms)
  const summary =
    typeof a.professional_summary === "string"
      ? a.professional_summary
      : a.professional_summary?.summary || "";

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/" className="flex items-center gap-1 text-blue-600 text-sm mb-6">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{resume.filename}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Uploaded: {new Date(resume.createdAt).toLocaleString()}
        </p>

        {a.name && <h3 className="text-lg font-semibold text-gray-800 mb-2">{a.name}</h3>}

        {summary && (
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{summary}</p>
        )}

        {a.overall_score && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Overall Score</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  a.overall_score >= 80
                    ? "bg-green-500"
                    : a.overall_score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${a.overall_score}%` }}
              />
            </div>
            <p className="text-sm mt-1 font-medium text-gray-700">
              {a.overall_score}/100
            </p>
          </div>
        )}

        {a.top_skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {a.top_skills.map((s: string, i: number) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {a.strengths?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Strengths</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {a.strengths.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {a.weaknesses?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Weaknesses</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {a.weaknesses.map((w: string, i: number) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {a.education_summary && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Education</h3>
            {Array.isArray(a.education_summary) ? (
              <ul className="text-sm text-gray-600 space-y-1">
                {a.education_summary.map((e: any, i: number) => (
                  <li key={i}>
                    🎓 {e.degree}, {e.field} — {e.institution || e.university}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                🎓 {a.education_summary.degree}, {a.education_summary.field_of_study} —{" "}
                {a.education_summary.university} ({a.education_summary.graduation_year})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
