import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Clock, Heart, TrendingUp, ArrowUp, ArrowDown, CreditCard, Wallet, Users, Calendar, Bell, Search, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, Minus, UserPlus, Receipt, Save, ArrowLeft, LogOut, User, Settings } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

export default function AddSplitBillPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);
  
  // Form state
  const [billTitle, setBillTitle] = createSignal("");
  const [billAmount, setBillAmount] = createSignal("");
  const [billDate, setBillDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [billCategory, setBillCategory] = createSignal("food");
  const [billDescription, setBillDescription] = createSignal("");
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [newFriendName, setNewFriendName] = createSignal("");
  const [splitType, setSplitType] = createSignal("equal"); // equal or custom

  const categories = [
    { value: "food", label: "Food & Drinks", icon: DollarSign },
    { value: "transport", label: "Transportation", icon: CreditCard },
    { value: "entertainment", label: "Entertainment", icon: Heart },
    { value: "shopping", label: "Shopping", icon: Wallet },
    { value: "utilities", label: "Utilities", icon: Receipt },
    { value: "other", label: "Other", icon: Plus },
  ];

  // Define interfaces
  interface Friend {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    amount: number;
    selected: boolean;
    avatar?: string;
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

  interface SearchResult {
    type: string;
    title: string;
    subtitle: string;
    date?: string;
    status?: string;
    id: string;
  }

  // Search data for header
  const searchData = (): SearchResult[] => {
    const billResults: SearchResult[] = [
      {
        type: 'bill',
        title: billTitle() || 'Current Bill',
        subtitle: `Rp ${billAmount() || '0'} • ${selectedFriends().length} friends`,
        date: billDate(),
        status: 'draft',
        id: 'current-bill'
      }
    ];

    const friendResults: SearchResult[] = friends().map((friend) => ({
      type: 'friend',
      title: friend.name,
      subtitle: friend.email || 'No email provided',
      status: friend.selected ? 'Selected' : 'Available',
      id: `friend-${friend.id}`
    }));

    return [...billResults, ...friendResults];
  };

  // Load friends from localStorage
  const loadFriendsFromStorage = () => {
    try {
      const storedFriends = localStorage.getItem('split_bills_friends');
      if (storedFriends) {
        const parsedFriends = JSON.parse(storedFriends);
        const convertedFriends = parsedFriends.map((friend: any, index: number) => ({
          id: index + 1,
          name: friend.name,
          email: friend.email,
          phone: friend.phone,
          amount: 0,
          selected: false,
          avatar: friend.avatar
        }));
        setFriends(convertedFriends);
      }
    } catch (error) {
      console.error('Error loading friends from localStorage:', error);
    }
  };

  // Load notifications
  const loadNotifications = () => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
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
    
    // Load data
    loadFriendsFromStorage();
    loadNotifications();
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  const toggleFriend = (id: number) => {
    setFriends(friends().map((friend: Friend) => 
      friend.id === id ? { ...friend, selected: !friend.selected } : friend
    ));
  };

  const addFriend = () => {
    if (newFriendName().trim()) {
      const newId = friends().length > 0 ? Math.max(...friends().map((f: Friend) => f.id)) + 1 : 1;
      const newFriend = { 
        id: newId, 
        name: newFriendName().trim(), 
        amount: 0, 
        selected: false 
      };
      
      setFriends([...friends(), newFriend]);
      
      try {
        const storedFriends = localStorage.getItem('split_bills_friends');
        const existingFriends = storedFriends ? JSON.parse(storedFriends) : [];
        
        const friendToSave = {
          id: `friend_${Date.now()}`,
          name: newFriendName().trim(),
          email: "",
          phone: "",
          balance: 0,
          status: "settled",
          addedDate: new Date().toISOString()
        };
        
        const updatedFriends = [...existingFriends, friendToSave];
        localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
      } catch (error) {
        console.error('Error saving friend to localStorage:', error);
      }
      
      setNewFriendName("");
    }
  };

  const removeFriend = (id: number) => {
    setFriends(friends().filter((friend: Friend) => friend.id !== id));
  };

  const updateFriendAmount = (id: number, amount: string) => {
    setFriends(friends().map((friend: Friend) => 
      friend.id === id ? { ...friend, amount: parseFloat(amount) || 0 } : friend
    ));
  };

  const selectedFriends = () => friends().filter((f: Friend) => f.selected);
  const totalAmount = () => parseFloat(billAmount()) || 0;
  const splitAmount = () => {
    const selected = selectedFriends();
    if (selected.length === 0) return 0;
    if (splitType() === "equal") {
      return totalAmount() / (selected.length + 1);
    }
    return 0;
  };

  const customTotal = () => {
    return selectedFriends().reduce((sum: number, friend: Friend) => sum + friend.amount, 0);
  };

  const createNotification = (type: string, title: string, message: string, icon = 'info'): Notification => {
    const notification: Notification = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      time: new Date().toLocaleString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      }),
      read: false,
      icon
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    
    return notification;
  };

  const handleSubmit = () => {
    if (!billTitle() || !billAmount() || selectedFriends().length === 0) {
      alert("Please fill in all required fields and select at least one friend.");
      return;
    }

    if (splitType() === "custom" && Math.abs(customTotal() + splitAmount() - totalAmount()) > 0.01) {
      alert("Custom amounts don't add up to the total bill amount.");
      return;
    }

    const newBill = {
      date: billDate(),
      total: totalAmount(),
      description: billTitle(),
      participants: selectedFriends().length + 1,
      category: billCategory(),
      splitType: splitType(),
      createdAt: new Date().toISOString()
    };

    const existingBills = JSON.parse(localStorage.getItem('splitBills') || '[]');
    const updatedBills = [newBill, ...existingBills];
    localStorage.setItem('splitBills', JSON.stringify(updatedBills));

    try {
      const existingFriends = JSON.parse(localStorage.getItem('split_bills_friends') || '[]');
      let updatedFriends = [...existingFriends];

      selectedFriends().forEach(selectedFriend => {
        const existingFriendIndex = updatedFriends.findIndex(f => f.name === selectedFriend.name);
        
        const friendAmount = splitType() === 'equal' 
          ? totalAmount() / (selectedFriends().length + 1)
          : selectedFriend.amount;

        if (existingFriendIndex >= 0) {
          updatedFriends[existingFriendIndex] = {
            ...updatedFriends[existingFriendIndex],
            balance: updatedFriends[existingFriendIndex].balance + friendAmount,
            status: "owes_you"
          };
        }
      });

      localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
    } catch (error) {
      console.error('Error updating friends with bill amounts:', error);
    }

    createNotification(
      'bill',
      'New Split Bill Created',
      `"${billTitle()}" for Rp ${totalAmount().toLocaleString()} has been created and shared with ${selectedFriends().length} friend(s).`,
      'bill'
    );

    selectedFriends().forEach(friend => {
      const amount = splitType() === 'equal' 
        ? totalAmount() / (selectedFriends().length + 1)
        : friend.amount;
      
      createNotification(
        'reminder',
        `Bill Split with ${friend.name}`,
        `${friend.name} owes Rp ${amount.toLocaleString()} for "${billTitle()}".`,
        'user'
      );
    });

    alert("Split bill created successfully!");
    
    setBillTitle("");
    setBillAmount("");
    setBillDate(new Date().toISOString().split('T')[0]);
    setBillCategory("food");
    setBillDescription("");
    setFriends(friends().map(f => ({ ...f, selected: false, amount: 0 })));
    setSplitType("equal");
    
    navigate("/dashboard");
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

      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isMobile={isMobile} 
      />

      {/* Main content */}
      <main class={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10 transition-all duration-300 ${
        isMobile() ? 'ml-0' : ''
      }`}>
        {/* Header Component */}
        <Header 
          title="Add Split Bill"
          subtitle="Create a new expense to split with friends"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Form */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Details */}
          <div class={`lg:col-span-2 bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-pink-200/20 rounded-xl">
                <Receipt class="w-5 h-5 text-pink-200" />
              </div>
              <h2 class="text-xl font-bold text-white">Bill Details</h2>
            </div>

            <div class="space-y-6">
              {/* Bill Title */}
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Bill Title *</label>
                <input
                  type="text"
                  value={billTitle()}
                  onInput={(e) => setBillTitle(e.target.value)}
                  placeholder="e.g., Dinner at Sushi Restaurant"
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-200/50 focus:ring-2 focus:ring-pink-200/20 transition-all duration-300"
                />
              </div>

              {/* Amount and Date */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Total Amount *</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rp</span>
                    <input
                      type="number"
                      value={billAmount()}
                      onInput={(e) => setBillAmount((e.target as HTMLInputElement).value)}
                      placeholder="0"
                      class="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-200/50 focus:ring-2 focus:ring-pink-200/20 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={billDate()}
                    onInput={(e) => setBillDate((e.target as HTMLInputElement).value)}
                    class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-pink-200/50 focus:ring-2 focus:ring-pink-200/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={billCategory()}
                  onChange={(e) => setBillCategory((e.target as HTMLSelectElement).value)}
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-pink-200/50 focus:ring-2 focus:ring-pink-200/20 transition-all duration-300"
                >
                  <For each={categories}>
                    {(category) => (
                      <option value={category.value}>{category.label}</option>
                    )}
                  </For>
                </select>
              </div>

              {/* Description */}
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                <textarea
                  value={billDescription()}
                  onInput={(e) => setBillDescription((e.target as HTMLTextAreaElement).value)}
                  placeholder="Add any additional details..."
                  rows={3}
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-200/50 focus:ring-2 focus:ring-pink-200/20 transition-all duration-300 resize-none"
                />
              </div>

              {/* Split Type */}
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Split Type</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      value="equal"
                      checked={splitType() === "equal"}
                      onChange={(e) => setSplitType((e.target as HTMLInputElement).value)}
                      class="w-4 h-4 text-pink-200 bg-gray-800/50 border-gray-700/50 focus:ring-pink-200/20"
                    />
                    <span class="text-gray-300">Split Equally</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="splitType"
                      value="custom"
                      checked={splitType() === "custom"}
                      onChange={(e) => setSplitType((e.target as HTMLInputElement).value)}
                      class="w-4 h-4 text-pink-200 bg-gray-800/50 border-gray-700/50 focus:ring-pink-200/20"
                    />
                    <span class="text-gray-300">Custom Amounts</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Selection */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-emerald-500/20 rounded-xl">
                <Users class="w-5 h-5 text-emerald-400" />
              </div>
              <h2 class="text-xl font-bold text-white">Split With</h2>
            </div>

            {/* Add Friend */}
            <div class="mb-6">
              <div class="flex gap-2">
                <input
                  type="text"
                  value={newFriendName()}
                  onInput={(e) => setNewFriendName((e.target as HTMLInputElement).value)}
                  placeholder="Add new friend"
                  class="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-200/50 focus:ring-1 focus:ring-pink-200/20 transition-all duration-300"
                  onKeyDown={(e) => e.key === 'Enter' && addFriend()}
                />
                <button
                  onClick={addFriend}
                  class="px-4 py-2 bg-pink-200/20 hover:bg-pink-200/30 border border-pink-200/30 rounded-lg text-pink-200 transition-all duration-300"
                >
                  <UserPlus class="w-4 h-4" />
                </button>
              </div>
              <p class="text-gray-500 text-xs mt-1">
                Your saved friends will appear below automatically
              </p>
            </div>

            {/* Friends List */}
            <div class="space-y-3">
              {friends().length === 0 ? (
                <div class="text-center py-8">
                  <div class="w-16 h-16 bg-gray-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users class="w-8 h-8 text-gray-500" />
                  </div>
                  <p class="text-gray-400 mb-2">No friends available</p>
                  <p class="text-gray-500 text-sm">Add friends from the Friends page or add a new friend above</p>
                  <button
                    onClick={() => navigate("/friends")}
                    class="mt-3 text-pink-200 hover:text-pink-100 text-sm underline"
                  >
                    Go to Friends page
                  </button>
                </div>
              ) : (
                <For each={friends()}>
                  {(friend: Friend) => (
                    <div class={`p-4 rounded-xl border transition-all duration-300 ${
                      friend.selected 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60'
                    }`}>
                      <div class="flex items-center justify-between mb-2">
                        <label class="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={friend.selected}
                            onChange={() => toggleFriend(friend.id)}
                            class="w-4 h-4 text-emerald-400 bg-gray-800/50 border-gray-700/50 rounded focus:ring-emerald-400/20"
                          />
                          <div class="flex items-center gap-2">
                            <div class={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                              friend.avatar ? 'bg-cover bg-center' : 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                            }`}>
                              {friend.avatar ? (
                                <img src={friend.avatar} alt={friend.name} class="w-full h-full rounded-full object-cover" />
                              ) : (
                                getInitials(friend.name)
                              )}
                            </div>
                            <div>
                              <span class="text-white font-medium">{friend.name}</span>
                              {friend.email && (
                                <p class="text-gray-400 text-xs">{friend.email}</p>
                              )}
                            </div>
                          </div>
                        </label>
                        <button
                          onClick={() => removeFriend(friend.id)}
                          class="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                        >
                          <Minus class="w-4 h-4" />
                        </button>
                      </div>
                      
                      {friend.selected && (
                        <div class="mt-3">
                          {splitType() === "equal" ? (
                            <div class="text-emerald-400 font-medium">
                              Rp {splitAmount().toLocaleString()}
                            </div>
                          ) : (
                            <div class="relative">
                              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                              <input
                                type="number"
                                value={friend.amount || ""}
                                onInput={(e) => updateFriendAmount(friend.id, (e.target as HTMLInputElement).value)}
                                placeholder="0"
                                class="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all duration-300"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </For>
              )}
            </div>
          </div>
        </div>

        {/* Summary & Actions */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-4">Summary</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-gray-800/40 rounded-xl p-4">
                  <p class="text-gray-400 text-sm">Total Amount</p>
                  <p class="text-white font-bold text-lg">Rp {totalAmount().toLocaleString()}</p>
                </div>
                <div class="bg-gray-800/40 rounded-xl p-4">
                  <p class="text-gray-400 text-sm">Your Share</p>
                  <p class="text-emerald-400 font-bold text-lg">Rp {splitAmount().toLocaleString()}</p>
                </div>
                <div class="bg-gray-800/40 rounded-xl p-4">
                  <p class="text-gray-400 text-sm">Friends</p>
                  <p class="text-pink-200 font-bold text-lg">{selectedFriends().length}</p>
                </div>
                <div class="bg-gray-800/40 rounded-xl p-4">
                  <p class="text-gray-400 text-sm">Status</p>
                  <p class="text-amber-400 font-bold text-lg">
                    {splitType() === "custom" && Math.abs(customTotal() + splitAmount() - totalAmount()) > 0.01 
                      ? "Invalid" 
                      : selectedFriends().length > 0 && billTitle() && billAmount() 
                        ? "Ready" 
                        : "Incomplete"
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                class="px-6 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!billTitle() || !billAmount() || selectedFriends().length === 0}
                class="px-8 py-3 bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Save class="w-5 h-5" />
                Create Split Bill
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div class={`bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-500/20 rounded-xl flex-shrink-0">
              <Receipt class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">How it works</h4>
              <div class="space-y-2 text-gray-300">
                <p>• Enter the bill details including title, amount, and category</p>
                <p>• Your saved friends will automatically appear in the "Split With" section</p>
                <p>• Select which friends to include in the split</p>
                <p>• Choose between equal split or custom amounts</p>
                <p>• Review the summary and create your split bill</p>
                <p>• Friends will be notified and their balances will be updated</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}