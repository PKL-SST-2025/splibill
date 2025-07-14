import { createSignal, createEffect, For, onMount } from "solid-js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { CalendarDays, Users, Plus, Sparkles, TrendingUp, Wallet, Clock, Bell, Search, Menu, UserPlus, X, ChevronLeft, ChevronRight, LogOut, CreditCard, Settings, User } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Theme
am4core.useTheme(am4themesAnimated);

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(new Date());
  const [splitBills, setSplitBills] = createSignal([
    { date: "2025-07-12", total: 45000, description: "Dinner at Cafe", participants: 4 },
    { date: "2025-07-11", total: 60000, description: "Movie Night", participants: 3 },
    { date: "2025-07-10", total: 30000, description: "Lunch", participants: 2 },
    { date: "2025-07-09", total: 80000, description: "Shopping", participants: 5 },
    
  ]);
  const [friends, setFriends] = createSignal([
    { name: "Dina", status: "Waiting", avatar: "D", amount: 15000 },
    { name: "Ali", status: "Paid", avatar: "A", amount: 22500 },
    { name: "Sarah", status: "Waiting", avatar: "S", amount: 18000 },
    { name: "Kevin", status: "Paid", avatar: "K", amount: 12000 },
  ]);

  // Check if mobile on mount and window resize
  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.paddingLeft = 20;
    chart.paddingTop = 20;
    chart.paddingBottom = 20;

    // Dark theme for chart
    chart.background.fill = am4core.color("#1f2937");
    chart.plotContainer.background.fill = am4core.color("#1f2937");

    chart.data = splitBills().map((bill) => ({
      date: new Date(bill.date),
      value: bill.total,
    }));

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.stroke = am4core.color("#374151");
    dateAxis.renderer.labels.template.fill = am4core.color("#d1d5db");
    
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color("#374151");
    valueAxis.renderer.labels.template.fill = am4core.color("#d1d5db");

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";
    series.strokeWidth = 3;
    series.stroke = am4core.color("#f9a8d4");
    series.fillOpacity = 0.1;
    series.fill = am4core.color("#f9a8d4");

    const bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#f9a8d4");
    bullet.circle.stroke = am4core.color("#ffffff");
    bullet.circle.strokeWidth = 2;

    return () => {
      chart.dispose();
      window.removeEventListener('resize', checkMobile);
    };
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

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

  const totalExpenses = () => splitBills().reduce((sum, bill) => sum + bill.total, 0);
  const pendingPayments = () => friends().filter(f => f.status === "Waiting").length;
  const todayBills = () => splitBills().filter(b => b.date === selectedDate().toISOString().split("T")[0]);

  // Get sidebar width based on state
  const sidebarWidth = () => {
    if (isMobile()) return isSidebarOpen() ? 320 : 0;
    return isSidebarOpen() ? 320 : 80;
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
              class={`w-full flex items-center gap-3 p-3 rounded-xl bg-pink-200/10 border border-pink-200/20 text-pink-200 hover:bg-pink-200/20 transition-all duration-300 ${
                !isSidebarOpen() ? 'justify-center' : ''
              }`}
            >
              <Sparkles class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden ${
                isSidebarOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Dashboard</span>
            </button>

            {/* Tooltip for collapsed state */}
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
              <h1 class="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p class="text-gray-400 mt-1">Welcome back! Here's your expense overview</p>
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

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl">
                <Wallet class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-green-400 text-sm font-medium">+12.5%</span>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalExpenses().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Total Expenses</p>
          </div>

          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl">
                <Clock class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-yellow-400 text-sm font-medium">{pendingPayments()} pending</span>
            </div>
            <h3 class="text-2xl font-bold text-white">{friends().length}</h3>
            <p class="text-gray-400 text-sm">Active Friends</p>
          </div>

          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group md:col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl">
                <TrendingUp class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-blue-400 text-sm font-medium">This month</span>
            </div>
            <h3 class="text-2xl font-bold text-white">{todayBills().length}</h3>
            <p class="text-gray-400 text-sm">Today's Bills</p>
          </div>
        </div>

        {/* Chart Section */}
        <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Expense Trend</h2>
            <div class="flex items-center gap-2 text-sm text-gray-400">
              <div class="w-3 h-3 bg-pink-200 rounded-full"></div>
              <span>Split Bills</span>
            </div>
          </div>
          <div id="chartdiv" class="w-full h-80 rounded-xl overflow-hidden" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CalendarDays class="w-5 h-5 text-pink-200" />
              Recent Activities
            </h2>
            <div class="space-y-4">
              <For each={splitBills().slice(0, 4)}>
                {(bill) => (
                  <div class="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-pink-200/10 rounded-xl flex items-center justify-center">
                        <Wallet class="w-5 h-5 text-pink-200" />
                      </div>
                      <div>
                        <p class="font-medium text-white">{bill.description}</p>
                        <p class="text-sm text-gray-400">{bill.date} • {bill.participants} people</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-pink-200">Rp {bill.total.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Friends List */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users class="w-5 h-5 text-pink-200" />
              Friends Status
            </h2>
            <div class="space-y-4">
              <For each={friends()}>
                {(friend) => (
                  <div class="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
                        <span class="text-gray-800 font-bold text-sm">{friend.avatar}</span>
                      </div>
                      <div>
                        <p class="font-medium text-white">{friend.name}</p>
                        <p class="text-sm text-gray-400">Rp {friend.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <span class={`px-3 py-1 rounded-full text-xs font-medium ${
                      friend.status === "Paid" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {friend.status}
                    </span>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}