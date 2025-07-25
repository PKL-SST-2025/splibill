import { createSignal, onMount } from "solid-js";
import { ChevronLeft, ChevronRight, LogOut, Menu, Sparkles, User, Lock, Save, X, Settings, TrendingUp, Plus, CreditCard, Users, UserPlus, Search, Bell } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);

  const [name, setName] = createSignal("John Doe");
  const [email, setEmail] = createSignal("john@example.com");
  const [password, setPassword] = createSignal("");

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
              <p class="text-gray-400 mt-1">Update your profile and password</p>
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

        {/* Settings Forms */}
        <div class="max-w-2xl space-y-6">
          {/* Profile Info Card */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.02] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <User class="w-6 h-6 text-emerald-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Profile Information</h2>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name()} 
                  onInput={(e) => setName(e.currentTarget.value)} 
                  class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email()} 
                  onInput={(e) => setEmail(e.currentTarget.value)} 
                  class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
          </div>

          {/* Password Change Card */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.02] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <Lock class="w-6 h-6 text-purple-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Change Password</h2>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                <input 
                  type="password" 
                  class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={password()} 
                  onInput={(e) => setPassword(e.currentTarget.value)} 
                  class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div class={`flex flex-col sm:flex-row gap-4 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
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
        </div>
      </main>
    </div>
  );
}