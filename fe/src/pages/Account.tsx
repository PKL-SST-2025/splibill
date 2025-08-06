import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  User, Settings, ChevronLeft, ChevronRight, Bell, Search,
  Menu, X, LogOut, Sparkles, Plus, CreditCard, 
  TrendingUp, Users, UserPlus, Receipt, Calendar, 
  DollarSign, Clock, Heart, Wallet, ArrowUp, Star,
  Award, Target, Activity, BarChart3, PieChart,
  CheckCircle, AlertCircle, Timer, Zap
} from "lucide-solid";

export default function AccountPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("overview");

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD",
    joined: "January 1, 2025",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    verified: true,
    level: "Gold Member"
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

  const achievements = [
    { icon: Award, title: "First Split", description: "Created your first split bill", earned: true },
    { icon: Target, title: "Budget Master", description: "Stayed within budget for 3 months", earned: true },
    { icon: Star, title: "Social Spender", description: "Added 10+ friends", earned: true },
    { icon: Zap, title: "Quick Payer", description: "Paid bills within 24 hours", earned: false }
  ];

  const monthlyData = [
    { month: "Jan", spent: 450, saved: 120 },
    { month: "Feb", spent: 380, saved: 180 },
    { month: "Mar", spent: 520, saved: 95 },
    { month: "Apr", spent: 340, saved: 210 },
    { month: "May", spent: 480, saved: 140 },
    { month: "Jun", spent: 390, saved: 175 }
  ];

  const recentTransactions = [
    {
      icon: DollarSign,
      title: "Dinner at Mario's",
      time: "2 hours ago",
      amount: "-$45.00",
      status: "split",
      participants: 3
    },
    {
      icon: CreditCard,
      title: "Monthly Utilities",
      time: "1 day ago",
      amount: "-$125.00",
      status: "paid",
      participants: 1
    },
    {
      icon: Users,
      title: "Weekend Trip",
      time: "3 days ago",
      amount: "-$320.00",
      status: "pending",
      participants: 5
    },
    {
      icon: Receipt,
      title: "Grocery Shopping",
      time: "5 days ago",
      amount: "-$78.50",
      status: "completed",
      participants: 2
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "emerald";
      case "paid": return "blue";
      case "split": return "purple";
      case "pending": return "amber";
      default: return "gray";
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
                My Account
              </h1>
              <p class="text-gray-400 mt-1">Manage your profile and track your activity</p>
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
              Edit Profile
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div class={`flex flex-wrap gap-2 p-1 bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-1000 ${
          animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style="transition-delay: 100ms">
          {[
            { key: "overview", label: "Overview", icon: User },
            { key: "activity", label: "Activity", icon: Activity },
            { key: "achievements", label: "Achievements", icon: Award },
            { key: "analytics", label: "Analytics", icon: BarChart3 }
          ].map((tab) => (
            <button
              onClick={() => setActiveTab(tab.key)}
              class={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab() === tab.key
                  ? "bg-pink-200/10 text-pink-200 border border-pink-200/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <tab.icon class="w-4 h-4" />
              <span class="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab() === "overview" && (
          <div class="space-y-6">
            {/* Enhanced Profile Card */}
            <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 transition-all duration-1000 ${
              animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} style="transition-delay: 200ms">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div class="lg:col-span-2">
                  <div class="flex flex-col md:flex-row items-start gap-6">
                    <div class="relative">
                      <div class="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold shadow-lg">
                        {user.avatar}
                      </div>
                      {user.verified && (
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle class="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div class="flex-1">
                      <div class="mb-4">
                        <h2 class="text-2xl font-bold mb-1 text-white">{user.name}</h2>
                        <p class="text-pink-200 text-sm font-medium mb-2">{user.level}</p>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="flex items-center gap-2 text-gray-300">
                          <User class="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-300">
                          <Calendar class="w-4 h-4" />
                          <span>Member since {user.joined}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div class="bg-gray-800/40 rounded-xl p-6">
                  <h3 class="text-lg font-semibold mb-4 text-white">Quick Stats</h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Total Spent</span>
                      <span class="text-white font-bold">$2,456.78</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Active Groups</span>
                      <span class="text-white font-bold">8</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Friends</span>
                      <span class="text-white font-bold">15</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">This Month</span>
                      <span class="text-emerald-400 font-bold">$389.45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Total Balance", value: "$1,234.56", change: "+12%", icon: Wallet, color: "emerald" },
                { title: "This Month", value: "$389.45", change: "+8%", icon: TrendingUp, color: "blue" },
                { title: "Pending Bills", value: "3", change: "-2", icon: Clock, color: "amber" },
                { title: "Friends", value: "15", change: "+2", icon: Users, color: "purple" }
              ].map((card, index) => (
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:scale-105 transition-all duration-500 ${
                  animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`} style={`transition-delay: ${300 + index * 100}ms`}>
                  <div class="flex items-center justify-between mb-4">
                    <div class={`p-3 bg-${card.color}-500/20 rounded-xl`}>
                      <card.icon class={`w-6 h-6 text-${card.color}-400`} />
                    </div>
                    <span class={`text-${card.color}-400 text-sm font-medium`}>{card.change}</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-1">{card.value}</h3>
                  <p class="text-gray-400 text-sm">{card.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab() === "activity" && (
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 200ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-blue-500/20 rounded-xl">
                <Activity class="w-5 h-5 text-blue-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Recent Transactions</h2>
            </div>
            
            <div class="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div class="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                  <div class="flex items-center gap-4">
                    <div class={`w-12 h-12 bg-${getStatusColor(transaction.status)}-500/20 rounded-xl flex items-center justify-center`}>
                      <transaction.icon class={`w-6 h-6 text-${getStatusColor(transaction.status)}-400`} />
                    </div>
                    <div>
                      <h3 class="font-semibold text-white">{transaction.title}</h3>
                      <div class="flex items-center gap-4 text-sm text-gray-400">
                        <span>{transaction.time}</span>
                        <span>•</span>
                        <span>{transaction.participants} participant{transaction.participants > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-white">{transaction.amount}</p>
                    <p class={`text-${getStatusColor(transaction.status)}-400 text-sm capitalize`}>{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab() === "achievements" && (
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 200ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-amber-500/20 rounded-xl">
                <Award class="w-5 h-5 text-amber-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Achievements</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div class={`p-6 rounded-xl border transition-all duration-300 ${
                  achievement.earned 
                    ? "bg-amber-500/10 border-amber-400/30 hover:bg-amber-500/20" 
                    : "bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60"
                }`}>
                  <div class="flex items-start gap-4">
                    <div class={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned ? "bg-amber-500/20" : "bg-gray-700/40"
                    }`}>
                      <achievement.icon class={`w-6 h-6 ${
                        achievement.earned ? "text-amber-400" : "text-gray-500"
                      }`} />
                    </div>
                    <div class="flex-1">
                      <h3 class={`font-semibold mb-1 ${
                        achievement.earned ? "text-amber-200" : "text-gray-300"
                      }`}>{achievement.title}</h3>
                      <p class="text-sm text-gray-400">{achievement.description}</p>
                      {achievement.earned && (
                        <div class="flex items-center gap-1 mt-2">
                          <CheckCircle class="w-4 h-4 text-emerald-400" />
                          <span class="text-emerald-400 text-sm font-medium">Earned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab() === "analytics" && (
          <div class="space-y-6">
            <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-1000 ${
              animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} style="transition-delay: 200ms">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-purple-500/20 rounded-xl">
                  <BarChart3 class="w-5 h-5 text-purple-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Spending Analytics</h2>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Chart Placeholder */}
                <div class="bg-gray-800/40 rounded-xl p-6">
                  <h3 class="text-lg font-semibold mb-4 text-white">Monthly Overview</h3>
                  <div class="h-48 flex items-end justify-center gap-2">
                    {monthlyData.map((data, index) => (
                      <div class="flex flex-col items-center gap-2">
                        <div class="flex flex-col gap-1">
                          <div 
                            class="w-8 bg-pink-400 rounded-t"
                            style={`height: ${(data.spent / 600) * 120}px`}
                          ></div>
                          <div 
                            class="w-8 bg-emerald-400 rounded-b"
                            style={`height: ${(data.saved / 250) * 60}px`}
                          ></div>
                        </div>
                        <span class="text-xs text-gray-400">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div class="flex justify-center gap-6 mt-4">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 bg-pink-400 rounded"></div>
                      <span class="text-sm text-gray-400">Spent</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 bg-emerald-400 rounded"></div>
                      <span class="text-sm text-gray-400">Saved</span>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div class="bg-gray-800/40 rounded-xl p-6">
                  <h3 class="text-lg font-semibold mb-4 text-white">Top Categories</h3>
                  <div class="space-y-4">
                    {[
                      { name: "Food & Dining", amount: "$450", percentage: 65, color: "pink" },
                      { name: "Utilities", amount: "$280", percentage: 40, color: "blue" },
                      { name: "Entertainment", amount: "$180", percentage: 25, color: "purple" },
                      { name: "Travel", amount: "$120", percentage: 15, color: "emerald" }
                    ].map((category) => (
                      <div class="space-y-2">
                        <div class="flex justify-between items-center">
                          <span class="text-white text-sm">{category.name}</span>
                          <span class="text-gray-400 text-sm">{category.amount}</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            class={`bg-${category.color}-400 h-2 rounded-full transition-all duration-1000`}
                            style={`width: ${category.percentage}%`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}