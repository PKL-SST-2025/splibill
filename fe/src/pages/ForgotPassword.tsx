import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Mail, ArrowLeft, Sparkles, Heart, CheckCircle, Send } from "lucide-solid";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [isEmailSent, setIsEmailSent] = createSignal(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!email()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verify email page with email parameter
      navigate(`/verifyemail?email=${encodeURIComponent(email())}`);
    }, 2000);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div class="min-h-screen bg-black relative overflow-hidden">
      {/* Background animation dengan warna merah */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-red-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-red-800/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <Heart class="w-6 h-6 text-white/30" />
      </div>
      <div class="absolute top-32 right-20 animate-bounce delay-700">
        <Sparkles class="w-4 h-4 text-red-700/60" />
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <div class="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            class="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back to Login</span>
          </button>

          <div class="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-700/30 hover:bg-gray-800/25 transition-all duration-500">
            {!isEmailSent() ? (
              <>
                {/* Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-red-800/30 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-red-700/50 overflow-hidden bg-gradient-to-br from-red-800 to-red-900 shadow-2xl flex items-center justify-center">
                    <Mail class="w-12 h-12 text-white/80" />
                  </div>
                </div>

                {/* Title */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Forgot Password?</h2>
                  <p class="text-red-100 text-sm leading-relaxed">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Email Input */}
                <div class="relative mb-6 group">
                  <div class="absolute inset-0 bg-red-800/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-red-800/30 transition-all duration-300"></div>
                  <div class="relative flex items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-red-700/30 group-focus-within:border-red-700/60 transition-all duration-300">
                    <Mail class="text-red-700 w-5 h-5 mr-3" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email()}
                      onInput={(e) => setEmail(e.currentTarget.value)}
                      class="bg-transparent outline-none w-full text-white placeholder-white/80 text-sm font-semibold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  class="group relative w-full bg-white text-red-800 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
                  disabled={isLoading() || !email()}
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {isLoading() ? (
                      <>
                        <div class="w-5 h-5 border-2 border-red-800 border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send class="w-5 h-5" />
                        VERIFY YOUR EMAIL
                      </>
                    )}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-green-400/50 overflow-hidden bg-gradient-to-br from-green-300 to-green-400 shadow-2xl flex items-center justify-center">
                    <CheckCircle class="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Success Message */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Email Sent!</h2>
                  <p class="text-red-100 text-sm leading-relaxed mb-4">
                    We've sent a password reset link to
                  </p>
                  <p class="text-white font-semibold text-sm bg-gray-900/20 rounded-xl px-4 py-2 border border-red-700/30">
                    {email()}
                  </p>
                </div>

                {/* Instructions */}
                <div class="bg-gray-900/10 rounded-2xl p-4 mb-6 border border-red-700/20">
                  <p class="text-red-100 text-sm leading-relaxed">
                    Check your email and click the link to reset your password. If you don't see the email, check your spam folder.
                  </p>
                </div>

                {/* Resend Button */}
                <button
                  onClick={handleResend}
                  class="group relative w-full bg-gray-900/20 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden border border-red-700/30 hover:bg-gray-800/30"
                  disabled={isLoading()}
                >
                  <span class="relative z-10 flex items-center justify-center gap-2">
                    {isLoading() ? (
                      <>
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Resending...
                      </>
                    ) : (
                      <>
                        <Mail class="w-5 h-5" />
                        RESEND EMAIL
                      </>
                    )}
                  </span>
                </button>
              </>
            )}

            {/* Back to login link */}
            <div class="text-center mt-6">
              <p class="text-red-100 text-sm">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/login")}
                  class="text-white font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Additional Help */}
          <div class="mt-8 text-center">
            <div class="bg-gray-900/10 backdrop-blur-sm rounded-2xl p-6 border border-red-700/20">
              <h3 class="text-white font-semibold mb-2">Need Help?</h3>
              <p class="text-red-100 text-sm mb-4">
                If you're still having trouble, contact our support team.
              </p>
              <button class="text-red-700 hover:text-white transition-colors duration-300 text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}