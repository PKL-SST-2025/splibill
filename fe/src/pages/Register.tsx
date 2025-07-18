import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Heart, Shield, Check, AlertCircle, X } from "lucide-solid";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [agreeTerms, setAgreeTerms] = createSignal(false);
  const [showWarning, setShowWarning] = createSignal(false);
  const [warningMessage, setWarningMessage] = createSignal("");
  const [warningType, setWarningType] = createSignal("error"); // "error", "warning", "info"
  const [fieldErrors, setFieldErrors] = createSignal({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formData, setFormData] = createSignal({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    const errors = fieldErrors();
    if (errors[field as keyof typeof errors]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Hide general warning when user starts typing
    if (showWarning()) {
      setShowWarning(false);
    }

    // Real-time validation for username and email
    if (field === 'username' && value.trim()) {
      if (checkUserExists(value.trim())) {
        setFieldErrors(prev => ({ ...prev, username: "Username already exists" }));
      }
    }
    
    if (field === 'email' && value.trim()) {
      if (checkEmailExists(value.trim())) {
        setFieldErrors(prev => ({ ...prev, email: "Email already registered" }));
      }
    }
  };

  // Function to check if username already exists
  const checkUserExists = (username: string) => {
    const existingAccounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
    return existingAccounts.some((account: { username: any; }) => account.username === username);
  };

  // Function to check if email already exists
  const checkEmailExists = (email: string) => {
    const existingAccounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
    return existingAccounts.some((account: { email: any; }) => account.email === email);
  };

  // Function to save new account
  const saveAccount = (accountData: { username: any; email: any; password: any; }) => {
    const existingAccounts = JSON.parse(localStorage.getItem('registeredAccounts') || '[]');
    const newAccount = {
      id: Date.now().toString(),
      username: accountData.username,
      email: accountData.email,
      password: accountData.password,
      createdAt: new Date().toISOString()
    };
    
    existingAccounts.push(newAccount);
    localStorage.setItem('registeredAccounts', JSON.stringify(existingAccounts));
    return newAccount;
  };

  const showMessage = (message: string, type: "error" | "warning" | "info" = "error") => {
    setWarningMessage(message);
    setWarningType(type);
    setShowWarning(true);
  };

  const handleCreateAccount = async () => {
    // Reset warnings
    setShowWarning(false);
    setWarningMessage("");
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    const data = formData();

    // Form validation
    if (!data.username.trim()) {
      showMessage("Please enter a username", "error");
      return;
    }

    if (!data.email.trim()) {
      showMessage("Please enter an email address", "error");
      return;
    }

    if (!data.email.includes('@') || !data.email.includes('.')) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    if (!data.password) {
      showMessage("Please enter a password", "error");
      return;
    }

    if (data.password.length < 6) {
      showMessage("Password must be at least 6 characters long", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    if (!agreeTerms()) {
      showMessage("Please agree to the Terms of Service and Privacy Policy", "error");
      return;
    }

    // Check if username already exists
    if (checkUserExists(data.username.trim())) {
      showMessage("This username is already taken. Please choose a different username.", "error");
      setFieldErrors(prev => ({ ...prev, username: "Username already exists" }));
      return;
    }

    // Check if email already exists
    if (checkEmailExists(data.email.trim())) {
      showMessage("This email is already registered. Please use a different email or sign in instead.", "error");
      setFieldErrors(prev => ({ ...prev, email: "Email already registered" }));
      return;
    }

    setIsLoading(true);
    
    // Simulate account creation process
    setTimeout(() => {
      try {
        // Save new account to localStorage
        const newAccount = saveAccount({
          username: data.username.trim(),
          email: data.email.trim(),
          password: data.password
        });

        setIsLoading(false);
        showMessage("Account created successfully! Redirecting to login...", "info");
        
        // Redirect to login page after successful account creation
        setTimeout(() => {
          navigate("/login");
        }, 1500);
        
      } catch (error) {
        setIsLoading(false);
        showMessage("Failed to create account. Please try again.", "error");
      }
    }, 2000);
  };

  const isFormValid = () => {
    const data = formData();
    const errors = fieldErrors();
    return data.username.trim() && 
           data.email.trim() && 
           data.email.includes('@') && 
           data.password && 
           data.confirmPassword && 
           data.password === data.confirmPassword && 
           data.password.length >= 6 &&
           agreeTerms() &&
           !errors.username &&
           !errors.email;
  };

  const getWarningStyles = () => {
    switch (warningType()) {
      case "error":
        return "bg-red-500/20 border-red-400/30 text-red-100";
      case "warning":
        return "bg-yellow-500/20 border-yellow-400/30 text-yellow-100";
      case "info":
        return "bg-green-500/20 border-green-400/30 text-green-100";
      default:
        return "bg-red-500/20 border-red-400/30 text-red-100";
    }
  };

  const getWarningIcon = () => {
    switch (warningType()) {
      case "error":
        return <AlertCircle class="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertCircle class="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Check class="w-5 h-5 text-green-400" />;
      default:
        return <AlertCircle class="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/8 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/6 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <Heart class="w-6 h-6 text-pink-200/30" />
      </div>
      <div class="absolute top-32 right-20 animate-bounce delay-700">
        <Sparkles class="w-4 h-4 text-pink-100/25" />
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <Shield class="w-5 h-5 text-pink-200/25" />
      </div>

      {/* Main content */}
      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate("/login")}
            class="group flex items-center gap-2 text-gray-300 hover:text-pink-200 mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back to Login</span>
          </button>

          {/* Create account card */}
          <div class="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 hover:bg-gray-900/90 transition-all duration-500">
            {/* Avatar with glow effect */}
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-pink-200/15 rounded-full blur-xl animate-pulse"></div>
              <div class="relative w-28 h-28 mx-auto rounded-full border-4 border-pink-200/30 overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 shadow-2xl">
                <div class="w-full h-full bg-gradient-to-br from-pink-50/80 to-pink-100/80 flex items-center justify-center">
                  <User class="w-14 h-14 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div class="text-center mb-8">
              <h2 class="text-3xl font-black text-white mb-2">Join Us!</h2>
              <p class="text-gray-300 text-sm">Create your account and start splitting bills beautifully</p>
            </div>

            {/* Warning Message */}
            {showWarning() && (
              <div class={`mb-4 backdrop-blur-sm rounded-2xl p-4 border animate-pulse ${getWarningStyles()}`}>
                <div class="flex items-center gap-3">
                  {getWarningIcon()}
                  <span class="text-sm font-medium flex-1">{warningMessage()}</span>
                  <button
                    onClick={() => setShowWarning(false)}
                    class="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Username input */}
            <div class="relative mb-4 group">
              <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
              <div class={`relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                fieldErrors().username 
                  ? 'border-red-400/50 group-focus-within:border-red-400/60' 
                  : 'border-gray-600/50 group-focus-within:border-pink-200/40'
              }`}>
                <User class="text-pink-200 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData().username}
                  onInput={(e) => handleInputChange('username', e.currentTarget.value)}
                  class="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
                />
                {formData().username && !fieldErrors().username && (
                  <Check class="w-4 h-4 text-green-400 ml-2" />
                )}
                {fieldErrors().username && (
                  <AlertCircle class="w-4 h-4 text-red-400 ml-2" />
                )}
              </div>
              {fieldErrors().username && (
                <p class="text-red-400 text-xs mt-1 ml-4">{fieldErrors().username}</p>
              )}
            </div>

            {/* Email input */}
            <div class="relative mb-4 group">
              <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
              <div class={`relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                fieldErrors().email 
                  ? 'border-red-400/50 group-focus-within:border-red-400/60' 
                  : 'border-gray-600/50 group-focus-within:border-pink-200/40'
              }`}>
                <Mail class="text-pink-200 w-5 h-5 mr-3" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData().email}
                  onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                  class="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
                />
                {formData().email && formData().email.includes('@') && !fieldErrors().email && (
                  <Check class="w-4 h-4 text-green-400 ml-2" />
                )}
                {fieldErrors().email && (
                  <AlertCircle class="w-4 h-4 text-red-400 ml-2" />
                )}
              </div>
              {fieldErrors().email && (
                <p class="text-red-400 text-xs mt-1 ml-4">{fieldErrors().email}</p>
              )}
            </div>

            {/* Password input */}
            <div class="relative mb-4 group">
              <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border border-gray-600/50 group-focus-within:border-pink-200/40 transition-all duration-300">
                <Lock class="text-pink-200 w-5 h-5 mr-3" />
                <input
                  type={showPassword() ? "text" : "password"}
                  placeholder="Password"
                  value={formData().password}
                  onInput={(e) => handleInputChange('password', e.currentTarget.value)}
                  class="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="text-pink-200 hover:text-pink-100 ml-2 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword())}
                >
                  {showPassword() ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div class="relative mb-6 group">
              <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border border-gray-600/50 group-focus-within:border-pink-200/40 transition-all duration-300">
                <Lock class="text-pink-200 w-5 h-5 mr-3" />
                <input
                  type={showConfirmPassword() ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData().confirmPassword}
                  onInput={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
                  class="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="text-pink-200 hover:text-pink-100 ml-2 transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                >
                  {showConfirmPassword() ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
                {formData().confirmPassword && formData().password === formData().confirmPassword && (
                  <Check class="w-4 h-4 text-green-400 ml-2" />
                )}
              </div>
            </div>

            {/* Password strength indicator */}
            {formData().password && (
              <div class="mb-6">
                <div class="flex gap-1 mb-2">
                  <div class={`h-1 flex-1 rounded-full transition-all duration-300 ${formData().password.length >= 6 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <div class={`h-1 flex-1 rounded-full transition-all duration-300 ${formData().password.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                  <div class={`h-1 flex-1 rounded-full transition-all duration-300 ${formData().password.length >= 10 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                </div>
                <p class="text-xs text-gray-400">
                  {formData().password.length < 6 ? 'Weak' : 
                   formData().password.length < 8 ? 'Medium' : 'Strong'} password
                </p>
              </div>
            )}

            {/* Terms and conditions */}
            <div class="flex items-start gap-3 mb-8">
              <div class="relative mt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms()}
                  onInput={(e) => setAgreeTerms(e.currentTarget.checked)}
                  class="sr-only"
                />
                <div class={`w-5 h-5 rounded-md border-2 border-gray-500 transition-all duration-300 cursor-pointer ${agreeTerms() ? 'bg-pink-200 border-pink-200' : 'bg-gray-700'}`}
                     onClick={() => setAgreeTerms(!agreeTerms())}>
                  {agreeTerms() && (
                    <div class="w-full h-full flex items-center justify-center">
                      <Check class="w-3 h-3 text-gray-800" />
                    </div>
                  )}
                </div>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                I agree to the{" "}
                <button class="text-pink-200 font-semibold hover:text-pink-100 hover:underline transition-colors duration-300">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button class="text-pink-200 font-semibold hover:text-pink-100 hover:underline transition-colors duration-300">
                  Privacy Policy
                </button>
              </p>
            </div>

            {/* Create account button */}
            <button
              class={`group relative w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl overflow-hidden ${
                isFormValid() 
                  ? 'bg-pink-200 text-gray-900 hover:scale-105 hover:shadow-2xl hover:bg-pink-100' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleCreateAccount}
              disabled={!isFormValid() || isLoading()}
            >
              {isFormValid() && (
                <div class="absolute inset-0 bg-gradient-to-r from-pink-100 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
              <span class="relative z-10 transition-colors duration-300 flex items-center justify-center gap-2">
                {isLoading() ? (
                  <>
                    <div class="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles class="w-5 h-5" />
                    CREATE ACCOUNT
                  </>
                )}
              </span>
            </button>

            {/* Already have account link */}
            <div class="text-center mt-6">
              <p class="text-gray-300 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  class="text-pink-200 font-semibold hover:text-pink-100 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Social signup section */}
          <div class="mt-8 text-center">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-1 h-px bg-gray-600"></div>
              <span class="text-gray-400 text-sm">Or sign up with</span>
              <div class="flex-1 h-px bg-gray-600"></div>
            </div>
            
            <div class="flex gap-4 justify-center">
              <button class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 hover:bg-gray-700/60 hover:border-pink-200/40 transition-all duration-300 hover:scale-105">
                <div class="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-900 font-bold text-sm">G</span>
                </div>
              </button>
              <button class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 hover:bg-gray-700/60 hover:border-pink-200/40 transition-all duration-300 hover:scale-105">
                <div class="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-900 font-bold text-sm">F</span>
                </div>
              </button>
              <button class="bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 hover:bg-gray-700/60 hover:border-pink-200/40 transition-all duration-300 hover:scale-105">
                <div class="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-900 font-bold text-sm">A</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}