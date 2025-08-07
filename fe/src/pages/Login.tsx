import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { User, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Heart, AlertCircle, CheckCircle } from "lucide-solid";

interface UserAccount {
  username: string;
  email: string;
  password?: string; // Legacy password (akan dihapus setelah create new password)
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

  // Fungsi untuk hash password (sama seperti di create password)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Fungsi untuk mengambil data akun yang tersimpan
  const getStoredAccounts = () => {
    const accounts = localStorage.getItem('registeredAccounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  // Fungsi untuk mendapatkan current password hash user
  const getCurrentPasswordHash = (userEmail: string): string | null => {
    return localStorage.getItem(`currentPassword_${userEmail}`);
  };

  // Fungsi untuk mengecek apakah password sudah diubah
  const isPasswordChanged = (userEmail: string): boolean => {
    const changeTime = localStorage.getItem(`passwordChanged_${userEmail}`);
    return changeTime !== null;
  };

  // Fungsi untuk validasi kredensial
  const validateCredentials = async (usernameOrEmail: string, password: string) => {
    const accounts = getStoredAccounts();
    
    // Cari akun berdasarkan username atau email
    const userAccount = accounts.find((account: UserAccount) => 
      account.username === usernameOrEmail || account.email === usernameOrEmail
    );
    
    if (!userAccount) {
      return { status: 'user_not_found' };
    }

    const userEmail = userAccount.email;
    
    // Cek apakah user sudah pernah create new password
    if (isPasswordChanged(userEmail)) {
      // Jika sudah, gunakan current password hash
      const currentPasswordHash = getCurrentPasswordHash(userEmail);
      if (!currentPasswordHash) {
        return { status: 'password_system_error' };
      }
      
      const inputPasswordHash = await hashPassword(password);
      if (currentPasswordHash !== inputPasswordHash) {
        return { status: 'wrong_password' };
      }
    } else {
      // Jika belum, gunakan legacy password dari registrasi
      if (userAccount.password !== password) {
        return { status: 'wrong_password' };
      }
    }
    
    return { status: 'success', account: userAccount };
  };

  // Fungsi untuk invalidate session lama jika diperlukan
  const clearOldSessions = (userEmail: string) => {
    // Clear any existing auth tokens that might be invalid
    const existingAuthToken = localStorage.getItem(`authToken_${userEmail}`);
    const passwordChangeTime = localStorage.getItem(`passwordChanged_${userEmail}`);
    
    if (existingAuthToken && passwordChangeTime) {
      const changeTime = parseInt(passwordChangeTime);
      const currentTime = Date.now();
      
      // Jika token dibuat sebelum password diubah, hapus token
      if (currentTime > changeTime) {
        localStorage.removeItem(`authToken_${userEmail}`);
        localStorage.removeItem(`refreshToken_${userEmail}`);
      }
    }
  };

  const handleLogin = async () => {
    // Reset warning dan success messages
    setShowWarning(false);
    setWarningMessage("");
    setShowSuccessMessage(false);

    // Validate inputs
    if (!username().trim() && !password().trim()) {
      setWarningMessage("Please enter username/email and password");
      setShowWarning(true);
      return;
    }
    
    if (!username().trim()) {
      setWarningMessage("Please enter your username or email");
      setShowWarning(true);
      return;
    }
    
    if (!password().trim()) {
      setWarningMessage("Please enter your password");
      setShowWarning(true);
      return;
    }

    setIsLoading(true);
    
    // Simulasi delay untuk loading
    setTimeout(async () => {
      try {
        // Validasi kredensial
        const validationResult = await validateCredentials(username().trim(), password().trim());
        
        if (validationResult.status === 'success') {
          const userEmail = validationResult.account.email;
          
          // Clear old sessions jika diperlukan
          clearOldSessions(userEmail);
          
          // Login berhasil
          setIsLoading(false);
          
          // Generate new auth token
          const newAuthToken = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Simpan session jika remember me dicentang
          if (rememberMe()) {
            localStorage.setItem('rememberedUser', JSON.stringify({
              username: validationResult.account.username,
              email: userEmail,
              loginTime: new Date().toISOString()
            }));
            
            // Simpan auth token untuk remember me
            localStorage.setItem(`authToken_${userEmail}`, newAuthToken);
          }
          
          // Simpan current user session
          sessionStorage.setItem('currentUser', JSON.stringify({
            username: validationResult.account.username,
            email: userEmail,
            loginTime: new Date().toISOString(),
            authToken: newAuthToken
          }));
          
          // Set user email untuk digunakan di create password page jika diperlukan
          localStorage.setItem('userEmail', userEmail);
          
          navigate("/dashboard");
          
        } else if (validationResult.status === 'user_not_found') {
          // Username/Email tidak ditemukan
          setIsLoading(false);
          setWarningMessage("Account not found. Please check your username/email or create a new account.");
          setShowWarning(true);
          
        } else if (validationResult.status === 'wrong_password') {
          // Password salah
          setIsLoading(false);
          setWarningMessage("Incorrect password. Please check your password and try again.");
          setShowWarning(true);
          
        } else if (validationResult.status === 'password_system_error') {
          // Error sistem password
          setIsLoading(false);
          setWarningMessage("Password system error. Please contact support or try creating a new password.");
          setShowWarning(true);
        }
      } catch (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        setWarningMessage("An error occurred during login. Please try again.");
        setShowWarning(true);
      }
    }, 1500);
  };

  // Load remembered user saat component mount
  const loadRememberedUser = () => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      try {
        const userData = JSON.parse(remembered);
        setUsername(userData.username || userData.email);
        setRememberMe(true);
      } catch (error) {
        console.error('Error loading remembered user:', error);
        localStorage.removeItem('rememberedUser');
      }
    }
  };

  // Check for password creation success message
  const checkPasswordCreationSuccess = () => {
    if (localStorage.getItem('passwordChangeSuccess') === 'true') {
      setShowSuccessMessage(true);
      localStorage.removeItem('passwordChangeSuccess'); // Hapus flag setelah ditampilkan
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);
    }
  };

  // Component mount effect
  onMount(() => {
    setTimeout(() => {
      loadRememberedUser();
      checkPasswordCreationSuccess();
    }, 100);
  });

  return (
    <div class="min-h-screen bg-black relative overflow-hidden">
      {/* Background animation dengan warna soft pink */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <Heart class="w-6 h-6 text-white/30" />
      </div>
      <div class="absolute top-32 right-20 animate-bounce delay-700">
        <Sparkles class="w-4 h-4 text-pink-300/60" />
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <div class="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>

      <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
          {/* Back to home */}
          <button
            onClick={() => navigate("/")}
            class="group flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="text-sm font-medium">Back to Home</span>
          </button>

          <div class="bg-gray-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-pink-300/30 hover:bg-gray-800/25 transition-all duration-500">
            {/* Avatar */}
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-pink-300/30 rounded-full blur-xl animate-pulse"></div>
              <div class="relative w-32 h-32 mx-auto rounded-full border-4 border-pink-300/50 overflow-hidden bg-gradient-to-br from-pink-300 to-pink-400 shadow-2xl flex items-center justify-center">
                <User class="w-16 h-16 text-black/80" />
              </div>
            </div>

            {/* Title */}
            <div class="text-center mb-8">
              <h2 class="text-3xl font-black text-white mb-2">Welcome Back!</h2>
              <p class="text-pink-100 text-sm">Sign in to continue your journey</p>
            </div>

            {/* Success Message for Password Creation */}
            {showSuccessMessage() && (
              <div class="mb-6 bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 animate-pulse">
                <div class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div class="flex-1">
                    <div class="text-green-100 text-sm font-medium mb-1">
                      🎉 Password Successfully Created!
                    </div>
                    <div class="text-green-200/80 text-xs leading-relaxed">
                      Your new password has been saved. Please login with your new password to continue.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Message */}
            {showWarning() && (
              <div class="mb-4 bg-pink-400/20 backdrop-blur-sm rounded-2xl p-4 border border-pink-300/40 animate-pulse">
                <div class="flex items-center gap-3">
                  <AlertCircle class="w-5 h-5 text-pink-300" />
                  <span class="text-pink-100 text-sm font-medium">{warningMessage()}</span>
                </div>
              </div>
            )}

            {/* Username */}
            <div class="relative mb-4 group">
              <div class="absolute inset-0 bg-pink-300/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-pink-300/30 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-pink-300/30 group-focus-within:border-pink-300/60 transition-all duration-300">
                <User class="text-pink-300 w-5 h-5 mr-3" />
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={username()}
                  onInput={(e) => {
                    setUsername(e.currentTarget.value);
                    if (showWarning()) {
                      setShowWarning(false);
                    }
                  }}
                  class="bg-transparent outline-none w-full text-white placeholder-white/80 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div class="relative mb-6 group">
              <div class="absolute inset-0 bg-pink-300/20 rounded-2xl blur-sm group-focus-within:blur-none group-focus-within:bg-pink-300/30 transition-all duration-300"></div>
              <div class="relative flex items-center bg-gray-900/20 backdrop-blur-sm rounded-2xl px-4 py-4 border border-pink-300/30 group-focus-within:border-pink-300/60 transition-all duration-300">
                <Lock class="text-pink-300 w-5 h-5 mr-3" />
                <input
                  type={showPassword() ? "text" : "password"}
                  placeholder="Password"
                  autocomplete="off"
                  value={password()}
                  onInput={(e) => {
                    setPassword(e.currentTarget.value);
                    if (showWarning()) {
                      setShowWarning(false);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                  class="bg-transparent outline-none w-full text-white placeholder-white/80 text-sm font-semibold"
                />
                <button
                  type="button"
                  class="text-pink-300 hover:text-white ml-2 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword())}
                >
                  {showPassword() ? <EyeOff class="w-4 h-4" /> : <Eye class="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div class="flex items-center justify-between text-sm text-pink-100 mb-8">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe()}
                  onInput={(e) => setRememberMe(e.currentTarget.checked)}
                  class="sr-only"
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
                class="text-pink-300 hover:text-white transition-colors duration-300 text-sm"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              class="group relative w-full bg-white text-pink-500 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={isLoading()}
            >
              <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
                {isLoading() ? (
                  <>
                    <div class="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles class="w-5 h-5" />
                    LOGIN
                  </>
                )}
              </span>
            </button>

            {/* Create Account */}
            <div class="text-center mt-6">
              <p class="text-pink-100 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  class="text-white font-semibold hover:underline transition-all duration-300 hover:scale-105 inline-block"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>

          {/* Social login */}
          <div class="mt-8 text-center">
            <div class="flex items-center gap-4 mb-4">
              <div class="flex-1 h-px bg-pink-300/30"></div>
              <span class="text-pink-200 text-sm">Or continue with</span>
              <div class="flex-1 h-px bg-pink-300/30"></div>
            </div>

            <div class="flex gap-4 justify-center">
              {["G", "F", "A"].map((text) => (
                <button class="bg-gray-900/20 backdrop-blur-sm rounded-xl p-3 border border-pink-300/30 hover:bg-gray-800/30 transition-all duration-300 hover:scale-105">
                  <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span class="text-pink-400 font-bold text-sm">{text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info untuk developer */}
          <div class="mt-6 text-center">
            <div class="bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-pink-300/20">
              <p class="text-pink-200 text-xs mb-2">🔒 Security Enhanced</p>
              <p class="text-pink-100/70 text-xs leading-relaxed">
                Previous passwords are automatically invalidated when new passwords are created for enhanced security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}