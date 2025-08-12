import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  User, TrendingUp, Users, UserPlus, Receipt, Calendar, 
  DollarSign, Clock, Heart, Wallet, ArrowUp, Star,
  Award, Target, Activity, BarChart3, PieChart,
  CheckCircle, AlertCircle, Timer, Zap
} from "lucide-solid";
import Sidebar from "../layouts/Sidebar"; // Import komponen Sidebar
import Header from "../layouts/Header";   // Import komponen Header

export default function AccountPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("overview");
  const [notifications, setNotifications] = createSignal([
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      message: "Sarah paid $25.00 for dinner at Mario's",
      time: "5 minutes ago",
      read: false,
      icon: "check"
    },
    {
      id: 2,
      type: "reminder",
      title: "Bill Reminder",
      message: "Monthly utilities bill is due in 2 days",
      time: "1 hour ago",
      read: false,
      icon: "alert"
    },
    {
      id: 3,
      type: "info",
      title: "New Friend Added",
      message: "Mike has been added to your friends list",
      time: "3 hours ago",
      read: true,
      icon: "user"
    }
  ]);

  // Sample search data untuk header
  const [searchData] = createSignal([
    {
      type: "bill",
      title: "Dinner at Mario's",
      subtitle: "$45.00 • Split with 3 friends",
      date: "2024-08-10",
      status: "active",
      id: "bill-1"
    },
    {
      type: "bill", 
      title: "Monthly Utilities",
      subtitle: "$125.00 • Personal expense",
      date: "2024-08-09",
      status: "paid",
      id: "bill-2"
    },
    {
      type: "friend",
      title: "Sarah Johnson",
      subtitle: "sarah@example.com",
      status: "Paid",
      id: "friend-1"
    },
    {
      type: "friend",
      title: "Mike Chen", 
      subtitle: "mike@example.com",
      status: "Pending",
      id: "friend-2"
    }
  ]);

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
      icon: Receipt,
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

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main content */}
      <main class={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10 transition-all duration-300`}>
        {/* Header Component */}
        <Header 
          title="My Account"
          subtitle="Manage your profile and track your activity"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

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