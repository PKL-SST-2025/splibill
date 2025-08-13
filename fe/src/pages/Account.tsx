import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  User, TrendingUp, Users, UserPlus, Receipt, Calendar, 
  DollarSign, Clock, Heart, Wallet, ArrowUp, Star,
  Award, Target, Activity, BarChart3, PieChart,
  CheckCircle, AlertCircle, Timer, Zap, Plus, FileText,
  CreditCard, ShoppingBag, Utensils, Car, Gamepad2,
  Home, ArrowDown, Settings
} from "lucide-solid";
import Sidebar from "../layouts/Sidebar"; // Import komponen Sidebar
import Header from "../layouts/Header";   // Import komponen Header

export default function AccountPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("overview");
  const [currentUser, setCurrentUser] = createSignal(null);
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

  // User state with real data from localStorage/session
  const [user, setUser] = createSignal({
    name: "Loading...",
    email: "Loading...",
    avatar: "?",
    joined: "Loading...",
    phone: "Not provided",
    location: "Not specified",
    verified: true,
    level: "Gold Member",
    username: "Loading..."
  });

  // Define interfaces for type safety
  interface Transaction {
    icon: any;
    title: string;
    time: string;
    amount: string;
    status: string;
    participants: number;
    category?: string;
    date?: string;
  }

  interface Achievement {
    icon: any;
    title: string;
    description: string;
    earned: boolean;
  }

  interface AnalyticsData {
    totalSpent: number;
    monthlySpending: number;
    categoricalData: { [key: string]: number };
    monthlyData: { month: string; amount: number }[];
  }

  interface UserStats {
    totalSpent: number;
    activeGroups: number;
    friends: number;
    thisMonth: number;
    totalBalance: number;
    pendingBills: number;
  }

  // State for dynamic data
  const [transactions, setTransactions] = createSignal<Transaction[]>([]);
  const [achievements, setAchievements] = createSignal<Achievement[]>([]);
  const [analyticsData, setAnalyticsData] = createSignal<AnalyticsData | null>(null);
  const [userStats, setUserStats] = createSignal<UserStats>({
    totalSpent: 0,
    activeGroups: 0,
    friends: 0,
    thisMonth: 0,
    totalBalance: 0,
    pendingBills: 0
  });

  // Get current logged-in user data
  const getCurrentUser = () => {
    try {
      // Try to get from sessionStorage first (current session)
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        return userData;
      }

      // Fallback to localStorage for remembered users
      const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        return userData;
      }

      // If no user data found, redirect to login
      navigate("/login");
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      navigate("/login");
      return null;
    }
  };

  // Get user registration data from localStorage
  const getUserRegistrationData = (email: string) => {
    try {
      const registeredAccounts = localStorage.getItem('registeredAccounts');
      if (registeredAccounts) {
        const accounts = JSON.parse(registeredAccounts);
        const userAccount = accounts.find((account: any) => account.email === email);
        return userAccount || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user registration data:', error);
      return null;
    }
  };

  // Generate user avatar from name
  const generateAvatar = (name: string) => {
    if (!name || name === "Loading...") return "?";
    
    const nameParts = name.split(' ').filter(part => part.length > 0);
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return "?";
  };

  // Format join date
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  // Load current user data with real information
  const loadCurrentUser = () => {
    const userData = getCurrentUser();
    if (!userData) return;

    setCurrentUser(userData);
    
    // Get additional user data from registration
    const registrationData = getUserRegistrationData(userData.email);
    
    // Update user state with actual data
    const displayName = registrationData?.name || registrationData?.username || userData.username || userData.name || "Anonymous User";
    
    setUser({
      name: displayName,
      username: registrationData?.username || userData.username || "user",
      email: userData.email,
      avatar: generateAvatar(displayName),
      joined: registrationData?.createdAt ? formatJoinDate(registrationData.createdAt) : "Recently",
      phone: registrationData?.phone || "Not provided",
      location: registrationData?.country || registrationData?.location || "Not specified",
      verified: true,
      level: "Gold Member"
    });

    // Update notifications with personalized content
    setNotifications(prev => [
      {
        id: Date.now(),
        type: "welcome",
        title: "Welcome Back!",
        message: `Hello ${displayName.split(' ')[0]}, welcome to your account dashboard.`,
        time: "Now",
        read: false,
        icon: "user"
      },
      ...prev
    ]);
  };

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return Utensils;
      case 'transport': return Car;
      case 'entertainment': return Gamepad2;
      case 'shopping': return ShoppingBag;
      case 'utilities': return Home;
      default: return Receipt;
    }
  };

  // Load data from localStorage with improved logic
  const loadUserData = () => {
    const userData = getCurrentUser();
    if (!userData) return;

    try {
      // Load split bills with enhanced filtering
      const splitBills = JSON.parse(localStorage.getItem('splitBills') || '[]');
      const friends = JSON.parse(localStorage.getItem('split_bills_friends') || '[]');
      
      console.log('Loaded split bills:', splitBills);
      console.log('Current user email:', userData.email);
      
      // Enhanced filtering: Get ALL bills since we're the one creating them
      // The bills are created by the current user, so we should see all of them
      const userBills = splitBills.length > 0 ? splitBills : [];
      
      console.log('Filtered user bills:', userBills);
      
      // Process transactions from split bills
      const processedTransactions: Transaction[] = userBills.map((bill: any, index: number) => {
        const billDate = new Date(bill.createdAt || bill.date || new Date());
        return {
          icon: getCategoryIcon(bill.category),
          title: bill.description || bill.title || `Bill #${index + 1}`,
          time: formatTime(bill.createdAt || bill.date || new Date().toISOString()),
          amount: `Rp ${bill.total ? bill.total.toLocaleString('id-ID') : '0'}`,
          status: bill.status || 'split',
          participants: bill.participants || 1,
          category: bill.category,
          date: bill.date || bill.createdAt
        };
      });

      // Sort transactions by date (newest first)
      processedTransactions.sort((a, b) => {
        const dateA = new Date(a.date || a.time);
        const dateB = new Date(b.date || b.time);
        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(processedTransactions);
      console.log('Processed transactions:', processedTransactions);

      // Calculate user stats with enhanced logic
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyTotal = userBills
        .filter((bill: any) => {
          const billDate = new Date(bill.date || bill.createdAt);
          return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
        })
        .reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);

      const totalSpent = userBills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);
      
      // Calculate balance from friends who owe money
      const userFriends = friends.filter((friend: any) => friend.name && friend.name.trim() !== '');
      
      const totalBalance = userFriends.reduce((sum: number, friend: any) => {
        return sum + (friend.balance || 0);
      }, 0);

      // Count pending bills (bills in last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const pendingBills = userBills.filter((bill: any) => {
        const billDate = new Date(bill.date || bill.createdAt);
        return billDate >= thirtyDaysAgo;
      }).length;

      // Estimate active groups based on unique categories
      const uniqueCategories = [...new Set(userBills.map((bill: any) => bill.category))].filter(Boolean);
      const activeGroups = Math.max(1, uniqueCategories.length);

      const calculatedStats = {
        totalSpent,
        activeGroups,
        friends: userFriends.length,
        thisMonth: monthlyTotal,
        totalBalance,
        pendingBills
      };

      setUserStats(calculatedStats);
      console.log('Calculated user stats:', calculatedStats);

      // Generate achievements based on user activity
      const generatedAchievements = generateAchievements(userBills, userFriends);
      setAchievements(generatedAchievements);

      // Generate analytics data
      const analytics = generateAnalyticsData(userBills);
      setAnalyticsData(analytics);

    } catch (error) {
      console.error('Error loading user data:', error);
      // Set default empty state
      setTransactions([]);
      setAchievements(generateAchievements([], []));
      setAnalyticsData({
        totalSpent: 0,
        monthlySpending: 0,
        categoricalData: {},
        monthlyData: []
      });
    }
  };

  // Format time helper (enhanced)
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Unknown time';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffMinutes < 1) {
        return 'Just now';
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('id-ID');
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Generate achievements based on activity (enhanced)
  const generateAchievements = (bills: any[], friends: any[]) => {
    const totalSpent = bills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);
    const foodBills = bills.filter((bill: any) => bill.category === 'food');
    
    const achievements: Achievement[] = [
      {
        icon: Receipt,
        title: "First Split",
        description: "Create your first split bill",
        earned: bills.length > 0
      },
      {
        icon: Users,
        title: "Social Spender",
        description: "Add 5 or more friends",
        earned: friends.length >= 5
      },
      {
        icon: Target,
        title: "Regular User",
        description: "Create 10 split bills",
        earned: bills.length >= 10
      },
      {
        icon: Star,
        title: "Big Spender",
        description: "Split bills worth over Rp 1,000,000",
        earned: totalSpent >= 1000000
      },
      {
        icon: Heart,
        title: "Food Lover",
        description: "Create 5 food-related bills",
        earned: foodBills.length >= 5
      },
      {
        icon: Zap,
        title: "Quick Splitter",
        description: "Create 3 bills in one day",
        earned: checkQuickSplitter(bills)
      }
    ];

    return achievements;
  };

  // Helper function to check if user created 3 bills in one day
  const checkQuickSplitter = (bills: any[]) => {
    const billsByDate: { [key: string]: number } = {};
    
    bills.forEach((bill: any) => {
      const date = new Date(bill.date || bill.createdAt).toDateString();
      billsByDate[date] = (billsByDate[date] || 0) + 1;
    });
    
    return Object.values(billsByDate).some(count => count >= 3);
  };

  // Generate analytics data (enhanced)
  const generateAnalyticsData = (bills: any[]): AnalyticsData => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySpending = bills
      .filter((bill: any) => {
        const billDate = new Date(bill.date || bill.createdAt);
        return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);

    const totalSpent = bills.reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);

    // Categorical breakdown
    const categoricalData: { [key: string]: number } = {};
    bills.forEach((bill: any) => {
      const category = bill.category || 'other';
      const amount = bill.total || 0;
      categoricalData[category] = (categoricalData[category] || 0) + amount;
    });

    // Monthly data for the last 6 months
    const monthlyData: { month: string; amount: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthlyAmount = bills
        .filter((bill: any) => {
          const billDate = new Date(bill.date || bill.createdAt);
          return billDate.getMonth() === monthIndex && billDate.getFullYear() === year;
        })
        .reduce((sum: number, bill: any) => sum + (bill.total || 0), 0);

      monthlyData.push({
        month: monthNames[monthIndex],
        amount: monthlyAmount
      });
    }

    return {
      totalSpent,
      monthlySpending,
      categoricalData,
      monthlyData
    };
  };

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Load current user first, then user data
    loadCurrentUser();
    loadUserData();
    
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

  interface EmptyStateProps {
    icon: any;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
  }

  const EmptyState = ({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) => (
    <div class="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div class="w-20 h-20 bg-gray-800/60 rounded-full flex items-center justify-center mb-6">
        <Icon class="w-10 h-10 text-gray-500" />
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">{title}</h3>
      <p class="text-gray-400 mb-6 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          class="flex items-center gap-2 px-6 py-3 bg-pink-200/10 text-pink-200 rounded-xl border border-pink-200/20 hover:bg-pink-200/20 transition-all duration-300"
        >
          <Plus class="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );

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
          subtitle={`Welcome back, ${user().name !== "Loading..." ? user().name.split(' ')[0] : 'User'}!`}
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
          ].map((tab: any) => (
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
                        {user().avatar}
                      </div>
                      {user().verified && (
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle class="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div class="flex-1">
                      <div class="mb-4">
                        <h2 class="text-2xl font-bold mb-1 text-white">{user().name}</h2>
                        <p class="text-pink-200 text-sm font-medium mb-2">{user().level}</p>
                        <div class="flex items-center gap-2 mb-2">
                          <span class="text-gray-400 text-sm">@{user().username}</span>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="flex items-center gap-2 text-gray-300">
                          <User class="w-4 h-4" />
                          <span>{user().email}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-300">
                          <Calendar class="w-4 h-4" />
                          <span>Member since {user().joined}</span>
                        </div>
                        {user().phone !== "Not provided" && (
                          <div class="flex items-center gap-2 text-gray-300">
                            <span class="w-4 h-4 flex items-center justify-center text-xs">📱</span>
                            <span>{user().phone}</span>
                          </div>
                        )}
                        <div class="flex items-center gap-2 text-gray-300">
                          <span class="w-4 h-4 flex items-center justify-center text-xs">📍</span>
                          <span>{user().location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div class="bg-gray-800/40 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">Quick Stats</h3>
                    <button 
                      onClick={() => navigate("/account/settings")}
                      class="text-gray-400 hover:text-pink-200 transition-colors duration-200"
                      title="Account Settings"
                    >
                      <Settings class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Total Spent</span>
                      <span class="text-white font-bold">Rp {userStats().totalSpent.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Active Groups</span>
                      <span class="text-white font-bold">{userStats().activeGroups}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">Friends</span>
                      <span class="text-white font-bold">{userStats().friends}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-400">This Month</span>
                      <span class="text-emerald-400 font-bold">Rp {userStats().thisMonth.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  title: "Total Balance", 
                  value: `Rp ${userStats().totalBalance.toLocaleString('id-ID')}`, 
                  change: userStats().totalBalance > 0 ? "+" + userStats().totalBalance.toLocaleString('id-ID') : "0", 
                  icon: Wallet, 
                  color: "emerald" 
                },
                { 
                  title: "This Month", 
                  value: `Rp ${userStats().thisMonth.toLocaleString('id-ID')}`, 
                  change: "+" + Math.round((userStats().thisMonth / Math.max(userStats().totalSpent - userStats().thisMonth, 1)) * 100) + "%", 
                  icon: TrendingUp, 
                  color: "blue" 
                },
                { 
                  title: "Pending Bills", 
                  value: userStats().pendingBills.toString(), 
                  change: userStats().pendingBills > 0 ? "Active" : "None", 
                  icon: Clock, 
                  color: "amber" 
                },
                { 
                  title: "Friends", 
                  value: userStats().friends.toString(), 
                  change: userStats().friends > 0 ? "+" + userStats().friends : "0", 
                  icon: Users, 
                  color: "purple" 
                }
              ].map((card: any, index: number) => (
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
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-1000 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/30">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-500/20 rounded-xl">
                  <Activity class="w-5 h-5 text-blue-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Recent Transactions</h2>
                {transactions().length > 0 && (
                  <div class="px-3 py-1 bg-blue-500/20 rounded-full">
                    <span class="text-blue-400 text-sm font-medium">{transactions().length}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => loadUserData()}
                class="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 text-sm"
              >
                Refresh
              </button>
            </div>
            
            {transactions().length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No Transactions Yet"
                description="Your transaction history will appear here once you start splitting bills and making payments."
                actionText="Create First Bill"
                onAction={() => navigate("/bills/add")}
              />
            ) : (
              <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
                {transactions().map((transaction: Transaction, index: number) => (
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
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span class="capitalize">{transaction.category}</span>
                            </>
                          )}
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
            )}
          </div>
        )}

        {activeTab() === "achievements" && (
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-1000 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/30">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-500/20 rounded-xl">
                  <Award class="w-5 h-5 text-amber-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Achievements</h2>
                <div class="px-3 py-1 bg-amber-500/20 rounded-full">
                  <span class="text-amber-400 text-sm font-medium">
                    {achievements().filter(a => a.earned).length}/{achievements().length}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements().map((achievement: Achievement, index: number) => (
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
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 transition-all duration-1000 ${
            animate() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/30">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-500/20 rounded-xl">
                  <BarChart3 class="w-5 h-5 text-purple-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Spending Analytics</h2>
              </div>
            </div>
            
            {!analyticsData() || transactions().length === 0 ? (
              <EmptyState
                icon={PieChart}
                title="No Analytics Data"
                description="Start making transactions and splitting bills to see detailed analytics of your spending patterns and financial habits."
                actionText="Create Bill"
                onAction={() => navigate("/bills/add")}
              />
            ) : (
              <div class="p-6">
                {/* Summary Cards */}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div class="bg-gray-800/40 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="p-2 bg-emerald-500/20 rounded-lg">
                        <DollarSign class="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 class="text-lg font-semibold text-white">Total Spent</h3>
                    </div>
                    <p class="text-2xl font-bold text-emerald-400">
                      Rp {analyticsData()!.totalSpent.toLocaleString('id-ID')}
                    </p>
                    <p class="text-gray-400 text-sm mt-1">All time spending</p>
                  </div>

                  <div class="bg-gray-800/40 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="p-2 bg-blue-500/20 rounded-lg">
                        <TrendingUp class="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 class="text-lg font-semibold text-white">This Month</h3>
                    </div>
                    <p class="text-2xl font-bold text-blue-400">
                      Rp {analyticsData()!.monthlySpending.toLocaleString('id-ID')}
                    </p>
                    <p class="text-gray-400 text-sm mt-1">Current month spending</p>
                  </div>

                  <div class="bg-gray-800/40 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="p-2 bg-purple-500/20 rounded-lg">
                        <BarChart3 class="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 class="text-lg font-semibold text-white">Avg per Bill</h3>
                    </div>
                    <p class="text-2xl font-bold text-purple-400">
                      Rp {transactions().length > 0 ? Math.round(analyticsData()!.totalSpent / transactions().length).toLocaleString('id-ID') : '0'}
                    </p>
                    <p class="text-gray-400 text-sm mt-1">Average bill amount</p>
                  </div>
                </div>

                {/* Charts */}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Spending Chart */}
                  <div class="bg-gray-800/40 rounded-xl p-6">
                    <h3 class="text-lg font-semibold mb-4 text-white">Monthly Overview</h3>
                    <div class="h-48 flex items-end justify-between gap-2">
                      {analyticsData()!.monthlyData.map((data, index) => {
                        const maxAmount = Math.max(...analyticsData()!.monthlyData.map(d => d.amount));
                        const height = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                        return (
                          <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-gray-700/50 rounded-t-lg relative group cursor-pointer hover:bg-pink-200/20 transition-all duration-300" 
                                 style={`height: ${Math.max(height, 5)}%`}>
                              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Rp {data.amount.toLocaleString('id-ID')}
                              </div>
                            </div>
                            <span class="text-xs text-gray-400 mt-2">{data.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Category Breakdown */}
                  <div class="bg-gray-800/40 rounded-xl p-6">
                    <h3 class="text-lg font-semibold mb-4 text-white">Category Breakdown</h3>
                    <div class="space-y-3">
                      {Object.entries(analyticsData()!.categoricalData)
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = analyticsData()!.totalSpent > 0 ? (amount / analyticsData()!.totalSpent) * 100 : 0;
                          const IconComponent = getCategoryIcon(category);
                          return (
                            <div class="flex items-center justify-between">
                              <div class="flex items-center gap-3 flex-1">
                                <div class="p-2 bg-gray-700/40 rounded-lg">
                                  <IconComponent class="w-4 h-4 text-gray-400" />
                                </div>
                                <div class="flex-1">
                                  <div class="flex items-center justify-between mb-1">
                                    <span class="text-white capitalize text-sm font-medium">{category}</span>
                                    <span class="text-gray-300 text-sm">Rp {amount.toLocaleString('id-ID')}</span>
                                  </div>
                                  <div class="w-full bg-gray-700/30 rounded-full h-2">
                                    <div 
                                      class="bg-gradient-to-r from-pink-200 to-pink-300 h-2 rounded-full transition-all duration-500"
                                      style={`width: ${percentage}%`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {Object.keys(analyticsData()!.categoricalData).length === 0 && (
                      <div class="text-center py-8 text-gray-500">
                        <PieChart class="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No category data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spending Insights */}
                <div class="mt-6 bg-gray-800/40 rounded-xl p-6">
                  <h3 class="text-lg font-semibold mb-4 text-white">Spending Insights</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Most Expensive Category */}
                    {Object.keys(analyticsData()!.categoricalData).length > 0 && (
                      <div class="bg-gray-700/30 rounded-lg p-4">
                        <div class="flex items-center gap-2 mb-2">
                          <ArrowUp class="w-4 h-4 text-red-400" />
                          <span class="text-red-400 font-medium text-sm">Highest Spending</span>
                        </div>
                        <p class="text-white font-semibold capitalize">
                          {Object.entries(analyticsData()!.categoricalData)
                            .reduce((max, [cat, amount]) => amount > max[1] ? [cat, amount] : max, ['', 0])[0]}
                        </p>
                        <p class="text-gray-400 text-sm">
                          Rp {Object.entries(analyticsData()!.categoricalData)
                            .reduce((max, [cat, amount]) => amount > max[1] ? [cat, amount] : max, ['', 0])[1].toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}

                    {/* Most Recent Activity */}
                    <div class="bg-gray-700/30 rounded-lg p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <Clock class="w-4 h-4 text-blue-400" />
                        <span class="text-blue-400 font-medium text-sm">Recent Activity</span>
                      </div>
                      <p class="text-white font-semibold">
                        {transactions().length > 0 ? 'Active' : 'None'}
                      </p>
                      <p class="text-gray-400 text-sm">
                        {transactions().length} transaction{transactions().length !== 1 ? 's' : ''} total
                      </p>
                    </div>

                    {/* Spending Trend */}
                    <div class="bg-gray-700/30 rounded-lg p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <TrendingUp class="w-4 h-4 text-emerald-400" />
                        <span class="text-emerald-400 font-medium text-sm">Monthly Trend</span>
                      </div>
                      <p class="text-white font-semibold">
                        {analyticsData()!.monthlySpending > 0 ? 'Growing' : 'Stable'}
                      </p>
                      <p class="text-gray-400 text-sm">
                        Rp {analyticsData()!.monthlySpending.toLocaleString('id-ID')} this month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}