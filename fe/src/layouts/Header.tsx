import { createSignal, createEffect, For } from "solid-js";
import { Search, Bell, Plus, DollarSign, User, Check, AlertCircle, Info, UserPlus } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

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

interface HeaderProps {
  title: string;
  subtitle: string;
  searchData: () => SearchResult[];
  notifications: () => Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export default function Header(props: HeaderProps) {
  const navigate = useNavigate();
  
  // Search functionality with debouncing
  const [isSearchOpen, setIsSearchOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = createSignal("");
  const [searchResults, setSearchResults] = createSignal<SearchResult[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  
  // Notification functionality
  const [isNotificationOpen, setIsNotificationOpen] = createSignal(false);

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
      const filtered = props.searchData().filter(item =>
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
  const unreadCount = () => props.notifications().filter((n: Notification) => !n.read).length;
  
  const markNotificationAsRead = (id: number) => {
    const updated = props.notifications().map((notification: Notification) => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    );
    props.setNotifications(updated);
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = props.notifications().map((notification: Notification) => ({ ...notification, read: true }));
    props.setNotifications(updated);
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updated));
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

  // Add event listener for clicking outside
  document.addEventListener('click', handleClickOutside);

  return (
    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-16 lg:pt-4 px-4 sm:px-0">
      <div class="w-full sm:w-auto">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent break-words">
          {props.title}
        </h1>
        <p class="text-gray-400 mt-1 text-sm sm:text-base break-words">{props.subtitle}</p>
      </div>
      
      <div class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
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
            <div class="search-dropdown absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
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
                            {result.type === 'bill' && result.status && (
                              <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.status === "paid" 
                                  ? "bg-green-500/20 text-green-400"
                                  : result.status === "partial"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-pink-500/20 text-pink-400"
                              }`}>
                                {result.status === "paid" ? "Paid" : result.status === "partial" ? "Partial" : "Active"}
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
            <div class="notification-dropdown absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
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
                {props.notifications().length === 0 ? (
                  <div class="p-6 text-center text-gray-400">
                    <Bell class="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div class="p-2">
                    <For each={props.notifications()}>
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
              
              {props.notifications().length > 0 && (
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
          class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg text-sm sm:text-base whitespace-nowrap"
          onClick={() => navigate("/addsplitbill")}
        >
          <span class="hidden sm:inline">+ Add Bill</span>
          <Plus class="w-5 h-5 sm:hidden" />
        </button>
      </div>
    </header>
  );
}