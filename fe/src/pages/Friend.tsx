import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Users, Heart, TrendingUp, ArrowUp, ArrowDown, CreditCard, UserPlus, Search, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, MessageCircle, Calendar, Clock, LogOut, Settings, User, Mail, Phone, Trash2 } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

interface Friend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number; // positive if they owe you, negative if you owe them
  status: "owes_you" | "you_owe" | "settled";
  avatar?: string;
  addedDate: string;
}

interface Activity {
  id: string;
  friendId: string;
  friendName: string;
  action: "paid" | "split" | "reminder" | "settled";
  amount: number;
  description: string;
  date: string;
}

export default function FriendsPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Friends data from localStorage
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [recentActivities, setRecentActivities] = createSignal<Activity[]>([]);

  // Load friends from localStorage
  const loadFriends = () => {
    try {
      const storedFriends = localStorage.getItem('split_bills_friends');
      if (storedFriends) {
        const parsedFriends = JSON.parse(storedFriends);
        setFriends(parsedFriends);
      }
      
      const storedActivities = localStorage.getItem('split_bills_activities');
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities);
        setRecentActivities(parsedActivities);
      }
    } catch (error) {
      console.error('Error loading friends from localStorage:', error);
    }
  };

  // Delete friend
  const deleteFriend = (friendId: string) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      const updatedFriends = friends().filter(friend => friend.id !== friendId);
      setFriends(updatedFriends);
      localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
      
      // Also remove activities related to this friend
      const updatedActivities = recentActivities().filter(activity => activity.friendId !== friendId);
      setRecentActivities(updatedActivities);
      localStorage.setItem('split_bills_activities', JSON.stringify(updatedActivities));
    }
  };

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load friends data
    loadFriends();
    
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

  // Calculate totals
  const totalOwedToYou = () => {
    return friends().reduce((total, friend) => {
      return total + (friend.balance > 0 ? friend.balance : 0);
    }, 0);
  };

  const totalYouOwe = () => {
    return friends().reduce((total, friend) => {
      return total + (friend.balance < 0 ? Math.abs(friend.balance) : 0);
    }, 0);
  };

  const totalFriends = () => friends().length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "owes_you": return "text-emerald-400";
      case "you_owe": return "text-red-400";
      case "settled": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case "owes_you": return "bg-emerald-500/20";
      case "you_owe": return "bg-red-500/20";
      case "settled": return "bg-gray-500/20";
      default: return "bg-gray-500/20";
    }
  };

  const getActivityIcon = (action: string) => {
    switch(action) {
      case "paid": return DollarSign;
      case "split": return Heart;
      case "reminder": return Clock;
      case "settled": return TrendingUp;
      default: return MessageCircle;
    }
  };

  const getActivityColor = (action: string) => {
    switch(action) {
      case "paid": return "text-emerald-400";
      case "split": return "text-pink-400";
      case "reminder": return "text-amber-400";
      case "settled": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
              class={`w-full flex items-center gap-3 p-3 rounded-xl bg-pink-500/10 text-pink-200 border border-pink-500/20 transition-all duration-300 ${
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
            <button
              onClick={toggleSidebar}
              class="hidden lg:block p-2 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300"
            >
              {isSidebarOpen() ? <ChevronLeft class="w-5 h-5" /> : <ChevronRight class="w-5 h-5" />}
            </button>
            <div>
              <h1 class={`text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                Friends
              </h1>
              <p class="text-gray-400 mt-1">Manage your friends and their balances</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <Search class="w-5 h-5" />
            </button>
            <button class="p-2 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300">
              <MessageCircle class="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate("/AddFriend")}
              class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
            >
              <UserPlus class="w-4 h-4 inline mr-2" />
              Add Friend
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <ArrowUp class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1">
                <span class="text-emerald-400 text-sm font-medium">Owed to you</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(totalOwedToYou())}</h3>
            <p class="text-gray-400 text-sm">Total Amount</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-red-500/20 rounded-xl">
                <ArrowDown class="w-6 h-6 text-red-400" />
              </div>
              <div class="flex items-center gap-1">
                <span class="text-red-400 text-sm font-medium">You owe</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(totalYouOwe())}</h3>
            <p class="text-gray-400 text-sm">Total Amount</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <Users class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1">
                <span class="text-purple-400 text-sm font-medium">Total Friends</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{totalFriends()}</h3>
            <p class="text-gray-400 text-sm">Active Friends</p>
          </div>
        </div>

        {/* Friends List */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-pink-500/20 rounded-xl">
              <Users class="w-5 h-5 text-pink-400" />
            </div>
            <h2 class="text-xl font-bold text-white">Your Friends</h2>
          </div>
          
          {friends().length === 0 ? (
            /* Empty State */
            <div class="flex flex-col items-center justify-center py-12">
              <div class="w-24 h-24 bg-gray-800/40 rounded-full flex items-center justify-center mb-6">
                <Users class="w-12 h-12 text-gray-500" />
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">No Friends Yet</h3>
              <p class="text-gray-400 text-center mb-6 max-w-md">
                Start by adding friends to split bills and track expenses together. Click the "Add Friend" button to get started.
              </p>
              <button 
                onClick={() => navigate("/AddFriend")}
                class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
              >
                <UserPlus class="w-4 h-4 inline mr-2" />
                Add Your First Friend
              </button>
            </div>
          ) : (
            /* Friends List */
            <div class="space-y-4">
              <For each={friends()}>
                {(friend) => (
                  <div class="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300 hover:scale-[1.02]">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        {/* Avatar */}
                        <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          friend.avatar ? 'bg-cover bg-center' : 'bg-gradient-to-br from-pink-400 to-purple-500'
                        }`}>
                          {friend.avatar ? (
                            <img src={friend.avatar} alt={friend.name} class="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(friend.name)
                          )}
                        </div>
                        
                        {/* Friend Info */}
                        <div>
                          <h3 class="font-semibold text-white">{friend.name}</h3>
                          <div class="flex items-center gap-4 text-sm text-gray-400">
                            <div class="flex items-center gap-1">
                              <Mail class="w-3 h-3" />
                              {friend.email}
                            </div>
                            {friend.phone && (
                              <div class="flex items-center gap-1">
                                <Phone class="w-3 h-3" />
                                {friend.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Balance and Actions */}
                      <div class="flex items-center gap-4">
                        {/* Balance */}
                        <div class="text-right">
                          <div class={`text-lg font-bold ${getStatusColor(friend.status)}`}>
                            {friend.balance === 0 ? 'Settled' : formatCurrency(Math.abs(friend.balance))}
                          </div>
                          <div class={`text-xs px-2 py-1 rounded-full ${getStatusBg(friend.status)} ${getStatusColor(friend.status)}`}>
                            {friend.status === 'owes_you' ? 'Owes you' : 
                             friend.status === 'you_owe' ? 'You owe' : 'Settled'}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div class="flex items-center gap-2">
                          <button class="p-2 bg-gray-700/50 hover:bg-pink-500/20 rounded-lg transition-all duration-300 group">
                            <MessageCircle class="w-4 h-4 text-gray-400 group-hover:text-pink-400" />
                          </button>
                          <button 
                            onClick={() => deleteFriend(friend.id)}
                            class="p-2 bg-gray-700/50 hover:bg-red-500/20 rounded-lg transition-all duration-300 group"
                          >
                            <Trash2 class="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}