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
    <div class="min-h-screen bg-black relative overflow-hidden">
      {/* Background animation with red colors */}
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
          {/* Back button */}
          <button
            onClick={handleBack}
            class="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back</span>
          </button>

          <div class="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-700/30 hover:bg-gray-800/25 transition-all duration-500">
            {!isVerified() ? (
              <>
                {/* Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-red-800/30 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-red-700/50 overflow-hidden bg-gradient-to-br from-red-800 to-red-900 shadow-2xl flex items-center justify-center">
                    <Mail class="w-12 h-12 text-white/90" />
                  </div>
                </div>

                {/* Title */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Verify Your Email</h2>
                  <p class="text-red-100 text-sm leading-relaxed mb-4">
                    We've sent a 6-digit verification code to your email address
                  </p>
                  {userEmail && (
                    <p class="text-white font-semibold text-sm bg-gray-900/40 rounded-xl px-4 py-2 border border-red-700/30">
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Verification Code Input */}
                <div class="relative mb-6 group">
                  <div class="absolute inset-0 bg-red-800/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-red-800/30 transition-all duration-300"></div>
                  <div class={`relative flex items-center justify-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                    hasError() ? 'border-red-400/60' : 'border-red-700/30 group-focus-within:border-red-700/60'
                  }`}>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode()}
                      onInput={handleInputChange}
                      class="bg-transparent outline-none text-center text-white placeholder-white/80 text-2xl font-bold tracking-widest w-full"
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
                  class="group relative w-full bg-white text-red-800 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading() || verificationCode().length !== 6}
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    {isLoading() ? (
                      <>
                        <div class="w-5 h-5 border-2 border-red-800 border-t-transparent rounded-full animate-spin"></div>
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
                  <p class="text-red-100 text-sm mb-4">
                    Didn't receive the code?
                  </p>
                  
                  {canResend() ? (
                    <button
                      onClick={handleResend}
                      class="group relative text-red-700 font-semibold hover:text-white hover:scale-105 transition-all duration-300 text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                      disabled={isResending()}
                    >
                      {isResending() ? (
                        <>
                          <div class="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
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
                    <div class="flex items-center justify-center gap-2 text-red-200/70 text-sm">
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
                  <div class="absolute inset-0 bg-red-800/30 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-red-700/50 overflow-hidden bg-gradient-to-br from-red-800 to-red-900 shadow-2xl flex items-center justify-center">
                    <CheckCircle class="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>

                {/* Success Message */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Email Verified!</h2>
                  <p class="text-red-100 text-sm leading-relaxed mb-4">
                    Your email has been successfully verified. Now let's create a new password for your account.
                  </p>
                  {userEmail && (
                    <p class="text-white font-semibold text-sm bg-gray-900/40 rounded-xl px-4 py-2 border border-red-700/30">
                      {userEmail}
                    </p>
                  )}
                </div>

                {/* Success Details */}
                <div class="bg-gray-900/20 rounded-2xl p-4 mb-6 border border-red-700/20">
                  <p class="text-red-100 text-sm leading-relaxed">
                    🔐 Next step: Create a secure password to protect your account.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  class="group relative w-full bg-white text-red-800 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                    <CheckCircle class="w-5 h-5" />
                    CREATE NEW PASSWORD
                  </span>
                </button>
              </>
            )}

            {/* Login link */}
            <div class="text-center mt-6">
              <p class="text-red-100 text-sm">
                Already verified?{" "}
                <button
                  onClick={handleLogin}
                  class="text-white font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div class="mt-8 text-center">
            <div class="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-red-700/20">
              <h3 class="text-white font-semibold mb-2">Need Help?</h3>
              <p class="text-red-100/70 text-sm mb-4">
                If you're having trouble with verification, our support team is here to help.
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