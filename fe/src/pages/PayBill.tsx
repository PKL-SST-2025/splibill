// src/pages/PayBillPage.tsx

import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Clock, Heart, TrendingUp, ArrowUp, ArrowDown, CreditCard, Wallet, Users, UserPlus, Calendar, Bell, Search, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, LogOut, CheckCircle, AlertCircle,Settings, User } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

export default function PayBillPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Sample data for bills to pay
  const [billsToPay] = createSignal([
    { id: 1, title: "Split Bill - Dinner at Sushi Tei", amount: 120000, status: "Unpaid", group: "Rina, Agus", date: "2025-07-12", dueDate: "2025-07-15", icon: DollarSign },
    { id: 2, title: "Trip to Bandung", amount: 300000, status: "Unpaid", group: "Lina, Bagus", date: "2025-07-11", dueDate: "2025-07-20", icon: Heart },
    { id: 3, title: "Coffee Meeting Split", amount: 45000, status: "Unpaid", group: "Dina, Sari", date: "2025-07-10", dueDate: "2025-07-14", icon: CreditCard },
    { id: 4, title: "Lunch with Team", amount: 85000, status: "Unpaid", group: "Budi, Andi", date: "2025-07-09", dueDate: "2025-07-16", icon: DollarSign },
    { id: 5, title: "Shopping Mall Trip", amount: 250000, status: "Unpaid", group: "Sari, Lina", date: "2025-07-08", dueDate: "2025-07-18", icon: Heart },
    { id: 6, title: "Movie Night", amount: 90000, status: "Unpaid", group: "Rio, Maya", date: "2025-07-07", dueDate: "2025-07-17", icon: DollarSign },
    { id: 7, title: "Gym Membership", amount: 150000, status: "Unpaid", group: "Andi, Budi", date: "2025-07-06", dueDate: "2025-07-19", icon: CreditCard },
  ]);

  // Sample data for recent payments
  const [recentPayments] = createSignal([
    { id: 1, title: "Movie Night Split", amount: 75000, status: "Paid", group: "Lisa, Rio", date: "2025-07-08", icon: CheckCircle },
    { id: 2, title: "Karaoke Session", amount: 120000, status: "Paid", group: "Maya, Dani", date: "2025-07-07", icon: CheckCircle },
    { id: 3, title: "Restaurant Bill", amount: 180000, status: "Paid", group: "Sinta, Rina", date: "2025-07-06", icon: CheckCircle },
    { id: 4, title: "Concert Tickets", amount: 350000, status: "Paid", group: "Bagus, Lina", date: "2025-07-05", icon: CheckCircle },
    { id: 5, title: "Weekend Trip", amount: 500000, status: "Paid", group: "Dina, Sari", date: "2025-07-04", icon: CheckCircle },
    { id: 6, title: "Birthday Party", amount: 200000, status: "Paid", group: "Rio, Maya", date: "2025-07-03", icon: CheckCircle },
  ]);

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

  const handlePay = (id: number) => {
    if (confirm("Are you sure you want to pay this bill?")) {
      alert(`Processing payment for bill ID: ${id}`);
      // Logic untuk update status pembayaran bisa dimasukkan di sini
    }
  };

  const totalUnpaid = () => billsToPay().reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = () => recentPayments().reduce((sum, payment) => sum + payment.amount, 0);
  const totalBills = () => billsToPay().length;

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

          {/* Pay Bill - Active */}
          <div class="relative group">
            <button 
              onClick={() => navigate("/paybill")} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl bg-pink-200/10 border border-pink-200/20 text-pink-200 hover:bg-pink-200/20 transition-all duration-300 ${
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
        <div class="p-6 border-t border-gray-700/50">
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
                Pay Your Bills
              </h1>
              <p class="text-gray-400 mt-1">Review and complete your payments</p>
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
              + Add Bill
            </button>
          </div>
        </header>

        {/* Payment Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-red-500/20 rounded-xl">
                <AlertCircle class="w-6 h-6 text-red-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-red-400" />
                <span class="text-red-400 text-sm font-medium">{totalBills()} bills</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalUnpaid().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Total Unpaid</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-emerald-400" />
                <span class="text-emerald-400 text-sm font-medium">+{recentPayments().length}</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalPaid().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Recently Paid</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <Clock class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowDown class="w-4 h-4 text-purple-400" />
                <span class="text-purple-400 text-sm font-medium">Due soon</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{billsToPay().filter(bill => new Date(bill.dueDate) <= new Date(Date.now() + 3*24*60*60*1000)).length}</h3>
            <p class="text-gray-400 text-sm">Bills Due Soon</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bills to Pay - With Scrollable Content */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 flex flex-col ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-red-500/20 rounded-xl">
                <AlertCircle class="w-5 h-5 text-red-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Bills to Pay</h2>
              <div class="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {billsToPay().length} pending
              </div>
            </div>
            
            {/* Scrollable container */}
            <div class="flex-1 overflow-hidden">
              <div class="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                <For each={billsToPay()}>
                  {(bill) => (
                    <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105">
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <bill.icon class="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p class="font-semibold text-white">{bill.title}</p>
                            <p class="text-gray-400 text-sm">Group: {bill.group}</p>
                            <div class="flex items-center gap-2 text-gray-400 text-sm">
                              <Calendar class="w-4 h-4" />
                              <span>Due: {bill.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-red-300 font-bold">Rp {bill.amount.toLocaleString()}</p>
                          <p class="text-red-400 text-sm">{bill.status}</p>
                        </div>
                      </div>
                      <button
                        class="w-full bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-4 py-2 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
                        onClick={() => handlePay(bill.id)}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Recent Payments - With Scrollable Content */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 flex flex-col ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1000ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-emerald-500/20 rounded-xl">
                <CheckCircle class="w-5 h-5 text-emerald-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Recent Payments</h2>
              <div class="ml-auto bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                {recentPayments().length} completed
              </div>
            </div>
            
            {/* Scrollable container */}
            <div class="flex-1 overflow-hidden">
              <div class="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
                <For each={recentPayments()}>
                  {(payment) => (
                    <div class="p-4 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                            <payment.icon class="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p class="font-semibold text-white">{payment.title}</p>
                            <p class="text-gray-400 text-sm">Group: {payment.group}</p>
                            <div class="flex items-center gap-2 text-gray-400 text-sm">
                              <Calendar class="w-4 h-4" />
                              <span>Paid: {payment.date}</span>
                            </div>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-emerald-300 font-bold">Rp {payment.amount.toLocaleString()}</p>
                          <p class="text-emerald-400 text-sm">{payment.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}