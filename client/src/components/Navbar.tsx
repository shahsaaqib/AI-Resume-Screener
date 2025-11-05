import { Briefcase } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h1 className="font-semibold text-lg tracking-tight">
            AI Resume Screener
          </h1>
        </div>
      </div>
    </nav>
  );
}
