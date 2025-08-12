import { createSignal, createEffect, For, onMount, onCleanup } from "solid-js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themesAnimated from "@amcharts/amcharts4/themes/animated";
import { CalendarDays, Users, TrendingUp, Wallet, Clock, CheckCircle, Trash2 } from "lucide-solid";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

// Theme
am4core.useTheme(am4themesAnimated);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(new Date());
  
  // Define types for better TypeScript support
  interface SplitBill {
    date: string;
    total: number;
    description: string;
    participants: number;
    category?: string;
    splitType?: string;
    createdAt?: string;
    status?: 'active' | 'paid' | 'partial';
    paidDate?: string;
    paidAmount?: number;
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

  // Data states
  const [splitBills, setSplitBills] = createSignal<SplitBill[]>([]);
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);

  // Chart reference
  let chart: am4charts.XYChart | null = null;

  // Load data dari localStorage saat component mount
  const loadDataFromStorage = () => {
    try {
      // Load split bills
      const storedBills = localStorage.getItem('splitBills');
      if (storedBills) {
        const bills = JSON.parse(storedBills);
        const billsWithStatus = bills.map((bill: SplitBill) => ({
          ...bill,
          status: bill.status || 'active'
        }));
        setSplitBills(billsWithStatus);
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

  // Function to update chart data
  const updateChartData = () => {
    if (!chart) return;

    const bills = splitBills();
    if (bills.length > 0) {
      // Group bills by date and sum the totals
      const groupedByDate = bills.reduce((acc: Record<string, number>, bill: SplitBill) => {
        const date = bill.date;
        acc[date] = (acc[date] || 0) + bill.total;
        return acc;
      }, {});

      // Convert to chart data format and sort by date
      const chartData = Object.entries(groupedByDate)
        .map(([date, total]) => ({
          date: new Date(date),
          value: total,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      chart.data = chartData;
    } else {
      chart.data = [];
    }
  };

  // Delete bill function
  const deleteBill = (billIndex: number) => {
    const bill = splitBills()[billIndex];
    const confirmMessage = `Are you sure you want to delete "${bill.description}"?\nAmount: Rp ${bill.total.toLocaleString()}\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      const updatedBills = splitBills().filter((_, index) => index !== billIndex);
      setSplitBills(updatedBills);
      
      try {
        localStorage.setItem('splitBills', JSON.stringify(updatedBills));
        
        const newNotification: Notification = {
          id: Date.now(),
          type: 'info',
          title: 'Bill Deleted',
          message: `"${bill.description}" has been deleted successfully`,
          time: new Date().toLocaleTimeString(),
          read: false,
          icon: 'info'
        };
        
        const currentNotifications = notifications();
        const updatedNotifications = [newNotification, ...currentNotifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Error saving updated bills to localStorage:', error);
        alert('Error deleting bill. Please try again.');
      }
    }
  };

  // Mark bill as paid function
  const markBillAsPaid = (billIndex: number) => {
    const bill = splitBills()[billIndex];
    const confirmMessage = `Mark "${bill.description}" as paid?\nAmount: Rp ${bill.total.toLocaleString()}`;
    
    if (confirm(confirmMessage)) {
      const updatedBills = splitBills().map((b, index) => 
        index === billIndex 
          ? { 
              ...b, 
              status: 'paid' as const, 
              paidDate: new Date().toISOString().split('T')[0],
              paidAmount: b.total
            }
          : b
      );
      setSplitBills(updatedBills);
      
      try {
        localStorage.setItem('splitBills', JSON.stringify(updatedBills));
        
        const newNotification: Notification = {
          id: Date.now(),
          type: 'payment',
          title: 'Bill Marked as Paid',
          message: `"${bill.description}" has been marked as paid - Rp ${bill.total.toLocaleString()}`,
          time: new Date().toLocaleTimeString(),
          read: false,
          icon: 'check'
        };
        
        const currentNotifications = notifications();
        const updatedNotifications = [newNotification, ...currentNotifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Error saving updated bills to localStorage:', error);
        alert('Error updating bill status. Please try again.');
      }
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
      status: bill.status,
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

  // Initialize chart
  const initializeChart = () => {
    try {
      if (chart) {
        chart.dispose();
      }

      chart = am4core.create("chartdiv", am4charts.XYChart);
      
      if (!chart) {
        console.error('Failed to create chart');
        return;
      }

      chart.paddingRight = 20;
      chart.paddingLeft = 20;
      chart.paddingTop = 20;
      chart.paddingBottom = 20;

      // Dark theme for chart
      chart.background.fill = am4core.color("#1f2937");
      chart.plotContainer.background.fill = am4core.color("#1f2937");

      // Create date axis
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.stroke = am4core.color("#374151");
      dateAxis.renderer.labels.template.fill = am4core.color("#d1d5db");
      dateAxis.renderer.minGridDistance = 50;

      // Create value axis
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.stroke = am4core.color("#374151");
      valueAxis.renderer.labels.template.fill = am4core.color("#d1d5db");

      // Create series
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
      series.strokeWidth = 3;
      series.stroke = am4core.color("#f9a8d4");
      series.fillOpacity = 0.1;
      series.fill = am4core.color("#f9a8d4");

      // Add bullets
      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 6;
      bullet.circle.fill = am4core.color("#f9a8d4");
      bullet.circle.stroke = am4core.color("#ffffff");
      bullet.circle.strokeWidth = 2;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineY.disabled = true;
      
      updateChartData();
      
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  };

  onMount(() => {
    loadDataFromStorage();
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setTimeout(() => {
      initializeChart();
    }, 100);
    
    const handleFocus = () => {
      loadDataFromStorage();
    };
    
    window.addEventListener('focus', handleFocus);

    onCleanup(() => {
      if (chart) {
        chart.dispose();
        chart = null;
      }
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('focus', handleFocus);
    });
  });

  // Update chart when splitBills changes
  createEffect(() => {
    updateChartData();
  });

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
  };

  // Updated stats calculations to include paid bills
  const totalExpenses = () => splitBills().reduce((sum: number, bill: SplitBill) => sum + bill.total, 0);
  const activeBills = () => splitBills().filter((b: SplitBill) => b.status !== 'paid').length;
  const paidBills = () => splitBills().filter((b: SplitBill) => b.status === 'paid').length;
  const pendingPayments = () => friends().filter((f: Friend) => f.status === "Waiting").length;

  // Helper function to get bill status color and icon
  const getBillStatusInfo = (bill: SplitBill) => {
    switch (bill.status) {
      case 'paid':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          borderColor: 'border-green-400/20',
          icon: CheckCircle,
          label: 'Paid'
        };
      case 'partial':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10',
          borderColor: 'border-yellow-400/20',
          icon: Clock,
          label: 'Partial'
        };
      default:
        return {
          color: 'text-pink-200',
          bgColor: 'bg-pink-200/10',
          borderColor: 'border-pink-200/20',
          icon: Wallet,
          label: 'Active'
        };
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse" />
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main content */}
      <main class={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isMobile() ? '' : isSidebarOpen() ? 'ml-0' : 'ml-0'
      }`}>
        {/* Header with improved spacing */}
        <div class={`transition-all duration-300 ${
          isMobile() ? 'px-4' : isSidebarOpen() ? 'pl-8 pr-4' : 'px-6'
        }`}>
          <Header 
            title="Dashboard"
            subtitle="Welcome back! Here's your expense overview"
            searchData={searchData}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>

        {/* Content with improved spacing */}
        <div class={`flex-1 space-y-4 lg:space-y-6 overflow-auto transition-all duration-300 ${
          isMobile() ? 'p-4' : isSidebarOpen() ? 'pl-8 pr-4 pb-8' : 'px-6 pb-8'
        }`}>
          {/* Stats Cards - Responsive Grid */}
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-3 lg:mb-4">
                <div class="p-2 lg:p-3 bg-pink-200/10 rounded-lg lg:rounded-xl">
                  <Wallet class="w-4 h-4 lg:w-6 lg:h-6 text-pink-200" />
                </div>
                <span class="text-gray-500 text-xs lg:text-sm font-medium">
                  {splitBills().length > 0 ? `${splitBills().length} bills` : '--'}
                </span>
              </div>
              <h3 class="text-lg lg:text-2xl font-bold text-white">Rp {totalExpenses().toLocaleString()}</h3>
              <p class="text-gray-400 text-xs lg:text-sm">Total Expenses</p>
            </div>

            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-3 lg:mb-4">
                <div class="p-2 lg:p-3 bg-yellow-500/10 rounded-lg lg:rounded-xl">
                  <Clock class="w-4 h-4 lg:w-6 lg:h-6 text-yellow-400" />
                </div>
                <span class="text-gray-500 text-xs lg:text-sm font-medium">{activeBills()} active</span>
              </div>
              <h3 class="text-lg lg:text-2xl font-bold text-white">{activeBills()}</h3>
              <p class="text-gray-400 text-xs lg:text-sm">Active Bills</p>
            </div>

            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-3 lg:mb-4">
                <div class="p-2 lg:p-3 bg-green-500/10 rounded-lg lg:rounded-xl">
                  <CheckCircle class="w-4 h-4 lg:w-6 lg:h-6 text-green-400" />
                </div>
                <span class="text-gray-500 text-xs lg:text-sm font-medium">{paidBills()} paid</span>
              </div>
              <h3 class="text-lg lg:text-2xl font-bold text-white">{paidBills()}</h3>
              <p class="text-gray-400 text-xs lg:text-sm">Paid Bills</p>
            </div>

            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-3 lg:mb-4">
                <div class="p-2 lg:p-3 bg-pink-200/10 rounded-lg lg:rounded-xl">
                  <Users class="w-4 h-4 lg:w-6 lg:h-6 text-pink-200" />
                </div>
                <span class="text-gray-500 text-xs lg:text-sm font-medium">{pendingPayments()} pending</span>
              </div>
              <h3 class="text-lg lg:text-2xl font-bold text-white">{friends().length}</h3>
              <p class="text-gray-400 text-xs lg:text-sm">Active Friends</p>
            </div>
          </div>

          {/* Chart Section */}
          <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300">
            <div class="flex items-center justify-between mb-4 lg:mb-6">
              <h2 class="text-lg lg:text-xl font-bold text-white">Expense Trend</h2>
              <div class="flex items-center gap-2 text-sm text-gray-400">
                <div class="w-3 h-3 bg-pink-200 rounded-full" />
                <span class="hidden sm:inline">Split Bills</span>
              </div>
            </div>
            {splitBills().length > 0 ? (
              <div id="chartdiv" class="w-full h-64 lg:h-80 rounded-xl overflow-hidden bg-gray-800/30" />
            ) : (
              <div class="w-full h-64 lg:h-80 rounded-xl bg-gray-800/30 border-2 border-dashed border-gray-600/50 flex items-center justify-center">
                <div class="text-center px-4">
                  <TrendingUp class="w-8 lg:w-12 h-8 lg:h-12 text-gray-500 mx-auto mb-2 lg:mb-4" />
                  <p class="text-gray-400 text-sm lg:text-lg mb-1 lg:mb-2">No expense data yet</p>
                  <p class="text-gray-500 text-xs lg:text-sm">Add your first split bill to see the expense trend</p>
                </div>
              </div>
            )}
          </div>

          {/* Activities and Friends Grid - Responsive */}
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            {/* Recent Activities */}
            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700/50 bg-gray-900/40">
                <h2 class="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <CalendarDays class="w-4 h-4 lg:w-5 lg:h-5 text-pink-200" />
                  <span class="hidden sm:inline">Recent Activities</span>
                  <span class="sm:hidden">Activities</span>
                </h2>
                <div class="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-gray-400">
                  <span>{splitBills().length} bills</span>
                  {activeBills() > 0 && (
                    <span class="px-1 lg:px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                      {activeBills()} active
                    </span>
                  )}
                  {paidBills() > 0 && (
                    <span class="px-1 lg:px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                      {paidBills()} paid
                    </span>
                  )}
                </div>
              </div>
              
              {splitBills().length > 0 ? (
                <div class="flex-1 relative">
                  <div class="h-64 lg:h-96 overflow-hidden relative">
                    <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-3 lg:px-6 py-2 lg:py-4">
                      <div class="space-y-2 lg:space-y-3">
                        <For each={splitBills()}>
                          {(bill: SplitBill, index) => {
                            const statusInfo = getBillStatusInfo(bill);
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                              <div class={`flex items-center justify-between p-3 lg:p-4 rounded-lg lg:rounded-xl border transition-all duration-300 group backdrop-blur-sm ${
                                bill.status === 'paid' 
                                  ? 'bg-gradient-to-r from-green-900/10 to-green-800/20 border-green-700/20 hover:from-green-900/20 hover:to-green-800/30 hover:border-green-600/20'
                                  : 'bg-gradient-to-r from-gray-800/20 to-gray-800/40 border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-pink-200/20'
                              }`}>
                                <div class="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                                  <div class={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                    bill.status === 'paid'
                                      ? 'bg-gradient-to-br from-green-400/10 to-green-400/20 group-hover:from-green-400/20 group-hover:to-green-400/30'
                                      : 'bg-gradient-to-br from-pink-200/10 to-pink-200/20 group-hover:from-pink-200/20 group-hover:to-pink-200/30'
                                  }`}>
                                    <StatusIcon class={`w-4 h-4 lg:w-5 lg:h-5 ${statusInfo.color}`} />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                      <p class={`font-medium transition-colors duration-300 truncate text-sm lg:text-base ${
                                        bill.status === 'paid' ? 'text-green-100 group-hover:text-green-50' : 'text-white group-hover:text-pink-100'
                                      }`}>
                                        {bill.description}
                                      </p>
                                      <span class={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                                        {statusInfo.label}
                                      </span>
                                    </div>
                                    <div class="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-gray-400">
                                      <span>{bill.date}</span>
                                      <span>•</span>
                                      <span>{bill.participants} people</span>
                                      {bill.status === 'paid' && bill.paidDate && (
                                        <>
                                          <span class="hidden lg:inline">•</span>
                                          <span class="text-green-400 hidden lg:inline">Paid on {bill.paidDate}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div class="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                                  <div class="text-right">
                                    <p class={`font-bold text-sm lg:text-base ${bill.status === 'paid' ? 'text-green-400' : 'text-pink-200'}`}>
                                      Rp {bill.total.toLocaleString()}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                      Per: Rp {Math.round(bill.total / bill.participants).toLocaleString()}
                                    </p>
                                  </div>
                                  <div class="flex items-center gap-1 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {/* Mark as Paid Button - only show for active bills */}
                                    {bill.status !== 'paid' && (
                                      <button
                                        onClick={(e: Event) => {
                                          e.stopPropagation();
                                          markBillAsPaid(index());
                                        }}
                                        class="p-1.5 lg:p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 border border-green-500/20 hover:border-green-500/40"
                                        title="Mark as paid"
                                      >
                                        <CheckCircle class="w-3 h-3 lg:w-4 lg:h-4" />
                                      </button>
                                    )}
                                    {/* Delete Button */}
                                    <button
                                      onClick={(e: Event) => {
                                        e.stopPropagation();
                                        deleteBill(index());
                                      }}
                                      class="p-1.5 lg:p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                      title="Delete bill"
                                    >
                                      <Trash2 class="w-3 h-3 lg:w-4 lg:h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                    
                    {/* Gradient fade at bottom for scroll indication */}
                    <div class="absolute bottom-0 left-0 right-0 h-6 lg:h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div class="flex-1 flex items-center justify-center p-4 lg:p-6">
                  <div class="text-center py-8 lg:py-12">
                    <CalendarDays class="w-8 lg:w-12 h-8 lg:h-12 text-gray-500 mx-auto mb-2 lg:mb-4" />
                    <p class="text-gray-400 text-sm lg:text-lg mb-1 lg:mb-2">No recent activities</p>
                    <p class="text-gray-500 text-xs lg:text-sm">Start by adding your first split bill</p>
                  </div>
                </div>
              )}
            </div>

            {/* Friends List */}
            <div class="bg-gray-900/60 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700/50 bg-gray-900/40">
                <h2 class="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                  <Users class="w-4 h-4 lg:w-5 lg:h-5 text-pink-200" />
                  <span class="hidden sm:inline">Friends Status</span>
                  <span class="sm:hidden">Friends</span>
                </h2>
                <div class="flex items-center gap-1 lg:gap-2">
                  <span class="text-xs lg:text-sm text-gray-400">
                    {friends().length} friends
                  </span>
                  {pendingPayments() > 0 && (
                    <span class="text-xs px-1 lg:px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                      {pendingPayments()} pending
                    </span>
                  )}
                </div>
              </div>
              
              {friends().length > 0 ? (
                <div class="flex-1 relative">
                  <div class="h-64 lg:h-96 overflow-hidden relative">
                    <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-3 lg:px-6 py-2 lg:py-4">
                      <div class="space-y-2 lg:space-y-3">
                        <For each={friends()}>
                          {(friend: Friend) => (
                            <div class="flex items-center justify-between p-3 lg:p-4 bg-gradient-to-r from-gray-800/20 to-gray-800/40 rounded-lg lg:rounded-xl border border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-pink-200/20 transition-all duration-300 group backdrop-blur-sm">
                              <div class="flex items-center gap-2 lg:gap-3">
                                <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                  <span class="text-gray-800 font-bold text-xs lg:text-sm">{friend.avatar}</span>
                                </div>
                                <div>
                                  <p class="font-medium text-white group-hover:text-pink-100 transition-colors duration-300 text-sm lg:text-base">{friend.name}</p>
                                  <p class="text-xs lg:text-sm text-gray-400">Rp {friend.amount.toLocaleString()}</p>
                                </div>
                              </div>
                              <div class="flex items-center gap-2">
                                <span class={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
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
                    <div class="absolute bottom-0 left-0 right-0 h-6 lg:h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div class="flex-1 flex items-center justify-center p-4 lg:p-6">
                  <div class="text-center py-8 lg:py-12">
                    <Users class="w-8 lg:w-12 h-8 lg:h-12 text-gray-500 mx-auto mb-2 lg:mb-4" />
                    <p class="text-gray-400 text-sm lg:text-lg mb-1 lg:mb-2">No friends added yet</p>
                    <p class="text-gray-500 text-xs lg:text-sm">Add friends to start splitting bills together</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}