import { createSignal, createEffect, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Mail, ArrowLeft, Sparkles, Heart, CheckCircle, RefreshCw, AlertCircle, Clock } from "lucide-solid";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [isVerified, setIsVerified] = createSignal(false);
  const [isResending, setIsResending] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);
  const [countdown, setCountdown] = createSignal(60);
  const [canResend, setCanResend] = createSignal(false);
  
  // Get email from props, localStorage, or route params (in real app)
  const userEmail = ""; // This should be passed as props or retrieved from state management

  // Countdown timer for resend
  createEffect(() => {
    if (countdown() > 0 && !canResend()) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      onCleanup(() => clearInterval(timer));
    }
  });

  const handleVerify = async (e: Event) => {
    e.preventDefault();
    if (!verificationCode() || verificationCode().length !== 6) return;
    
    setIsLoading(true);
    setHasError(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success/failure
      if (verificationCode() === "123456") {
        setIsVerified(true);
      } else {
        setHasError(true);
      }
    }, 2000);
  };

  const handleResend = () => {
    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    setTimeout(() => {
      setIsResending(false);
    }, 1500);
  };

  const handleInputChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const value = target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setHasError(false);
  };

  const handleContinue = () => {
    // Navigate to create new password page instead of dashboard
    navigate("/createpassword");
  };

  const handleBack = () => {
    navigate("/forgotpassword");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background animation */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200/8 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <Heart class="w-6 h-6 text-pink-300/40" />
      </div>
      <div class="absolute top-32 right-20 animate-bounce delay-700">
        <Sparkles class="w-4 h-4 text-pink-200/30" />
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <div class="w-3 h-3 bg-pink-300/40 rounded-full"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={handleBack}
            class="group flex items-center gap-2 text-gray-300 hover:text-pink-200 mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back</span>
          </button>

          <div class="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 hover:bg-gray-900/90 transition-all duration-500">
            {!isVerified() ? (
              <>
                {/* Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-pink-200/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-pink-300/40 overflow-hidden bg-gradient-to-br from-pink-200 to-pink-300 shadow-2xl flex items-center justify-center">
                    <Mail class="w-12 h-12 text-gray-700" />
                  </div>
                </div>

                {/* Title */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Verify Your Email</h2>
                  <p class="text-gray-300 text-sm leading-relaxed mb-4">
                    We've sent a 6-digit verification code to your email address
                  </p>
                  {userEmail && (
                    <p class="text-white font-semibold text-sm bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-600/50">
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Verification Code Input */}
                <div class="relative mb-6 group">
                  <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
                  <div class={`relative flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                    hasError() ? 'border-red-400/60' : 'border-gray-600/50 group-focus-within:border-pink-300/40'
                  }`}>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode()}
                      onInput={handleInputChange}
                      class="bg-transparent outline-none text-center text-white placeholder-gray-400 text-2xl font-bold tracking-widest w-full"
                      maxLength={6}
                    />
                  </div>
                  {hasError() && (
                    <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircle class="w-4 h-4" />
                      <span>Invalid verification code. Please try again.</span>
                    </div>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  class="group relative w-full bg-pink-200 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden hover:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading() || verificationCode().length !== 6}
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 transition-colors duration-300 flex items-center justify-center gap-2">
                    {isLoading() ? (
                      <>
                        <div class="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle class="w-5 h-5" />
                        VERIFY EMAIL
                      </>
                    )}
                  </span>
                </button>

                {/* Resend Section */}
                <div class="mt-6 text-center">
                  <p class="text-gray-300 text-sm mb-4">
                    Didn't receive the code?
                  </p>
                  
                  {canResend() ? (
                    <button
                      onClick={handleResend}
                      class="group relative text-pink-300 font-semibold hover:text-pink-200 hover:scale-105 transition-all duration-300 text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                      disabled={isResending()}
                    >
                      {isResending() ? (
                        <>
                          <div class="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
                          Resending...
                        </>
                      ) : (
                        <>
                          <RefreshCw class="w-4 h-4" />
                          Resend Code
                        </>
                      )}
                    </button>
                  ) : (
                    <div class="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      <Clock class="w-4 h-4" />
                      <span>Resend in {countdown()}s</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-pink-300/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-pink-300/50 overflow-hidden bg-gradient-to-br from-pink-200 to-pink-300 shadow-2xl flex items-center justify-center">
                    <CheckCircle class="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>

                {/* Success Message */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Email Verified!</h2>
                  <p class="text-gray-300 text-sm leading-relaxed mb-4">
                    Your email has been successfully verified. Now let's create a new password for your account.
                  </p>
                  {userEmail && (
                    <p class="text-white font-semibold text-sm bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-600/50">
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Success Details */}
                <div class="bg-gray-800/40 rounded-2xl p-4 mb-6 border border-gray-700/30">
                  <p class="text-gray-300 text-sm leading-relaxed">
                    🔐 Next step: Create a secure password to protect your account.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  class="group relative w-full bg-pink-200 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden hover:bg-pink-300"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 transition-colors duration-300 flex items-center justify-center gap-2">
                    <CheckCircle class="w-5 h-5" />
                    CREATE NEW PASSWORD
                  </span>
                </button>
              </>
            )}

            {/* Login link */}
            <div class="text-center mt-6">
              <p class="text-gray-300 text-sm">
                Already verified?{" "}
                <button
                  onClick={handleLogin}
                  class="text-pink-300 font-semibold hover:text-pink-200 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div class="mt-8 text-center">
            <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <h3 class="text-white font-semibold mb-2">Need Help?</h3>
              <p class="text-gray-300 text-sm mb-4">
                If you're having trouble with verification, our support team is here to help.
              </p>
              <button class="text-pink-300 hover:text-pink-200 transition-colors duration-300 text-sm font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}