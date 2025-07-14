import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  User, Settings, ChevronLeft, ChevronRight, Bell, Search,
  Menu, X, LogOut, Sparkles, Plus, CreditCard, 
  TrendingUp, Users, UserPlus, Receipt, Calendar, 
  DollarSign, Clock, Heart, Wallet, ArrowUp
} from "lucide-solid";

export default function AccountPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD",
    joined: "January 1, 2025"
  };

  const navigationItems = [
    { icon: Sparkles, label: "Dashboard", path: "/dashboard" },
    { icon: TrendingUp, label: "Finance", path: "/finance" },
    { icon: Plus, label: "Add Split Bill", path: "/addsplitbill" },
    { icon: CreditCard, label: "Pay Bill", path: "/paybill" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: UserPlus, label: "Add Friend", path: "/addfriend" },
    { icon: User, label: "Account", path: "/account", active: true },
    { icon: Settings, label: "Account Settings", path: "/accountsettings", submenu: true },
  ];

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    setTimeout(() => setAnimate(true), 100);
    return () => window.removeEventListener("resize", checkMobile);
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen());

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated Background */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300"
      >
        {isSidebarOpen() ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside class={`fixed lg:relative bg-gray-900/90 backdrop-blur-xl border-r border-gray-700/50 flex flex-col transition-all duration-300 z-40 ${
        isMobile() ? `w-80 ${isSidebarOpen() ? "translate-x-0" : "-translate-x-full"}` : `${isSidebarOpen() ? "w-80" : "w-20"}`
      }`}>
        {/* Header */}
        <div class="p-6 border-b border-gray-700/50">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles class="w-6 h-6 text-gray-800" />
            </div>
            <div class={`transition-all duration-300 overflow-hidden ${
              isSidebarOpen() ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
            }`}>
              <h2 class="text-xl font-bold whitespace-nowrap">Split Bills</h2>
              <p class="text-gray-400 text-sm whitespace-nowrap">Manage your expenses</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav class="flex-1 p-6 space-y-2">
          {navigationItems.map((item) => (
            <div class="relative group">
              <button
                onClick={() => navigate(item.path)}
                class={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  item.active 
                    ? "bg-pink-200/10 text-pink-200 border border-pink-200/20" 
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-pink-200"
                } ${!isSidebarOpen() ? "justify-center" : ""} ${
                  item.submenu ? "ml-4" : ""
                }`}
              >
                <item.icon class={`flex-shrink-0 ${item.submenu ? "w-4 h-4" : "w-5 h-5"}`} />
                <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarOpen() ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                } ${item.submenu ? "text-sm" : ""}`}>
                  {item.label}
                </span>
              </button>
              {!isSidebarOpen() && !isMobile() && (
                <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {item.label}
                  <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

       

        {/* Logout Button */}
        <div class="p-6 pt-0">
          <div class="relative group">
            <button
              onClick={handleLogout}
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 ${
                !isSidebarOpen() ? "justify-center" : ""
              }`}
            >
              <LogOut class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarOpen() ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}>
                Log Out
              </span>
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

      {/* Mobile overlay */}
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
            <button
              onClick={toggleSidebar}
              class="hidden lg:block p-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300"
            >
              {isSidebarOpen() ? <ChevronLeft class="w-5 h-5" /> : <ChevronRight class="w-5 h-5" />}
            </button>
            <div>
              <h1 class={`text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent transition-all duration-1000 ${
                animate() ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
              }`}>
                Profile Overview
              </h1>
              <p class="text-gray-400 mt-1">View and manage your profile information</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <Search class="w-5 h-5" />
            </button>
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <Bell class="w-5 h-5" />
            </button>
            <button
              class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
              onClick={() => navigate("/accountsettings")}
            >
              Account Settings
            </button>
          </div>
        </header>

        {/* Profile Card */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 hover:scale-105 shadow-lg shadow-pink-200/5 ${
          animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style="transition-delay: 200ms">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold shadow-lg">
              {user.avatar}
            </div>
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-bold mb-2 text-white">{user.name}</h2>
              <p class="text-gray-400 mb-1">{user.email}</p>
              <div class="flex items-center gap-2 text-gray-500 text-sm justify-center md:justify-start">
                <Calendar class="w-4 h-4" />
                <span>Member since {user.joined}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 hover:scale-105 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <Receipt class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-emerald-400" />
                <span class="text-emerald-400 text-sm font-medium">+12%</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">$1,234.56</h3>
            <p class="text-gray-400 text-sm">Total Expenses</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 hover:scale-105 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <Users class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-purple-400" />
                <span class="text-purple-400 text-sm font-medium">+5%</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">5</h3>
            <p class="text-gray-400 text-sm">Active Groups</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 hover:scale-105 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 800ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-500/20 rounded-xl">
                <TrendingUp class="w-6 h-6 text-pink-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-pink-400" />
                <span class="text-pink-400 text-sm font-medium">+8%</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">23</h3>
            <p class="text-gray-400 text-sm">Split Bills</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${
          animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style="transition-delay: 1000ms">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-blue-500/20 rounded-xl">
              <Clock class="w-5 h-5 text-blue-400" />
            </div>
            <h2 class="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div class="space-y-4">
            <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign class="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-white">Split dinner bill</p>
                    <div class="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar class="w-4 h-4" />
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-emerald-300 font-bold">$45.00</p>
                  <p class="text-emerald-400 text-sm">Completed</p>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users class="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-white">Added new friend</p>
                    <div class="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar class="w-4 h-4" />
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-purple-300 font-bold">Sarah</p>
                  <p class="text-purple-400 text-sm">Friend Added</p>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Heart class="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-white">Vacation expenses</p>
                    <div class="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar class="w-4 h-4" />
                      <span>3 days ago</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-amber-300 font-bold">$350.00</p>
                  <p class="text-amber-400 text-sm">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}