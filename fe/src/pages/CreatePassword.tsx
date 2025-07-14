import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Lock, ArrowLeft, Sparkles, Heart, CheckCircle, Eye, EyeOff, Shield, AlertCircle } from "lucide-solid";

interface ErrorState {
  password?: string;
  confirmPassword?: string;
}

interface PasswordHistoryEntry {
  hashedPassword: string;
  createdAt: Date;
}

export default function CreatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isCreated, setIsCreated] = createSignal(false);
  const [errors, setErrors] = createSignal<ErrorState>({});
  const [passwordStrength, setPasswordStrength] = createSignal(0);
  
  // Get user email from localStorage or context (remove hardcoded example)
  const getUserEmail = () => {
    // In real app, get from localStorage, context, or props
    return localStorage.getItem('userEmail') || '';
  };

  // Simple password hashing function (in production, use proper bcrypt or similar)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Get password history for user
  const getPasswordHistory = (): PasswordHistoryEntry[] => {
    const userEmail = getUserEmail();
    const history = localStorage.getItem(`passwordHistory_${userEmail}`);
    return history ? JSON.parse(history) : [];
  };

  // Save password to history
  const savePasswordToHistory = async (password: string) => {
    const userEmail = getUserEmail();
    const hashedPassword = await hashPassword(password);
    const history = getPasswordHistory();
    
    // Add new password to history
    const newEntry: PasswordHistoryEntry = {
      hashedPassword,
      createdAt: new Date()
    };
    
    history.push(newEntry);
    
    // Keep only last 5 passwords for security
    if (history.length > 5) {
      history.shift();
    }
    
    localStorage.setItem(`passwordHistory_${userEmail}`, JSON.stringify(history));
  };

  // Check if password was used before
  const isPasswordUsedBefore = async (password: string): Promise<boolean> => {
    const hashedPassword = await hashPassword(password);
    const history = getPasswordHistory();
    
    return history.some(entry => entry.hashedPassword === hashedPassword);
  };

  // Invalidate old password sessions
  const invalidateOldSessions = () => {
    const userEmail = getUserEmail();
    // Clear any existing auth tokens
    localStorage.removeItem(`authToken_${userEmail}`);
    localStorage.removeItem(`refreshToken_${userEmail}`);
    
    // Set flag that password was changed
    localStorage.setItem(`passwordChanged_${userEmail}`, Date.now().toString());
  };

  // Password validation
  const validatePassword = (pwd: string) => {
    const validations = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    
    const strength = Object.values(validations).filter(Boolean).length;
    return { validations, strength };
  };

  // Update password strength on password change
  createEffect(() => {
    const pwd = password();
    if (pwd) {
      const { strength } = validatePassword(pwd);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  });

  const handlePasswordChange = (e: InputEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const value = target.value;
    setPassword(value);
    
    // Clear errors when user types
    if (errors().password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: InputEvent) => {
    const target = e.currentTarget as HTMLInputElement;
    const value = target.value;
    setConfirmPassword(value);
    
    // Clear errors when user types
    if (errors().confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    
    const newErrors: ErrorState = {};
    const pwd = password();
    const confirmPwd = confirmPassword();
    
    // Validate password
    if (!pwd) {
      newErrors.password = "Password is required";
    } else {
      const { validations } = validatePassword(pwd);
      if (!validations.length) newErrors.password = "Password must be at least 8 characters long";
      else if (!validations.uppercase) newErrors.password = "Password must contain at least one uppercase letter";
      else if (!validations.lowercase) newErrors.password = "Password must contain at least one lowercase letter";
      else if (!validations.number) newErrors.password = "Password must contain at least one number";
      else if (!validations.special) newErrors.password = "Password must contain at least one special character";
      else {
        // Check if password was used before
        const wasUsedBefore = await isPasswordUsedBefore(pwd);
        if (wasUsedBefore) {
          newErrors.password = "This password has been used before. Please choose a different password.";
        }
      }
    }
    
    // Validate confirm password
    if (!confirmPwd) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (pwd !== confirmPwd) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API call
    setTimeout(async () => {
      try {
        // Save password to history
        await savePasswordToHistory(pwd);
        
        // Invalidate old sessions
        invalidateOldSessions();
        
        // Update current password hash
        const userEmail = getUserEmail();
        const currentPasswordHash = await hashPassword(pwd);
        localStorage.setItem(`currentPassword_${userEmail}`, currentPasswordHash);
        
        // Set success message for login page
        localStorage.setItem('passwordChangeSuccess', 'true');
        
        setIsLoading(false);
        setIsCreated(true);
      } catch (error) {
        console.error('Error creating password:', error);
        setIsLoading(false);
        setErrors({ password: 'Failed to create password. Please try again.' });
      }
    }, 2000);
  };

  const handleContinue = () => {
    // Navigate to login page instead of dashboard
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/verifyemail");
  };

  const getStrengthColor = () => {
    if (passwordStrength() <= 2) return "bg-red-500";
    if (passwordStrength() <= 3) return "bg-yellow-500";
    if (passwordStrength() <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength() <= 2) return "Weak";
    if (passwordStrength() <= 3) return "Fair";
    if (passwordStrength() <= 4) return "Good";
    return "Strong";
  };

  const getStrengthTextColor = () => {
    if (passwordStrength() <= 2) return "text-red-400";
    if (passwordStrength() <= 3) return "text-yellow-400";
    if (passwordStrength() <= 4) return "text-blue-400";
    return "text-green-400";
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
            {!isCreated() ? (
              <form onSubmit={handleSubmit}>
                {/* Icon */}
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-pink-200/20 rounded-full blur-xl animate-pulse"></div>
                  <div class="relative w-24 h-24 mx-auto rounded-full border-4 border-pink-300/40 overflow-hidden bg-gradient-to-br from-pink-200 to-pink-300 shadow-2xl flex items-center justify-center">
                    <Lock class="w-12 h-12 text-gray-700" />
                  </div>
                </div>

                {/* Title */}
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-black text-white mb-2">Create New Password</h2>
                  <p class="text-gray-300 text-sm leading-relaxed mb-4">
                    Create a secure password for your account
                  </p>
                  {getUserEmail() && (
                    <p class="text-white font-semibold text-sm bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-600/50">
                      {getUserEmail()}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div class="relative mb-4 group">
                  <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
                  <div class={`relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                    errors().password ? 'border-red-400/60' : 'border-gray-600/50 group-focus-within:border-pink-300/40'
                  }`}>
                    <Lock class="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type={showPassword() ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password()}
                      onInput={handlePasswordChange}
                      class="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword())}
                      class="ml-3 text-gray-400 hover:text-pink-300 transition-colors duration-300"
                    >
                      {showPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                    </button>
                  </div>
                  {errors().password && (
                    <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircle class="w-4 h-4" />
                      <span>{errors().password}</span>
                    </div>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {password() && (
                  <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-gray-300 text-sm">Password Strength</span>
                      <span class={`text-sm font-medium ${getStrengthTextColor()}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        class={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={`width: ${(passwordStrength() / 5) * 100}%`}
                      ></div>
                    </div>
                    <div class="mt-2 text-xs text-gray-400">
                      <p>Password must contain:</p>
                      <ul class="mt-1 space-y-1">
                        <li class={password().length >= 8 ? 'text-green-400' : 'text-gray-400'}>
                          • At least 8 characters
                        </li>
                        <li class={/[A-Z]/.test(password()) ? 'text-green-400' : 'text-gray-400'}>
                          • One uppercase letter
                        </li>
                        <li class={/[a-z]/.test(password()) ? 'text-green-400' : 'text-gray-400'}>
                          • One lowercase letter
                        </li>
                        <li class={/\d/.test(password()) ? 'text-green-400' : 'text-gray-400'}>
                          • One number
                        </li>
                        <li class={/[!@#$%^&*(),.?":{}|<>]/.test(password()) ? 'text-green-400' : 'text-gray-400'}>
                          • One special character
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Confirm Password Input */}
                <div class="relative mb-6 group">
                  <div class="absolute inset-0 bg-gray-800/50 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-gray-700/50 transition-all duration-300"></div>
                  <div class={`relative flex items-center bg-gray-800/60 backdrop-blur-sm rounded-2xl px-4 py-4 border transition-all duration-300 ${
                    errors().confirmPassword ? 'border-red-400/60' : 'border-gray-600/50 group-focus-within:border-pink-300/40'
                  }`}>
                    <Shield class="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type={showConfirmPassword() ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword()}
                      onInput={handleConfirmPasswordChange}
                      class="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                      class="ml-3 text-gray-400 hover:text-pink-300 transition-colors duration-300"
                    >
                      {showConfirmPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                    </button>
                  </div>
                  {errors().confirmPassword && (
                    <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircle class="w-4 h-4" />
                      <span>{errors().confirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* Create Password Button */}
                <button
                  type="submit"
                  class="group relative w-full bg-pink-200 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden hover:bg-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading()}
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 transition-colors duration-300 flex items-center justify-center gap-2">
                    {isLoading() ? (
                      <>
                        <div class="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Creating Password...
                      </>
                    ) : (
                      <>
                        <Lock class="w-5 h-5" />
                        CREATE PASSWORD
                      </>
                    )}
                  </span>
                </button>
              </form>
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
                  <h2 class="text-3xl font-black text-white mb-2">Password Created!</h2>
                  <p class="text-gray-300 text-sm leading-relaxed mb-4">
                    Your password has been successfully created. Please login with your new password.
                  </p>
                  {getUserEmail() && (
                    <p class="text-white font-semibold text-sm bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-600/50">
                      {getUserEmail()}
                    </p>
                  )}
                </div>

                {/* Success Details */}
                <div class="bg-gray-800/40 rounded-2xl p-4 mb-6 border border-gray-700/30">
                  <p class="text-gray-300 text-sm leading-relaxed">
                    🎉 Password berhasil dibuat! Silakan login dengan password baru Anda untuk mengakses akun.
                  </p>
                </div>

                {/* Continue to Login Button */}
                <button
                  onClick={handleContinue}
                  class="group relative w-full bg-pink-200 text-gray-900 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden hover:bg-pink-300"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 transition-colors duration-300 flex items-center justify-center gap-2">
                    <CheckCircle class="w-5 h-5" />
                    GO TO LOGIN
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Security Tips */}
          <div class="mt-8 text-center">
            <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <h3 class="text-white font-semibold mb-2">Security Tips</h3>
              <p class="text-gray-300 text-sm mb-4">
                Keep your password secure and don't share it with anyone.
              </p>
              <div class="text-xs text-gray-400 space-y-1">
                <p>• Use a unique password for this account</p>
                <p>• Consider using a password manager</p>
                <p>• Enable two-factor authentication when available</p>
                <p>• Previous passwords cannot be reused</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}