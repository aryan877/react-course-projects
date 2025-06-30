import { Loader2, Palette } from "lucide-react";

/**
 * A full-screen loader component displayed during initial loading or setup processes.
 * @param {{ title: string, message: string }} props
 */
export function FullScreenLoader({ title, message }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
