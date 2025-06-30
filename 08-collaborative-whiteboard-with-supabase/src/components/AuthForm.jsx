import { AlertCircle, Check, Mail, Palette, Sparkles } from "lucide-react";
import { useState } from "react";

export function AuthForm({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage("");

    const result = await onSignIn(email);

    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");
    setLoading(false);

    if (result.success) {
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl mb-6 shadow-2xl shadow-blue-500/25">
              <Palette className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-white/80 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
            Collaborative Whiteboard
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
            Create, collaborate, and bring your ideas to life in real-time
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/50 border border-white/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-3"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 text-gray-900 placeholder:text-gray-500 font-medium"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="group w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  <span>Sending Magic Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Send Magic Link</span>
                </div>
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl flex items-start gap-3 ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-200"
                  : "bg-red-50 text-red-800 border-2 border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/80 backdrop-blur-xl rounded-2xl border border-blue-200/50 p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Secure Authentication
              </p>
              <p className="text-sm text-blue-700 leading-relaxed">
                We&apos;ll send you a secure login link via email. No passwords
                required - just click and start creating!
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
              <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Real-time Sync
            </p>
            <p className="text-xs text-gray-500 mt-1">Instant updates</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
              <div className="w-6 h-6 bg-white rounded-lg"></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Collaborative</p>
            <p className="text-xs text-gray-500 mt-1">Work together</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">Shareable</p>
            <p className="text-xs text-gray-500 mt-1">Easy sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
