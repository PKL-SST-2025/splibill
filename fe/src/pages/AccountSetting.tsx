import { createSignal, onMount } from "solid-js";
import { ChevronLeft, ChevronRight, LogOut, Menu, Sparkles, User, Lock, Save, X, Settings, TrendingUp, Plus, CreditCard, Users, UserPlus, Search, Bell, Camera, Eye, EyeOff, Shield, Globe, Smartphone } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("profile");

  const [name, setName] = createSignal("John Doe");
  const [email, setEmail] = createSignal("john@example.com");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

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
    if (confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "devices", label: "Devices", icon: Smartphone }
  ];

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
              <p class="text-gray-400 text-sm whitespace-nowrap">Account Settings</p>
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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Dashboard
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Finance
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Add Split Bill
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Friends
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
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
        <div class="p-6">
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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Log Out
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>
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
                Account Settings
              </h1>
              <p class="text-gray-400 mt-1">Manage your account preferences and security</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <Search class="w-5 h-5" />
            </button>
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <Bell class="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Profile Header Card */}
        <div class={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative group">
              <div class="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-gray-900 text-3xl font-bold shadow-xl">
                JD
              </div>
              <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:scale-110 transition-transform duration-200">
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-bold text-white mb-1">{name()}</h2>
              <p class="text-gray-400 mb-3">{email()}</p>
              <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  Verified Account
                </span>
                <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
          <div class="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                class={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab() === tab.id
                    ? 'bg-pink-200/20 text-pink-200 border border-pink-200/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <tab.icon class="w-4 h-4" />
                <span class="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div class="lg:col-span-2 space-y-6">
            {activeTab() === "profile" && (
              <>
                {/* Personal Information */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User class="w-5 h-5 text-pink-200" />
                    Personal Information
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                      <input 
                        type="text" 
                        value="John"
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value="Doe"
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={email()} 
                        onInput={(e) => setEmail(e.currentTarget.value)} 
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 123-4567"
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Country</label>
                      <select class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Indonesia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 500ms">
                  <h3 class="text-xl font-bold text-white mb-6">About You</h3>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea 
                      rows="4"
                      placeholder="Tell us about yourself..."
                      class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90 resize-none"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "security" && (
              <>
                {/* Password Change */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock class="w-5 h-5 text-purple-400" />
                    Change Password
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                      <div class="relative">
                        <input 
                          type={showPassword() ? "text" : "password"}
                          placeholder="Enter current password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <div class="relative">
                        <input 
                          type={showNewPassword() ? "text" : "password"}
                          value={password()} 
                          onInput={(e) => setPassword(e.currentTarget.value)} 
                          placeholder="Enter new password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showNewPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                      <div class="relative">
                        <input 
                          type={showConfirmPassword() ? "text" : "password"}
                          placeholder="Confirm new password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showConfirmPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 500ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield class="w-5 h-5 text-green-400" />
                    Two-Factor Authentication
                  </h3>
                  <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                    <div>
                      <p class="text-white font-medium">Enable 2FA</p>
                      <p class="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button class="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-all duration-200">
                      Enable
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "privacy" && (
              <>
                {/* Privacy Settings */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe class="w-5 h-5 text-blue-400" />
                    Privacy Controls
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Profile Visibility</p>
                        <p class="text-gray-400 text-sm">Control who can see your profile</p>
                      </div>
                      <select class="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Activity Status</p>
                        <p class="text-gray-400 text-sm">Show when you're online</p>
                      </div>
                      <button class="bg-pink-200/20 text-pink-200 px-4 py-2 rounded-lg border border-pink-200/30">
                        Enabled
                      </button>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Data Collection</p>
                        <p class="text-gray-400 text-sm">Allow analytics and performance tracking</p>
                      </div>
                      <button class="bg-gray-600/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-600/30">
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "devices" && (
              <>
                {/* Connected Devices */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Smartphone class="w-5 h-5 text-cyan-400" />
                    Connected Devices
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Smartphone class="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p class="text-white font-medium">iPhone 15 Pro</p>
                          <p class="text-gray-400 text-sm">Last active: 2 minutes ago</p>
                        </div>
                      </div>
                      <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                        Current
                      </span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Globe class="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p class="text-white font-medium">Chrome on MacBook</p>
                          <p class="text-gray-400 text-sm">Last active: 1 hour ago</p>
                        </div>
                      </div>
                      <button class="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-all duration-200">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div class="space-y-6">
            {/* Quick Actions */}
            <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
              <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button class="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-pink-200 transition-all duration-300">
                  <Save class="w-4 h-4" />
                  Export Data
                </button>
                <button class="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-pink-200 transition-all duration-300">
                  <Lock class="w-4 h-4" />
                  Privacy Settings
                </button>
                <button class="w-full flex items-center gap-3 p-3 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-300 border border-red-500/20">
                  <X class="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div class={`bg-gradient-to-br from-pink-200/10 to-pink-300/5 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 700ms">
              <h3 class="text-lg font-bold text-white mb-4">Account Status</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Storage Used</span>
                  <span class="text-white">2.3 GB / 5 GB</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-pink-200 to-pink-300 h-2 rounded-full" style="width: 46%"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Plan</span>
                  <span class="text-pink-200">Premium</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Member Since</span>
                  <span class="text-white">Jan 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div class={`flex flex-col sm:flex-row gap-4 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <button 
            onClick={handleSave}
            class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-8 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <Save class="w-5 h-5" />
            Save Changes
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            class="bg-gray-800/60 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700/60 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}