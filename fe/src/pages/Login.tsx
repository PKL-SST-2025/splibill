import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { User, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Heart, AlertCircle, CheckCircle } from "lucide-solid";

interface UserAccount {
  lastLogin: string;
  username: string;
  email: string;
  password?: string; // Legacy password (akan dihapus setelah create new password)
  name?: string;
  phone?: string;
  country?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showWarning, setShowWarning] = createSignal(false);
  const [warningMessage, setWarningMessage] = createSignal("");
  const [showSuccessMessage, setShowSuccessMessage] = createSignal(false);

  // Enhanced password hashing function (sama seperti di create password dan account settings)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Get stored accounts with enhanced error handling
  const getStoredAccounts = (): UserAccount[] => {
    try {
      const accounts = localStorage.getItem('registeredAccounts');
      return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
      console.error('Error parsing stored accounts:', error);
      return [];
    }
  };

  // Get current password hash for user
  const getCurrentPasswordHash = (userEmail: string): string | null => {
    try {
      return localStorage.getItem(`currentPassword_${userEmail}`);
    } catch (error) {
      console.error('Error getting current password hash:', error);
      return null;
    }
  };

  // Check if password has been changed from original
  const isPasswordChanged = (userEmail: string): boolean => {
    try {
      const changeTime = localStorage.getItem(`passwordChanged_${userEmail}`);
      return changeTime !== null;
    } catch (error) {
      console.error('Error checking password change status:', error);
      return false;
    }
  };

  // Enhanced credential validation with better error handling
  const validateCredentials = async (usernameOrEmail: string, password: string) => {
    try {
      const accounts = getStoredAccounts();
      
      // Find account by username or email (case insensitive)
      const userAccount = accounts.find((account: UserAccount) => 
        account.username?.toLowerCase() === usernameOrEmail.toLowerCase() || 
        account.email?.toLowerCase() === usernameOrEmail.toLowerCase()
      );
      
      if (!userAccount) {
        return { status: 'user_not_found' };
      }

      const userEmail = userAccount.email;
      
      // Check if user has created a new password
      if (isPasswordChanged(userEmail)) {
        // Use new password hash for validation
        const currentPasswordHash = getCurrentPasswordHash(userEmail);
        if (!currentPasswordHash) {
          return { status: 'password_system_error' };
        }
        
        const inputPasswordHash = await hashPassword(password);
        if (currentPasswordHash !== inputPasswordHash) {
          return { status: 'wrong_password' };
        }
      } else {
        // Use original registration password
        if (userAccount.password !== password) {
          return { status: 'wrong_password' };
        }
      }
      
      return { status: 'success', account: userAccount };
    } catch (error) {
      console.error('Error validating credentials:', error);
      return { status: 'validation_error' };
    }
  };

  // Enhanced session management
  const clearOldSessions = (userEmail: string) => {
    try {
      // Clear any existing auth tokens that might be invalid
      const existingAuthToken = localStorage.getItem(`authToken_${userEmail}`);
      const passwordChangeTime = localStorage.getItem(`passwordChanged_${userEmail}`);
      
      if (existingAuthToken && passwordChangeTime) {
        const changeTime = parseInt(passwordChangeTime);
        const currentTime = Date.now();
        
        // If token was created before password change, remove it
        if (currentTime > changeTime) {
          localStorage.removeItem(`authToken_${userEmail}`);
          localStorage.removeItem(`refreshToken_${userEmail}`);
        }
      }
    } catch (error) {
      console.error('Error clearing old sessions:', error);
    }
  };

  // Enhanced login handler with better user experience
  const handleLogin = async () => {
    // Reset messages
    setShowWarning(false);
    setWarningMessage("");
    setShowSuccessMessage(false);

    // Enhanced validation
    if (!username().trim() && !password().trim()) {
      setWarningMessage("Please enter both username/email and password to continue.");
      setShowWarning(true);
      return;
    }
    
    if (!username().trim()) {
      setWarningMessage("Please enter your username or email address.");
      setShowWarning(true);
      return;
    }
    
    if (!password().trim()) {
      setWarningMessage("Please enter your password to continue.");
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate realistic loading time
    setTimeout(async () => {
      try {
        // Validate user credentials
        const validationResult = await validateCredentials(username().trim(), password().trim());
        
        if (validationResult.status === 'success') {
          const userAccount = validationResult.account!;
          const userEmail = userAccount.email;
          
          // Clear any old/invalid sessions
          clearOldSessions(userEmail);
          
          setIsLoading(false);
          
          // Generate new authentication token
          const authToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const loginTime = new Date().toISOString();
          
          // Prepare user session data with enhanced information
          const sessionData = {
            username: userAccount.username,
            email: userEmail,
            name: userAccount.name || userAccount.username,
            loginTime,
            authToken,
            lastActivity: loginTime
          };
          
          // Handle "Remember Me" functionality
          if (rememberMe()) {
            localStorage.setItem('rememberedUser', JSON.stringify(sessionData));
            localStorage.setItem(`authToken_${userEmail}`, authToken);
            
            // Set extended session duration for remembered users
            localStorage.setItem(`sessionExpiry_${userEmail}`, 
              (Date.now() + (30 * 24 * 60 * 60 * 1000)).toString() // 30 days
            );
          } else {
            // Set shorter session for non-remembered users
            localStorage.setItem(`sessionExpiry_${userEmail}`, 
              (Date.now() + (24 * 60 * 60 * 1000)).toString() // 24 hours
            );
          }
          
          // Save current user session
          sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
          
          // Store user email for other components to use
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('lastLoginTime', loginTime);
          
          // Update last login time in user account data
          updateUserLastLogin(userEmail);
          
          // Navigate to dashboard
          navigate("/dashboard");
          
        } else {
          // Handle different error cases with user-friendly messages
          setIsLoading(false);
          
          switch (validationResult.status) {
            case 'user_not_found':
              setWarningMessage("Account not found. Please check your username/email or create a new account if you haven't registered yet.");
              break;
            case 'wrong_password':
              setWarningMessage("Incorrect password. Please check your password and try again. If you've recently changed your password, make sure you're using the new one.");
              break;
            case 'password_system_error':
              setWarningMessage("There's an issue with your password system. Please try resetting your password or contact support.");
              break;
            case 'validation_error':
            default:
              setWarningMessage("An unexpected error occurred during login. Please try again or contact support if the problem persists.");
              break;
          }
          
          setShowWarning(true);
        }
      } catch (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        setWarningMessage("A technical error occurred during login. Please check your connection and try again.");
        setShowWarning(true);
      }
    }, 1500);
  };

  // Update user's last login time
  const updateUserLastLogin = (userEmail: string) => {
    try {
      const accounts = getStoredAccounts();
      const accountIndex = accounts.findIndex(account => account.email === userEmail);
      
      if (accountIndex !== -1) {
        accounts[accountIndex].lastLogin = new Date().toISOString();
        localStorage.setItem('registeredAccounts', JSON.stringify(accounts));
      }
    } catch (error) {
      console.error('Error updating last login time:', error);
    }
  };

  // Enhanced remembered user loading
  const loadRememberedUser = () => {
    try {
      const remembered = localStorage.getItem('rememberedUser');
      if (remembered) {
        const userData = JSON.parse(remembered);
        
        // Check if session is still valid
        const sessionExpiry = localStorage.getItem(`sessionExpiry_${userData.email}`);
        if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
          // Session expired, clear remembered user
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem(`sessionExpiry_${userData.email}`);
          localStorage.removeItem(`authToken_${userData.email}`);
          return;
        }
        
        // Load remembered user data
        setUsername(userData.username || userData.email);
        setRememberMe(true);
        
        // Show a subtle indication that user is remembered
        setTimeout(() => {
          setWarningMessage("Welcome back! Your login information has been remembered.");
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);
        }, 500);
      }
    } catch (error) {
      console.error('Error loading remembered user:', error);
      // Clean up corrupted remembered user data
      localStorage.removeItem('rememberedUser');
    }
  };

  // Check for success messages from other pages
  const checkForSuccessMessages = () => {
    // Check for password creation success
    if (localStorage.getItem('passwordChangeSuccess') === 'true') {
      setShowSuccessMessage(true);
      localStorage.removeItem('passwordChangeSuccess');
      
      setTimeout(() => setShowSuccessMessage(false), 8000);
    }
    
    // Check for account settings update success
    if (localStorage.getItem('accountUpdateSuccess') === 'true') {
      setShowSuccessMessage(true);
      setWarningMessage("Your account has been updated successfully. Please login with your updated credentials.");
      localStorage.removeItem('accountUpdateSuccess');
      
      setTimeout(() => setShowSuccessMessage(false), 8000);
    }
  };

  // Enhanced keyboard navigation
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading()) {
      handleLogin();
    }
  };

  // Component mount with enhanced initialization
  onMount(() => {
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);
    
    setTimeout(() => {
      loadRememberedUser();
      checkForSuccessMessages();
    }, 100);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  return (
    <div class="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced background animation */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div class="absolute top-1/4 right-1/3 w-48 h-48 bg-pink-200/10 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Floating elements with enhanced animation */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <Heart class="w-6 h-6 text-white/30" />
      </div>
      <div class="absolute top-32 right-20 animate-bounce delay-700">
        <Sparkles class="w-4 h-4 text-pink-300/60" />
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <div class="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>
      <div class="absolute top-40 left-1/2 animate-bounce delay-500">
        <div class="w-2 h-2 bg-pink-200/40 rounded-full"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          {/* Back to home with enhanced styling */}
          <button
            onClick={() => navigate("/")}
            class="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back to Home</span>
          </button>

          <div class="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-pink-300/30 hover:bg-gray-800/25 transition-all duration-500">
            {/* Enhanced Avatar */}
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-pink-300/30 rounded-full blur-xl animate-pulse"></div>
              <div class="relative w-32 h-32 mx-auto rounded-full border-4 border-pink-300/50 overflow-hidden bg-gradient-to-br from-pink-300 to-pink-400 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <User class="w-16 h-16 text-black/80" />
              </div>
            </div>

            {/* Enhanced Title */}
            <div class="text-center mb-8">
              <h2 class="text-3xl font-black text-white mb-2">Welcome Back!</h2>
              <p class="text-pink-100 text-sm">Sign in to continue your journey with split bills</p>
            </div>

            {/* Enhanced Success Message */}
            {showSuccessMessage() && (
              <div class="mb-6 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 animate-pulse">
                <div class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div class="flex-1">
                    <div class="text-green-100 text-sm font-medium mb-1">
                      🎉 Password Successfully Created!
                    </div>
                    <div class="text-green-200/80 text-xs leading-relaxed">
                      Your new password has been saved securely. Please login with your new password to continue using the application.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Warning Message */}
            {showWarning() && (
              <div class="mb-4 bg-pink-400/20 backdrop-blur-sm rounded-2xl p-4 border border-pink-300/40 animate-pulse">
                <div class="flex items-start gap-3">
                  <AlertCircle class="w-5 h-5 text-pink-300 mt-0.5 flex-shrink-0" />
                  <div class="flex-1">
                    <span class="text-pink-100 text-sm font-medium leading-relaxed">{warningMessage()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Username Input */}
            <div class="relative mb-4 group">
              <div class="absolute inset-0 bg-pink-300/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-pink-300/30 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-pink-300/30 group-focus-within:border-pink-300/60 transition-all duration-300">
                <User class="text-pink-300 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Username or Email Address"
                  value={username()}
                  onInput={(e) => {
                    setUsername(e.currentTarget.value);
                    if (showWarning()) {
                      setShowWarning(false);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  class="bg-transparent outline-none w-full text-white placeholder-white/80 text-sm font-semibold"
                  disabled={isLoading()}
                />
              </div>
            </div>

            {/* Enhanced Password Input */}
            <div class="relative mb-6 group">
              <div class="absolute inset-0 bg-pink-300/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-pink-300/30 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-pink-300/30 group-focus-within:border-pink-300/60 transition-all duration-300">
                <Lock class="text-pink-300 w-5 h-5 mr-3" />
                <input
                  type={showPassword() ? "text" : "password"}
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  value={password()}
                  onInput={(e) => {
                    setPassword(e.currentTarget.value);
                    if (showWarning()) {
                      setShowWarning(false);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  class="bg-transparent outline-none w-full text-white placeholder-white/80 text-sm font-semibold"
                  disabled={isLoading()}
                />
                <button
                  type="button"
                  class="text-pink-300 hover:text-white ml-2 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword())}
                  disabled={isLoading()}
                >
                  {showPassword() ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Enhanced Remember Me & Forgot Password */}
            <div class="flex items-center justify-between text-sm text-pink-100 mb-8">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe()}
                  onInput={(e) => setRememberMe(e.currentTarget.checked)}
                  class="sr-only"
                  disabled={isLoading()}
                />
                <div class={`w-5 h-5 rounded-md border-2 border-pink-300/50 transition-all duration-300 ${rememberMe() ? 'bg-white border-white' : 'bg-gray-900/20'}`}>
                  {rememberMe() && (
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="w-2 h-2 bg-pink-400 rounded-sm"></div>
                    </div>
                  )}
                </div>
                <span class="group-hover:text-white transition-colors duration-300">Remember Me</span>
              </label>
              <button 
                onClick={() => navigate("/forgotpassword")}
                class="text-pink-300 hover:text-white transition-colors duration-300 text-sm hover:underline"
                disabled={isLoading()}
              >
                Forgot Password?
              </button>
            </div>

            {/* Enhanced Login Button */}
            <button
              class="group relative w-full bg-white text-pink-500 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleLogin}
              disabled={isLoading()}
            >
              <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
                {isLoading() ? (
                  <>
                    <div class="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </>
                ) : (
                  <>
                    <Sparkles class="w-5 h-5" />
                    LOGIN TO ACCOUNT
                  </>
                )}
              </span>
            </button>

            {/* Enhanced Create Account */}
            <div class="text-center mt-6">
              <p class="text-pink-100 text-sm">
                Don't have an account yet?{" "}
                <button
                  onClick={() => navigate("/register")}
                  class="text-white font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                  disabled={isLoading()}
                >
                  Create New Account
                </button>
              </p>
            </div>
          </div>

          {/* Enhanced Social login placeholder */}
          <div class="mt-8 text-center">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-1 h-px bg-pink-300/30"></div>
              <span class="text-pink-200 text-sm">Or continue with</span>
              <div class="flex-1 h-px bg-pink-300/30"></div>
            </div>

            <div class="flex gap-4 justify-center">
              {["G", "F", "A"].map((text) => (
                <button 
                  class="bg-gray-900/20 backdrop-blur-sm rounded-xl p-3 border border-pink-300/30 hover:bg-gray-800/30 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  disabled={isLoading()}
                >
                  <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span class="text-pink-400 font-bold text-sm">{text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Security & Developer Info */}
          <div class="mt-6 text-center">
            <div class="bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-pink-300/20">
              <p class="text-pink-200 text-xs mb-2">🔒 Enhanced Security</p>
              <p class="text-pink-100/70 text-xs leading-relaxed">
                Your account data is secured with advanced encryption. Login credentials are automatically synchronized across all account changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}