import { createSignal, createEffect, For, onMount } from "solid-js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { CalendarDays, Users, Plus, Sparkles, TrendingUp, Wallet, Clock, Bell, Search, Menu, UserPlus, X, ChevronLeft, ChevronRight, LogOut, CreditCard, Settings, User, Check, AlertCircle, Info, DollarSign } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Theme
am4core.useTheme(am4themesAnimated);

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(new Date());
  
  // Search functionality with debouncing
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = createSignal("");
  const [searchResults, setSearchResults] = createSignal<Array<{
    type: string;
    title: string;
    subtitle: string;
    date?: string;
    status?: string;
    id: string;
  }>>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  
  // Notification functionality
  const [isNotificationOpen, setIsNotificationOpen] = createSignal(false);
  
  // Define types for better TypeScript support
  interface SplitBill {
    date: string;
    total: number;
    description: string;
    participants: number;
    category?: string;
    splitType?: string;
    createdAt?: string;
  }

  interface Friend {
    name: string;
    status: "Paid" | "Waiting";
    avatar: string;
    amount: number;
  }

  interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
  }

  // Data states - akan diisi dari localStorage saat mount
  const [splitBills, setSplitBills] = createSignal<SplitBill[]>([]);
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);

  // Load data dari localStorage saat component mount
  const loadDataFromStorage = () => {
    try {
      // Load split bills
      const storedBills = localStorage.getItem('splitBills');
      if (storedBills) {
        setSplitBills(JSON.parse(storedBills));
      }

      // Load friends
      const storedFriends = localStorage.getItem('friends');
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      }

      // Load notifications
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  // Search data combining bills and friends
  const searchData = (): Array<{
    type: string;
    title: string;
    subtitle: string;
    date?: string;
    status?: string;
    id: string;
  }> => [
    ...splitBills().map((bill, index) => ({
      type: 'bill',
      title: bill.description,
      subtitle: `Rp ${bill.total.toLocaleString()} • ${bill.participants} people`,
      date: bill.date,
      id: `bill-${bill.date}-${index}`
    })),
    ...friends().map((friend, index) => ({
      type: 'friend',
      title: friend.name,
      subtitle: `${friend.status} • Rp ${friend.amount.toLocaleString()}`,
      status: friend.status,
      id: `friend-${friend.name}-${index}`
    }))
  ];

  // Debounced search functionality
  let searchTimeout: number | null = null;
  
  createEffect(() => {
    const query = searchQuery();
    setIsSearching(true);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    searchTimeout = setTimeout(() => {
      setDebouncedSearchQuery(query);
      setIsSearching(false);
    }, 300); // 300ms delay
  });

  // Search functionality with real-time filtering
  createEffect(() => {
    const query = debouncedSearchQuery();
    if (query.length > 0) {
      const filtered = searchData().filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        (item.type === 'bill' && item.date?.includes(query)) ||
        (item.type === 'friend' && item.status?.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  });

  // Notification functions
  const unreadCount = () => notifications().filter((n: Notification) => !n.read).length;
  
  const markNotificationAsRead = (id: number) => {
    setNotifications((prev: Notification[]) => {
      const updated = prev.map((notification: Notification) => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      );
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev: Notification[]) => {
      const updated = prev.map((notification: Notification) => ({ ...notification, read: true }));
      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const getNotificationIcon = (iconType: string) => {
    switch(iconType) {
      case 'check': return Check;
      case 'alert': return AlertCircle;
      case 'user': return UserPlus;
      case 'bill': return DollarSign;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'payment': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'reminder': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'info': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'bill': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  // Close dropdowns when clicking outside
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element;
    if (!target.closest('.search-dropdown') && !target.closest('.search-button')) {
      setIsSearchOpen(false);
    }
    if (!target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
      setIsNotificationOpen(false);
    }
  };

  let chart: am4charts.XYChart;

  onMount(() => {
    // Load data dari localStorage saat component mount
    loadDataFromStorage();
    
    document.addEventListener('click', handleClickOutside);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Initialize chart
    chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.paddingLeft = 20;
    chart.paddingTop = 20;
    chart.paddingBottom = 20;

    // Dark theme for chart
    chart.background.fill = am4core.color("#1f2937");
    chart.plotContainer.background.fill = am4core.color("#1f2937");

    // Empty data initially
    chart.data = [];

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

    // Reload data setiap kali halaman difokuskan (untuk mendeteksi perubahan dari halaman lain)
    const handleFocus = () => {
      loadDataFromStorage();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      if (chart) chart.dispose();
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('click', handleClickOutside);
    };
  });

  // Update chart when splitBills changes
  createEffect(() => {
    if (chart && splitBills().length > 0) {
      const chartData = splitBills()
        .map((bill: SplitBill) => ({
          date: new Date(bill.date),
          value: bill.total,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date
      
      chart.data = chartData;
    } else if (chart) {
      chart.data = [];
    }
  });

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen());
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  const totalExpenses = () => splitBills().reduce((sum: number, bill: SplitBill) => sum + bill.total, 0);
  const pendingPayments = () => friends().filter((f: Friend) => f.status === "Waiting").length;
  const todayBills = () => splitBills().filter((b: SplitBill) => b.date === selectedDate().toISOString().split("T")[0]);

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse" />
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
            {/* Tooltip untuk collapsed state */}
            {!isSidebarOpen() && !isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Log Out
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
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
              <h1 class="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p class="text-gray-400 mt-1">Welcome back! Here's your expense overview</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            {/* Search Button with Dropdown */}
            <div class="relative">
              <button 
                class="search-button p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300"
                onClick={() => setIsSearchOpen(!isSearchOpen())}
              >
                <Search class="w-5 h-5" />
              </button>
              
              {/* Search Dropdown */}
              {isSearchOpen() && (
                <div class="search-dropdown absolute right-0 top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
                  <div class="p-4 border-b border-gray-700/50">
                    <div class="relative">
                      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bills, friends, amounts..."
                        value={searchQuery()}
                        onInput={(e: Event) => {
                          const target = e.target as HTMLInputElement;
                          setSearchQuery(target.value);
                        }}
                        class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300"
                        autofocus
                      />
                      {isSearching() && searchQuery().length > 0 && (
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div class="w-4 h-4 border-2 border-pink-200 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div class="max-h-64 overflow-y-auto">
                    {searchQuery().length === 0 ? (
                      <div class="p-4 text-center text-gray-400">
                        <Search class="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Start typing to search...</p>
                      </div>
                    ) : searchResults().length === 0 ? (
                      <div class="p-4 text-center text-gray-400">
                        <p>No results found for "{searchQuery()}"</p>
                      </div>
                    ) : (
                      <div class="p-2">
                        <For each={searchResults()}>
                          {(result) => (
                            <div class="p-3 hover:bg-gray-800/50 rounded-xl cursor-pointer transition-all duration-200">
                              <div class="flex items-center gap-3">
                                <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  result.type === 'bill' 
                                    ? 'bg-pink-200/10 text-pink-200' 
                                    : 'bg-blue-200/10 text-blue-200'
                                }`}>
                                  {result.type === 'bill' ? (
                                    <DollarSign class="w-4 h-4" />
                                  ) : (
                                    <User class="w-4 h-4" />
                                  )}
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-white font-medium truncate">{result.title}</p>
                                  <p class="text-gray-400 text-sm truncate">{result.subtitle}</p>
                                </div>
                                {result.type === 'friend' && (
                                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                                    result.status === "Paid" 
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}>
                                    {result.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </For>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Button with Dropdown */}
            <div class="relative">
              <button 
                class="notification-button relative p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300"
                onClick={() => setIsNotificationOpen(!isNotificationOpen())}
              >
                <Bell class="w-5 h-5" />
                {unreadCount() > 0 && (
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount()}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen() && (
                <div class="notification-dropdown absolute right-0 top-full mt-2 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
                  <div class="p-4 border-b border-gray-700/50 flex items-center justify-between">
                    <h3 class="text-lg font-bold text-white">Notifications</h3>
                    {unreadCount() > 0 && (
                      <button
                        onClick={markAllAsRead}
                        class="text-sm text-pink-200 hover:text-pink-100 transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div class="max-h-80 overflow-y-auto">
                    {notifications().length === 0 ? (
                      <div class="p-6 text-center text-gray-400">
                        <Bell class="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div class="p-2">
                        <For each={notifications()}>
                          {(notification: Notification) => {
                            const IconComponent = getNotificationIcon(notification.icon);
                            return (
                              <div 
                                class={`p-4 hover:bg-gray-800/50 rounded-xl cursor-pointer transition-all duration-200 border-l-4 ${
                                  !notification.read 
                                    ? 'border-pink-200 bg-gray-800/20' 
                                    : 'border-transparent'
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <div class="flex items-start gap-3">
                                  <div class={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                                    <IconComponent class="w-4 h-4" />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                      <p class="text-white font-medium">{notification.title}</p>
                                      {!notification.read && (
                                        <div class="w-2 h-2 bg-pink-200 rounded-full flex-shrink-0" />
                                      )}
                                    </div>
                                    <p class="text-gray-400 text-sm leading-relaxed">{notification.message}</p>
                                    <p class="text-gray-500 text-xs mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    )}
                  </div>
                  
                  {notifications().length > 0 && (
                    <div class="p-4 border-t border-gray-700/50">
                      <button class="w-full text-center text-pink-200 hover:text-pink-100 text-sm font-medium transition-colors duration-200">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
              <span class="text-gray-500 text-sm font-medium">
                {splitBills().length > 0 ? `${splitBills().length} bills` : '--'}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalExpenses().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Total Expenses</p>
          </div>

          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl">
                <Clock class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-gray-500 text-sm font-medium">{pendingPayments()} pending</span>
            </div>
            <h3 class="text-2xl font-bold text-white">{friends().length}</h3>
            <p class="text-gray-400 text-sm">Active Friends</p>
          </div>

          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group md:col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-pink-200/10 rounded-xl">
                <TrendingUp class="w-6 h-6 text-pink-200" />
              </div>
              <span class="text-gray-500 text-sm font-medium">Today</span>
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
              <div class="w-3 h-3 bg-pink-200 rounded-full" />
              <span>Split Bills</span>
            </div>
          </div>
          {splitBills().length > 0 ? (
            <div id="chartdiv" class="w-full h-80 rounded-xl overflow-hidden" />
          ) : (
            <div class="w-full h-80 rounded-xl bg-gray-800/30 border-2 border-dashed border-gray-600/50 flex items-center justify-center">
              <div class="text-center">
                <TrendingUp class="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p class="text-gray-400 text-lg mb-2">No expense data yet</p>
                <p class="text-gray-500 text-sm">Add your first split bill to see the expense trend</p>
              </div>
            </div>
          )}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities with Enhanced Scrolling */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/40">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <CalendarDays class="w-5 h-5 text-pink-200" />
                Recent Activities
              </h2>
              <span class="text-sm text-gray-400">
                {splitBills().length} bills
              </span>
            </div>
            
            {splitBills().length > 0 ? (
              <div class="flex-1 relative">
                {/* Custom scrollable area with seamless design */}
                <div class="h-96 overflow-hidden relative">
                  <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-6 py-4">
                    <div class="space-y-3">
                      <For each={splitBills()}>
                        {(bill: SplitBill) => (
                          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/20 to-gray-800/40 rounded-xl border border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-pink-200/20 transition-all duration-300 group backdrop-blur-sm">
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 bg-gradient-to-br from-pink-200/10 to-pink-200/20 rounded-xl flex items-center justify-center group-hover:from-pink-200/20 group-hover:to-pink-200/30 transition-all duration-300">
                                <Wallet class="w-5 h-5 text-pink-200" />
                              </div>
                              <div>
                                <p class="font-medium text-white group-hover:text-pink-100 transition-colors duration-300">{bill.description}</p>
                                <p class="text-sm text-gray-400">{bill.date} • {bill.participants} people</p>
                              </div>
                            </div>
                            <div class="text-right">
                              <p class="font-bold text-pink-200">Rp {bill.total.toLocaleString()}</p>
                              <p class="text-xs text-gray-500">Per person: Rp {Math.round(bill.total / bill.participants).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                  
                  {/* Gradient fade at bottom for scroll indication */}
                  <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div class="flex-1 flex items-center justify-center p-6">
                <div class="text-center py-12">
                  <CalendarDays class="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p class="text-gray-400 text-lg mb-2">No recent activities</p>
                  <p class="text-gray-500 text-sm">Start by adding your first split bill</p>
                </div>
              </div>
            )}
          </div>

          {/* Friends List with Enhanced Scrolling */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/40">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <Users class="w-5 h-5 text-pink-200" />
                Friends Status
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-400">
                  {friends().length} friends
                </span>
                {pendingPayments() > 0 && (
                  <span class="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                    {pendingPayments()} pending
                  </span>
                )}
              </div>
            </div>
            
            {friends().length > 0 ? (
              <div class="flex-1 relative">
                {/* Custom scrollable area with seamless design */}
                <div class="h-96 overflow-hidden relative">
                  <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-6 py-4">
                    <div class="space-y-3">
                      <For each={friends()}>
                        {(friend: Friend) => (
                          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/20 to-gray-800/40 rounded-xl border border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-pink-200/20 transition-all duration-300 group backdrop-blur-sm">
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-gray-800 font-bold text-sm">{friend.avatar}</span>
                              </div>
                              <div>
                                <p class="font-medium text-white group-hover:text-pink-100 transition-colors duration-300">{friend.name}</p>
                                <p class="text-sm text-gray-400">Rp {friend.amount.toLocaleString()}</p>
                              </div>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                                friend.status === "Paid" 
                                  ? "bg-green-500/20 text-green-400 border-green-500/30 group-hover:bg-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 group-hover:bg-yellow-500/30"
                              }`}>
                                {friend.status}
                              </span>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                  
                  {/* Gradient fade at bottom for scroll indication */}
                  <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div class="flex-1 flex items-center justify-center p-6">
                <div class="text-center py-12">
                  <Users class="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p class="text-gray-400 text-lg mb-2">No friends added yet</p>
                  <p class="text-gray-500 text-sm">Add friends to start splitting bills together</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}