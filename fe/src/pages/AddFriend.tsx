import { createSignal, onMount } from "solid-js";
import { DollarSign, Users, Heart, TrendingUp, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, UserPlus, Mail, Phone, ArrowLeft, Check, AlertCircle, LogOut, CreditCard, Settings, User} from "lucide-solid";
import { useNavigate } from "@solidjs/router";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function AddFriendPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Form state
  const [formData, setFormData] = createSignal<FormData>({
    name: "",
    email: "",
    phone: ""
  });
  
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [errors, setErrors] = createSignal<FormErrors>({});

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen());
  };

  const handleLogout = () => {
  // Add logout logic here - clear auth tokens, redirect to login, etc.
  if (confirm("Are you sure you want to log out?")) {
    // Clear any stored authentication data
    // localStorage.removeItem('auth_token'); // if using localStorage
    // sessionStorage.clear(); // if using sessionStorage
    
    // Redirect to login page
    navigate("/login");
  }
};

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors()[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const data = formData();
    
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setFormData({ name: "", email: "", phone: "" });
      
      // Hide success message and navigate back
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/friends");
      }, 2000);
    }, 1500);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300"
      >
        {isSidebarOpen() ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside class={`fixed lg:relative bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 flex flex-col transition-all duration-300 z-40 ${
        isMobile() 
          ? `w-80 ${isSidebarOpen() ? 'translate-x-0' : '-translate-x-full'}`
          : `${isSidebarOpen() ? 'w-80' : 'w-20'}`
      }`}>
        {/* Header */}
        <div class="p-6 border-b border-gray-700/50">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles class="w-6 h-6 text-gray-800" />
            </div>
            <div class={`transition-all duration-300 overflow-hidden ${
              isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
            }`}>
              <h2 class="text-xl font-bold whitespace-nowrap">Split Bills</h2>
              <p class="text-gray-400 text-sm whitespace-nowrap">Manage your expenses</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav class="flex-1 p-6 space-y-2">
          {/* Dashboard */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/dashboard")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <Sparkles class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Dashboard</span>
            </button>
          </div>

          {/* Finance */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/finance")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <TrendingUp class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Finance</span>
            </button>
          </div>

          {/* Add Split Bill */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/addsplitbill")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <Plus class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Add Split Bill</span>
            </button>
          </div>

 {/* Pay Bill */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/paybill")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <CreditCard class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Pay Bill</span>
            </button>
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Pay Bill
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>

          {/* Friends */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/friends")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <Users class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Friends</span>
            </button>
          </div>
          {/* Add Friend */}
<div class="relative group">
  <button 
    onClick={() => navigate("/addfriend")} 
    class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
      !isSidebarOpen() ? 'justify-center' : ''
    }`}
  >
    <UserPlus class="w-5 h-5 flex-shrink-0" />
    <span class={`font-medium transition-all duration-300 overflow-hidden ${
      isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
    }`}>Add Friend</span>
  </button>
  {!isSidebarOpen() && !isMobile() && (
    <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      Add Friend
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
    </div>
  )}
</div>
{/* Account */}
<div class="relative group">
  <button 
    onClick={() => navigate("/account")} 
    class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-pink-200 transition-all duration-300 ${
      !isSidebarOpen() ? 'justify-center' : ''
    }`}
  >
    <User class="w-5 h-5 flex-shrink-0" />
    <span class={`font-medium transition-all duration-300 overflow-hidden ${
      isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
    }`}>Account</span>
  </button>
  {!isSidebarOpen() && !isMobile() && (
    <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      Account
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
    </div>
  )}
</div>
{/* Account Settings - Submenu */}
<div class="relative group ml-4">
  <button 
    onClick={() => navigate("/accountsettings")} 
    class={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800/30 hover:text-pink-200 transition-all duration-300 ${
      !isSidebarOpen() ? 'justify-center' : ''
    }`}
  >
    <Settings class="w-4 h-4 flex-shrink-0" />
    <span class={`font-medium text-sm transition-all duration-300 overflow-hidden ${
      isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
    }`}>Account Settings</span>
  </button>
  {!isSidebarOpen() && !isMobile() && (
    <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      Account Settings
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
    </div>
  )}
</div>
        </nav>

       
        {/* Logout Button */}
<div class="relative group">
  <button 
    onClick={handleLogout} 
    class={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 ${
      !isSidebarOpen() ? 'justify-center' : ''
    }`}
  >
    <LogOut class="w-5 h-5 flex-shrink-0" />
    <span class={`font-medium transition-all duration-300 overflow-hidden ${
      isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
    }`}>Log Out</span>
  </button>
  {/* Tooltip untuk collapsed state */}
  {!isSidebarOpen() && !isMobile() && (
    <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      Log Out
      <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
    </div>
  )}
</div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen() && isMobile() && (
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main class={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10 transition-all duration-300 ${
        isMobile() ? 'ml-0' : ''
      }`}>
        {/* Header */}
        <header class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-12 lg:pt-0">
          <div class="flex items-center gap-2">
            {/* Desktop sidebar toggle button */}
            <button
              onClick={toggleSidebar}
              class="hidden lg:block p-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300"
            >
              {isSidebarOpen() ? <ChevronLeft class="w-5 h-5" /> : <ChevronRight class="w-5 h-5" />}
            </button>
            <div>
              <h1 class={`text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                Add Friend
              </h1>
              <p class="text-gray-400 mt-1">Add a new friend to split bills with</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/friends")}
            class="flex items-center gap-2 text-gray-400 hover:text-pink-200 transition-all duration-300"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to Friends
          </button>
        </header>

        {/* Success Message */}
        {showSuccess() && (
          <div class="fixed top-4 right-4 z-50 bg-emerald-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl animate-pulse">
            <Check class="w-5 h-5" />
            <span class="font-medium">Friend added successfully!</span>
          </div>
        )}

        {/* Add Friend Form */}
        <div class={`max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
          <div class="flex items-center gap-3 mb-8">
            <div class="p-3 bg-pink-500/20 rounded-xl">
              <UserPlus class="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Friend Information</h2>
              <p class="text-gray-400">Fill in the details to add a new friend</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Name Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <div class="relative">
                <input
                  type="text"
                  value={formData().name}
                  onInput={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().name ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's full name"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Users class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().name && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <div class="relative">
                <input
                  type="email"
                  value={formData().email}
                  onInput={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().email ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's email address"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().email && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <div class="relative">
                <input
                  type="tel"
                  value={formData().phone}
                  onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().phone ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's phone number"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Phone class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().phone && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().phone}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div class="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/friends")}
                class="flex-1 px-6 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/60 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting()}
                class={`flex-1 px-6 py-3 bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 font-bold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                  isSubmitting() ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting() ? (
                  <>
                    <div class="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                    Adding Friend...
                  </>
                ) : (
                  <>
                    <UserPlus class="w-5 h-5" />
                    Add Friend
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div class={`max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-amber-500/20 rounded-xl">
              <Sparkles class="w-5 h-5 text-amber-400" />
            </div>
            <h3 class="text-lg font-semibold text-white">Tips for Adding Friends</h3>
          </div>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Make sure the email address is correct - your friend will receive notifications here</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Phone numbers are optional but helpful for easier contact</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Once added, you can start splitting bills with this friend immediately</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}