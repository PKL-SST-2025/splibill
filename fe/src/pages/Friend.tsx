import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Users, Heart, TrendingUp, ArrowUp, ArrowDown, UserPlus, MessageCircle, Mail, Phone, Trash2 } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

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

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  date?: string;
  status?: string;
  id: string;
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

export default function FriendsPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Friends data - akan dimuat dari localStorage
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [recentActivities, setRecentActivities] = createSignal<Activity[]>([]);
  
  // Notifications and search data for Header
  const [notifications, setNotifications] = createSignal<Notification[]>([]);
  const [searchData, setSearchData] = createSignal<SearchResult[]>([]);

  // Load friends from localStorage
  const loadFriends = () => {
    try {
      // Load friends from localStorage
      const storedFriends = localStorage.getItem('split_bills_friends');
      const friendsList = storedFriends ? JSON.parse(storedFriends) as Friend[] : [];
      
      // Load activities from localStorage
      const storedActivities = localStorage.getItem('split_bills_activities');
      const activitiesList = storedActivities ? JSON.parse(storedActivities) as Activity[] : [];

      setFriends(friendsList);
      setRecentActivities(activitiesList);
      
      // Update search data dengan data dari localStorage
      const friendSearchData = friendsList.map(friend => ({
        type: "friend",
        title: friend.name,
        subtitle: friend.email,
        status: friend.status === "owes_you" ? "Owes you" : friend.status === "you_owe" ? "You owe" : "Settled",
        id: friend.id
      }));
      
      setSearchData(friendSearchData);
      
      // Load notifications (bisa kosong di awal atau dari localStorage juga)
      const storedNotifications = localStorage.getItem('split_bills_notifications');
      const notificationsList = storedNotifications ? JSON.parse(storedNotifications) as Notification[] : [];
      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error loading friends:', error);
      // Jika ada error, set ke array kosong
      setFriends([]);
      setRecentActivities([]);
      setSearchData([]);
      setNotifications([]);
    }
  };

  // Add friend function (akan dipanggil dari AddFriend page)
  const addFriend = (newFriend: Friend) => {
    const updatedFriends = [...friends(), newFriend];
    setFriends(updatedFriends);
    
    // Save to localStorage
    localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
    
    // Update search data
    const friendSearchData = updatedFriends.map(friend => ({
      type: "friend",
      title: friend.name,
      subtitle: friend.email,
      status: friend.status === "owes_you" ? "Owes you" : friend.status === "you_owe" ? "You owe" : "Settled",
      id: friend.id
    }));
    
    setSearchData(friendSearchData);
    localStorage.setItem('split_bills_search_data', JSON.stringify(friendSearchData));
  };

  // Delete friend
  const deleteFriend = (friendId: string) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      const updatedFriends = friends().filter(friend => friend.id !== friendId);
      setFriends(updatedFriends);
      
      // Save to localStorage
      localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
      
      // Also remove activities related to this friend
      const updatedActivities = recentActivities().filter(activity => activity.friendId !== friendId);
      setRecentActivities(updatedActivities);
      localStorage.setItem('split_bills_activities', JSON.stringify(updatedActivities));
      
      // Update search data
      const updatedSearchData = searchData().filter(item => item.id !== friendId);
      setSearchData(updatedSearchData);
      localStorage.setItem('split_bills_search_data', JSON.stringify(updatedSearchData));
    }
  };

  // Refresh data (berguna jika dipanggil dari halaman lain)
  const refreshData = () => {
    loadFriends();
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
    
    // Load friends data dari localStorage
    loadFriends();
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    // Listen for storage changes (jika data diupdate dari tab lain)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'split_bills_friends' || e.key === 'split_bills_activities') {
        loadFriends();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (jika data diupdate dari halaman yang sama)
    const handleFriendsUpdate = () => {
      loadFriends();
    };
    
    window.addEventListener('friendsUpdated', handleFriendsUpdate);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('friendsUpdated', handleFriendsUpdate);
    };
  });

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

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main content */}
      <main class={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10 transition-all duration-300 ${
        isMobile() ? 'ml-0' : ''
      }`}>
        {/* Header */}
        <Header 
          title="Friends"
          subtitle="Manage your friends and their balances"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

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
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-pink-500/20 rounded-xl">
                <Users class="w-5 h-5 text-pink-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Your Friends</h2>
            </div>
            
            {/* Add Friend Button - always visible */}
            <button 
              onClick={() => navigate("/addfriend")}
              class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-4 py-2 rounded-xl font-medium hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg text-sm"
            >
              <UserPlus class="w-4 h-4 inline mr-2" />
              Add Friend
            </button>
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
              <div class="text-center text-sm text-gray-500">
                <p>💡 Once you add friends, they will appear here with their balance status</p>
              </div>
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