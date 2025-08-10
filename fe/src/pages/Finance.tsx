import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Clock, Heart, TrendingUp, ArrowUp, ArrowDown, CreditCard, Wallet, Users, UserPlus, Calendar, Bell, Search, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, LogOut, Settings, User, Receipt, Target, PiggyBank } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Type definitions
interface MonthlySpending {
  month: string;
  amount: number;
  category: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'settled' | 'pending';
  category: string;
  participants: string[];
}

interface PendingPayment {
  id: string;
  from: string;
  description: string;
  amount: number;
  dueDate: string;
  avatar: string;
}

export default function FinancePage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Empty data - no auto-population
  const [monthlySpending] = createSignal<MonthlySpending[]>([]);

  const [recentTransactions] = createSignal<Transaction[]>([]);

  const [pendingPayments] = createSignal<PendingPayment[]>([]);

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

  // Calculate financial metrics - will return 0 for empty arrays
  const totalExpenses = () => monthlySpending().reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = () => pendingPayments().reduce((sum, payment) => sum + payment.amount, 0);
  const settledAmount = () => recentTransactions()
    .filter(t => t.status === "settled")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Dashboard
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>

          {/* Finance - Active */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/finance")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl bg-pink-200/10 border border-pink-200/20 text-pink-200 hover:bg-pink-200/20 transition-all duration-300 ${
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
        <div class="relative group p-6">
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
                Finance Dashboard
              </h1>
              <p class="text-gray-400 mt-1">Monitor your spending patterns and financial health</p>
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
              onClick={() => navigate("/addsplitbill")}
            >
              + New Expense
            </button>
          </div>
        </header>

        {/* Financial Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <ArrowUp class="w-4 h-4" />
                <span class="text-sm font-medium">--</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(settledAmount())}</h3>
            <p class="text-gray-400 text-sm">Total Settled</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-amber-500/20 rounded-xl">
                <Clock class="w-6 h-6 text-amber-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <ArrowDown class="w-4 h-4" />
                <span class="text-sm font-medium">{pendingPayments().length} items</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(pendingAmount())}</h3>
            <p class="text-gray-400 text-sm">Pending Payments</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <TrendingUp class="w-4 h-4" />
                <span class="text-sm font-medium">--</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(totalExpenses())}</h3>
            <p class="text-gray-400 text-sm">Monthly Spending</p>
          </div>
        </div>

        {/* Spending Chart */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-pink-200" />
            Monthly Spending Trends
          </h2>
          {monthlySpending().length === 0 ? (
            <div class="flex items-center justify-center h-32 text-gray-500">
              <div class="text-center">
                <TrendingUp class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p>No spending data available</p>
                <p class="text-sm">Add some expenses to see your trends</p>
              </div>
            </div>
          ) : (
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <For each={monthlySpending()}>
                {(item, index) => (
                  <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                    <div class="text-center">
                      <div class="text-pink-200 font-semibold text-sm mb-1">{item.month}</div>
                      <div class="text-white text-lg font-bold mb-2">
                        {formatCurrency(item.amount).replace('Rp ', 'Rp')}
                      </div>
                      <div class="text-gray-400 text-xs">{item.category}</div>
                      <div class="mt-2 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-gradient-to-r from-pink-200 to-pink-300 rounded-full transition-all duration-1000"
                          style={{width: `${(item.amount / Math.max(...monthlySpending().map(s => s.amount))) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1000ms">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-500/20 rounded-xl">
                  <Users class="w-5 h-5 text-amber-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Pending Payments</h2>
              </div>
              <div class="text-sm text-gray-400">
                {pendingPayments().length} payments
              </div>
            </div>
            
            {pendingPayments().length === 0 ? (
              <div class="flex items-center justify-center h-40 text-gray-500">
                <div class="text-center">
                  <Clock class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No pending payments</p>
                  <p class="text-sm">All your bills are up to date!</p>
                </div>
              </div>
            ) : (
              <div class="max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <For each={pendingPayments()}>
                  {(payment) => (
                    <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {payment.avatar}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{payment.from}</h3>
                            <p class="text-gray-400 text-sm">{payment.description}</p>
                            <p class="text-amber-400 text-xs">Due: {payment.dueDate}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-white font-bold">{formatCurrency(payment.amount)}</div>
                          <button class="text-amber-400 hover:text-amber-300 text-sm mt-1 hover:underline transition-colors">
                            Remind
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1200ms">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-500/20 rounded-xl">
                  <Receipt class="w-5 h-5 text-emerald-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Recent Transactions</h2>
              </div>
              <div class="text-sm text-gray-400">
                {recentTransactions().length} transactions
              </div>
            </div>
            
            {recentTransactions().length === 0 ? (
              <div class="flex items-center justify-center h-40 text-gray-500">
                <div class="text-center">
                  <Receipt class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No recent transactions</p>
                  <p class="text-sm">Start splitting bills to see your activity</p>
                </div>
              </div>
            ) : (
              <div class="max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <For each={recentTransactions()}>
                  {(transaction) => (
                    <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                          <div class={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.category === 'Food' ? 'bg-orange-500/20' :
                            transaction.category === 'Entertainment' ? 'bg-purple-500/20' :
                            transaction.category === 'Shopping' ? 'bg-blue-500/20' :
                            'bg-green-500/20'
                          }`}>
                            {transaction.category === 'Food' ? '🍕' :
                             transaction.category === 'Entertainment' ? '🎬' :
                             transaction.category === 'Shopping' ? '🛍️' :
                             '🚗'}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{transaction.description}</h3>
                            <p class="text-gray-400 text-sm">{transaction.date}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-white font-bold">{formatCurrency(transaction.amount)}</div>
                          <div class={`text-xs px-2 py-1 rounded-full mt-1 ${
                            transaction.status === 'settled' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <For each={transaction.participants}>
                          {(participant) => (
                            <span class="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                              {participant}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}