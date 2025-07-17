import { createSignal, createEffect, For, onMount } from "solid-js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { CalendarDays, Users, Plus, Sparkles, TrendingUp, Wallet, Clock, Bell, Search, Menu, UserPlus, X, ChevronLeft, ChevronRight, LogOut, CreditCard, Settings, User, Filter, Eye, EyeOff, RefreshCw, Download, Share2, MoreHorizontal, Edit, Trash2, Check, AlertCircle } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Theme
am4core.useTheme(am4themesAnimated);

// Define types for better type safety
type BillStatus = "pending" | "completed";
type BillCategory = "food" | "entertainment" | "shopping";
type FriendStatus = "Waiting" | "Paid";
type FilterType = "all" | BillCategory;
type TimeRange = "7d" | "30d" | "3m" | "1y";
type NotificationType = "payment" | "reminder" | "split" | "friend";

interface SplitBill {
  id: number;
  date: string;
  total: number;
  description: string;
  participants: number;
  status: BillStatus;
  category: BillCategory;
}

interface Friend {
  id: number;
  name: string;
  status: FriendStatus;
  avatar: string;
  amount: number;
  lastActive: string;
}

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(new Date());
  const [isLoading, setIsLoading] = createSignal(false);
  const [showBalances, setShowBalances] = createSignal(true);
  const [activeFilter, setActiveFilter] = createSignal<FilterType>("all");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [showNotifications, setShowNotifications] = createSignal(false);
  const [selectedTimeRange, setSelectedTimeRange] = createSignal<TimeRange>("7d");
  const [animateStats, setAnimateStats] = createSignal(false);
  const [hoveredCard, setHoveredCard] = createSignal<string | null>(null);

  const [splitBills, setSplitBills] = createSignal<SplitBill[]>([
    { id: 1, date: "2025-07-17", total: 45000, description: "Dinner at Cafe", participants: 4, status: "pending", category: "food" },
    { id: 2, date: "2025-07-16", total: 60000, description: "Movie Night", participants: 3, status: "completed", category: "entertainment" },
    { id: 3, date: "2025-07-15", total: 30000, description: "Lunch", participants: 2, status: "completed", category: "food" },
    { id: 4, date: "2025-07-14", total: 80000, description: "Shopping", participants: 5, status: "pending", category: "shopping" },
    { id: 5, date: "2025-07-13", total: 25000, description: "Coffee Break", participants: 3, status: "completed", category: "food" },
    { id: 6, date: "2025-07-12", total: 120000, description: "Team Dinner", participants: 8, status: "pending", category: "food" },
  ]);

  const [friends, setFriends] = createSignal<Friend[]>([
    { id: 1, name: "Dina", status: "Waiting", avatar: "D", amount: 15000, lastActive: "2 hours ago" },
    { id: 2, name: "Ali", status: "Paid", avatar: "A", amount: 22500, lastActive: "1 day ago" },
    { id: 3, name: "Sarah", status: "Waiting", avatar: "S", amount: 18000, lastActive: "3 hours ago" },
    { id: 4, name: "Kevin", status: "Paid", avatar: "K", amount: 12000, lastActive: "5 hours ago" },
    { id: 5, name: "Maya", status: "Waiting", avatar: "M", amount: 35000, lastActive: "30 minutes ago" },
  ]);

  const [notifications, setNotifications] = createSignal<Notification[]>([
    { id: 1, type: "payment", message: "Ali paid Rp 22,500", time: "2 hours ago", read: false },
    { id: 2, type: "reminder", message: "Reminder: Dinner bill due today", time: "4 hours ago", read: false },
    { id: 3, type: "split", message: "New bill: Team Dinner added", time: "1 day ago", read: true },
    { id: 4, type: "friend", message: "Maya joined your group", time: "2 days ago", read: true },
  ]);

  // Chart reference
  let chartRef: am4charts.XYChart | undefined;

  // Animated counters
  const [displayTotalExpenses, setDisplayTotalExpenses] = createSignal(0);
  const [displayFriendsCount, setDisplayFriendsCount] = createSignal(0);
  const [displayTodayBills, setDisplayTodayBills] = createSignal(0);

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
    
    // Initialize chart
    initChart();
    
    // Animate stats on load
    setTimeout(() => {
      animateCounters();
    }, 500);
    
    return () => {
      if (chartRef) chartRef.dispose();
      window.removeEventListener('resize', checkMobile);
    };
  });

  // Initialize chart
  const initChart = () => {
    if (chartRef) chartRef.dispose();
    
    chartRef = am4core.create("chartdiv", am4charts.XYChart) as am4charts.XYChart;
    chartRef.paddingRight = 20;
    chartRef.paddingLeft = 20;
    chartRef.paddingTop = 20;
    chartRef.paddingBottom = 20;

    // Dark theme for chart
    chartRef.background.fill = am4core.color("#1f2937");
    chartRef.plotContainer.background.fill = am4core.color("#1f2937");

    updateChartData();

    const dateAxis = chartRef.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.stroke = am4core.color("#374151");
    dateAxis.renderer.labels.template.fill = am4core.color("#d1d5db");
    
    const valueAxis = chartRef.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.stroke = am4core.color("#374151");
    valueAxis.renderer.labels.template.fill = am4core.color("#d1d5db");

    const series = chartRef.series.push(new am4charts.LineSeries());
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

    // Add interactivity
    bullet.circle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    bullet.circle.events.on("hit", (ev) => {
      const dataItem = ev.target.dataItem;
      if (dataItem && dataItem.dates) {
        setSelectedDate(dataItem.dates as unknown as Date);
      }
    });
  };

  // Update chart data based on time range
  const updateChartData = () => {
    if (!chartRef) return;
    
    const filteredBills = getFilteredBills();
    chartRef.data = filteredBills.map((bill) => ({
      date: new Date(bill.date),
      value: bill.total,
      description: bill.description
    }));
  };

  // Animate counters
  const animateCounters = () => {
    setAnimateStats(true);
    
    const totalExpenses = totalExpensesValue();
    const friendsCount = friends().length;
    const todayBills = todayBillsValue();
    
    // Animate total expenses
    let currentExpenses = 0;
    const expenseInterval = setInterval(() => {
      currentExpenses += totalExpenses / 30;
      if (currentExpenses >= totalExpenses) {
        currentExpenses = totalExpenses;
        clearInterval(expenseInterval);
      }
      setDisplayTotalExpenses(Math.floor(currentExpenses));
    }, 50);
    
    // Animate friends count
    let currentFriends = 0;
    const friendsInterval = setInterval(() => {
      currentFriends += friendsCount / 20;
      if (currentFriends >= friendsCount) {
        currentFriends = friendsCount;
        clearInterval(friendsInterval);
      }
      setDisplayFriendsCount(Math.floor(currentFriends));
    }, 75);
    
    // Animate today's bills
    let currentTodayBills = 0;
    const todayInterval = setInterval(() => {
      currentTodayBills += todayBills / 15;
      if (currentTodayBills >= todayBills) {
        currentTodayBills = todayBills;
        clearInterval(todayInterval);
      }
      setDisplayTodayBills(Math.floor(currentTodayBills));
    }, 100);
  };

  // Filter bills based on active filter and search
  const getFilteredBills = () => {
    let filtered = splitBills();
    
    if (activeFilter() !== "all") {
      filtered = filtered.filter(bill => bill.category === activeFilter());
    }
    
    if (searchQuery()) {
      filtered = filtered.filter(bill => 
        bill.description.toLowerCase().includes(searchQuery().toLowerCase())
      );
    }
    
    return filtered;
  };

  // Computed values
  const totalExpensesValue = () => splitBills().reduce((sum, bill) => sum + bill.total, 0);
  const pendingPayments = () => friends().filter(f => f.status === "Waiting").length;
  const todayBillsValue = () => splitBills().filter(b => b.date === selectedDate().toISOString().split("T")[0]).length;
  const unreadNotifications = () => notifications().filter(n => !n.read).length;

  // Handle actions
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen());
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    animateCounters();
    updateChartData();
    setIsLoading(false);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    updateChartData();
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    updateChartData();
  };

  const handleBillAction = (billId: number, action: string) => {
    setSplitBills(bills => 
      bills.map(bill => 
        bill.id === billId 
          ? { ...bill, status: action === "complete" ? "completed" as BillStatus : "pending" as BillStatus }
          : bill
      )
    );
  };

  const handleFriendStatusChange = (friendId: number, newStatus: FriendStatus) => {
    setFriends(friendsList => 
      friendsList.map(friend => 
        friend.id === friendId 
          ? { ...friend, status: newStatus }
          : friend
      )
    );
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(notifs => 
      notifs.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Loading overlay */}
      {isLoading() && (
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div class="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <div class="flex items-center gap-4">
              <RefreshCw class="w-6 h-6 text-pink-200 animate-spin" />
              <span class="text-white font-medium">Refreshing data...</span>
            </div>
          </div>
        </div>
      )}

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
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Dashboard
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>

          {/* Other navigation items */}
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
          </div>

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
          </div>

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
          </div>

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
            {/* Search */}
            <div class="relative">
              <input
                type="text"
                placeholder="Search bills..."
                value={searchQuery()}
                onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
                class="pl-10 pr-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200/50 transition-all duration-300"
              />
              <Search class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Refresh */}
            <button 
              onClick={handleRefresh}
              class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300"
            >
              <RefreshCw class={`w-5 h-5 ${isLoading() ? 'animate-spin' : ''}`} />
            </button>

            {/* Notifications */}
            <div class="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications())}
                class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300 relative"
              >
                <Bell class="w-5 h-5" />
                {unreadNotifications() > 0 && (
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadNotifications()}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications() && (
                <div class="absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl z-50">
                  <div class="p-4 border-b border-gray-700/50">
                    <h3 class="font-semibold text-white">Notifications</h3>
                  </div>
                  <div class="max-h-64 overflow-y-auto">
                    <For each={notifications()}>
                      {(notification) => (
                        <div 
                          class={`p-4 border-b border-gray-700/30 hover:bg-gray-800/30 transition-all duration-200 cursor-pointer ${
                            !notification.read ? 'bg-pink-200/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div class="flex items-start gap-3">
                            <div class={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-pink-200' : 'bg-gray-600'
                            }`} />
                            <div>
                              <p class="text-sm text-white">{notification.message}</p>
                              <p class="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </div>

            {/* Add Bill */}
            <button 
              class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
              onClick={() => navigate("/addsplitbill")}
            >
              + Add Bill
            </button>
          </div>
        </header>

        {/* Filter Controls */}
        <div class="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div class="flex items-center gap-2">
            <Filter class="w-5 h-5 text-gray-400" />
            <div class="flex gap-2">
              {(["all", "food", "entertainment", "shopping"] as const).map((filter) => (
                <button
                  onClick={() => handleFilterChange(filter)}
                  class={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter() === filter
                      ? 'bg-pink-200 text-gray-900'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Filter */}
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-gray-400" />
            <div class="flex gap-2">
              {([
                { label: "7D", value: "7d" },
                { label: "30D", value: "30d" },
                { label: "3M", value: "3m" },
                { label: "1Y", value: "1y" }
              ] as const).map((range) => (
                <button
                  onClick={() => handleTimeRangeChange(range.value)}
                  class={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTimeRange() === range.value
                      ? 'bg-pink-200 text-gray-900'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Balance Toggle */}
          <div class="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowBalances(!showBalances())}
              class="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300"
            >
              {showBalances() ? <Eye class="w-4 h-4" /> : <EyeOff class="w-4 h-4" />}
              <span class="text-sm font-medium">
                {showBalances() ? 'Hide' : 'Show'} Balances
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div 
            class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group cursor-pointer ${
              animateStats() ? 'animate-pulse' : ''
            }`}
            onMouseEnter={() => setHoveredCard('expenses')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl group-hover:bg-pink-200/20 transition-all duration-300">
                <Wallet class="w-6 h-6 text-pink-200" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-400 text-sm font-medium">+12.5%</span>
                {hoveredCard() === 'expenses' && (
                  <button class="p-1 hover:bg-gray-700/50 rounded transition-all">
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">
              {showBalances() ? `Rp ${displayTotalExpenses().toLocaleString()}` : 'Rp ***,***'}
            </h3>
            <p class="text-gray-400 text-sm">Total Expenses</p>
            <div class="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-pink-200 to-pink-300 rounded-full transition-all duration-1000"
                style={`width: ${Math.min((displayTotalExpenses() / 500000) * 100, 100)}%`}
              />
            </div>
          </div>

          <div 
            class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group cursor-pointer ${
              animateStats() ? 'animate-pulse' : ''
            }`}
            onMouseEnter={() => setHoveredCard('friends')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl group-hover:bg-pink-200/20 transition-all duration-300">
                <Users class="w-6 h-6 text-pink-200" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-yellow-400 text-sm font-medium">{pendingPayments()} pending</span>
                {hoveredCard() === 'friends' && (
                  <button 
                    onClick={() => navigate("/addfriend")}
                    class="p-1 hover:bg-gray-700/50 rounded transition-all"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{displayFriendsCount()}</h3>
            <p class="text-gray-400 text-sm">Active Friends</p>
            <div class="flex -space-x-2 mt-3">
              <For each={friends().slice(0, 4)}>
                {(friend) => (
                  <div class="w-8 h-8 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center border-2 border-gray-900 text-xs font-bold text-gray-800">
                    {friend.avatar}
                  </div>
                )}
              </For>
              {friends().length > 4 && (
                <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-900 text-xs font-medium text-gray-300">
                  +{friends().length - 4}
                </div>
              )}
            </div>
          </div>

          <div 
            class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group cursor-pointer md:col-span-2 lg:col-span-1 ${
              animateStats() ? 'animate-pulse' : ''
            }`}
            onMouseEnter={() => setHoveredCard('today')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl group-hover:bg-pink-200/20 transition-all duration-300">
                <TrendingUp class="w-6 h-6 text-pink-200" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-blue-400 text-sm font-medium">Today</span>
                {hoveredCard() === 'today' && (
                  <button class="p-1 hover:bg-gray-700/50 rounded transition-all">
                    <CalendarDays class="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{displayTodayBills()}</h3>
            <p class="text-gray-400 text-sm">Today's Bills</p>
            <div class="mt-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  class={`h-2 flex-1 rounded-full transition-all duration-500 delay-${i * 100} ${
                    i < displayTodayBills() ? 'bg-pink-200' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-xl font-bold text-white">Expense Trend</h2>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-400">
                <div class="w-3 h-3 bg-pink-200 rounded-full"></div>
                <span>Split Bills</span>
              </div>
              <div class="flex gap-2">
                <button class="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                  <Download class="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
                <button class="p-2 hover:bg-gray-700/50 rounded-lg transition-all">
                  <Share2 class="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          </div>
          <div id="chartdiv" class="w-full h-80 rounded-xl overflow-hidden" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <CalendarDays class="w-5 h-5 text-pink-200" />
                Recent Activities
              </h2>
              <button class="text-sm text-pink-200 hover:text-pink-100 transition-all">
                View All
              </button>
            </div>
            <div class="space-y-4">
              <For each={getFilteredBills().slice(0, 4)}>
                {(bill) => (
                  <div 
                    class="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 group"
                    onMouseEnter={() => setHoveredCard(`bill-${bill.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div class="flex items-center gap-3">
                      <div class={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        bill.category === 'food' ? 'bg-orange-500/20' :
                        bill.category === 'entertainment' ? 'bg-purple-500/20' :
                        bill.category === 'shopping' ? 'bg-blue-500/20' :
                        'bg-pink-200/10'
                      }`}>
                        <Wallet class="w-5 h-5 text-pink-200" />
                      </div>
                      <div>
                        <p class="font-medium text-white">{bill.description}</p>
                        <p class="text-sm text-gray-400">
                          {bill.date} • {bill.participants} people
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="text-right">
                        <p class="font-bold text-pink-200">
                          {showBalances() ? `Rp ${bill.total.toLocaleString()}` : 'Rp ***'}
                        </p>
                        <span class={`text-xs px-2 py-1 rounded-full ${
                          bill.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                      {hoveredCard() === `bill-${bill.id}` && (
                        <div class="flex gap-1">
                          <button 
                            onClick={() => handleBillAction(bill.id, 'edit')}
                            class="p-1 hover:bg-gray-700/50 rounded transition-all"
                          >
                            <Edit class="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button 
                            onClick={() => handleBillAction(bill.id, 'complete')}
                            class="p-1 hover:bg-gray-700/50 rounded transition-all"
                          >
                            <Check class="w-4 h-4 text-gray-400 hover:text-green-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Friends List */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Users class="w-5 h-5 text-pink-200" />
                Friends Status
              </h2>
              <button 
                onClick={() => navigate("/friends")}
                class="text-sm text-pink-200 hover:text-pink-100 transition-all"
              >
                Manage
              </button>
            </div>
            <div class="space-y-4">
              <For each={friends()}>
                {(friend) => (
                  <div 
                    class="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 group"
                    onMouseEnter={() => setHoveredCard(`friend-${friend.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center">
                          <span class="text-gray-800 font-bold text-sm">{friend.avatar}</span>
                        </div>
                        {friend.status === "Paid" && (
                          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check class="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {friend.status === "Waiting" && (
                          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Clock class="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p class="font-medium text-white">{friend.name}</p>
                        <p class="text-sm text-gray-400">
                          {showBalances() ? `Rp ${friend.amount.toLocaleString()}` : 'Rp ***'} • {friend.lastActive}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        onClick={() => handleFriendStatusChange(friend.id, friend.status === "Paid" ? "Waiting" : "Paid")}
                        class={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                          friend.status === "Paid" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                        }`}
                      >
                        {friend.status}
                      </button>
                      {hoveredCard() === `friend-${friend.id}` && friend.status === "Waiting" && (
                        <button 
                          onClick={() => handleFriendStatusChange(friend.id, "Paid")}
                          class="p-1 hover:bg-gray-700/50 rounded transition-all"
                        >
                          <AlertCircle class="w-4 h-4 text-yellow-400 hover:text-green-400" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h2 class="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/addsplitbill")}
              class="flex flex-col items-center gap-3 p-6 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-pink-200/10 hover:border-pink-200/30 transition-all duration-300 group"
            >
              <div class="p-3 bg-pink-200/10 rounded-xl group-hover:bg-pink-200/20 transition-all">
                <Plus class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white">Add Bill</span>
            </button>

            <button 
              onClick={() => navigate("/paybill")}
              class="flex flex-col items-center gap-3 p-6 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-green-200/10 hover:border-green-200/30 transition-all duration-300 group"
            >
              <div class="p-3 bg-green-200/10 rounded-xl group-hover:bg-green-200/20 transition-all">
                <CreditCard class="w-6 h-6 text-green-200" />
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white">Pay Bill</span>
            </button>

            <button 
              onClick={() => navigate("/addfriend")}
              class="flex flex-col items-center gap-3 p-6 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-blue-200/10 hover:border-blue-200/30 transition-all duration-300 group"
            >
              <div class="p-3 bg-blue-200/10 rounded-xl group-hover:bg-blue-200/20 transition-all">
                <UserPlus class="w-6 h-6 text-blue-200" />
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white">Add Friend</span>
            </button>

            <button 
              onClick={() => navigate("/finance")}
              class="flex flex-col items-center gap-3 p-6 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-purple-200/10 hover:border-purple-200/30 transition-all duration-300 group"
            >
              <div class="p-3 bg-purple-200/10 rounded-xl group-hover:bg-purple-200/20 transition-all">
                <TrendingUp class="w-6 h-6 text-purple-200" />
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white">View Finance</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}