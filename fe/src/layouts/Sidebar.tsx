import { createSignal, onMount, onCleanup } from "solid-js";
import { Sparkles, TrendingUp, Plus, CreditCard, Users, UserPlus, User, Settings, LogOut, Menu, X } from "lucide-solid";
import { A, useNavigate, useLocation } from "@solidjs/router";

interface SidebarProps {
  isOpen: () => boolean;
  setIsOpen: (value: boolean) => void;
  isMobile: () => boolean;
}

export default function Sidebar(props: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  let sidebarRef: HTMLElement | undefined;
  let timeoutId: number | undefined;

  // Function to check if current route matches the given path
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Function to get button classes based on active state
  const getButtonClasses = (path: string) => {
    const baseClasses = `w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      !props.isOpen() ? 'justify-center' : ''
    }`;
    
    if (isActiveRoute(path)) {
      return `${baseClasses} bg-pink-200/10 border border-pink-200/20 text-pink-200 hover:bg-pink-200/20`;
    } else {
      return `${baseClasses} text-gray-300 hover:bg-gray-800/50 hover:text-pink-200`;
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    props.setIsOpen(!props.isOpen());
  };

  const closeSidebarOnMobile = () => {
    if (props.isMobile()) {
      props.setIsOpen(false);
    }
  };

  // Auto-expand on hover for desktop
  const handleMouseEnter = () => {
    if (!props.isMobile()) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (!props.isOpen()) {
        props.setIsOpen(true);
      }
    }
  };

  // Auto-collapse on mouse leave for desktop
  const handleMouseLeave = () => {
    if (!props.isMobile()) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Delay collapse to prevent flickering
      timeoutId = window.setTimeout(() => {
        props.setIsOpen(false);
      }, 300); // 300ms delay
    }
  };

  // Cleanup timeout on unmount
  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        class="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-300 shadow-lg"
      >
        {props.isOpen() ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        class={`fixed lg:relative bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col transition-all duration-300 z-40 ${
          props.isMobile() 
            ? `w-80 h-screen ${props.isOpen() ? 'translate-x-0' : '-translate-x-full'}`
            : `${props.isOpen() ? 'w-80' : 'w-20'} min-h-screen`
        }`}
      >
        {/* Header */}
        <div class="p-6 border-b border-gray-700/50 flex-shrink-0">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles class="w-6 h-6 text-gray-800" />
            </div>
            <div class={`transition-all duration-300 overflow-hidden ${
              props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
            }`}>
              <h2 class="text-xl font-bold whitespace-nowrap">Split Bills</h2>
              <p class="text-gray-400 text-sm whitespace-nowrap">Manage your expenses</p>
            </div>
          </div>
        </div>

        {/* Navigation - with flex-1 and min-h-0 for proper scrolling */}
        <nav class="flex-1 min-h-0 p-6 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/dashboard");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/dashboard")}
            >
              <Sparkles class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Dashboard</span>
            </button>

            {/* Tooltip for collapsed state - only show when sidebar is collapsed and not mobile */}
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Dashboard
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Finance */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/finance");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/finance")}
            >
              <TrendingUp class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Finance</span>
            </button>
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Finance
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Add Split Bill */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/addsplitbill");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/addsplitbill")}
            >
              <Plus class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Add Split Bill</span>
            </button>
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Add Split Bill
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Pay Bill */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/paybill");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/paybill")}
            >
              <CreditCard class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Pay Bill</span>
            </button>
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Pay Bill
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Friends */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/friends");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/friends")}
            >
              <Users class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Friends</span>
            </button>
           
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Friends
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Add Friend */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/addfriend");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/addfriend")}
            >
              <UserPlus class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Add Friend</span>
            </button>
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Add Friend
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Account */}
          <div class="relative group">
            <button 
              onClick={() => {
                navigate("/account");
                closeSidebarOnMobile();
              }} 
              class={getButtonClasses("/account")}
            >
              <User class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Account</span>
            </button>
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Account
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>

          {/* Account Settings - Submenu */}
          <div class={`relative group transition-all duration-300 overflow-hidden ${
            props.isOpen() ? 'ml-4 opacity-100 max-h-20' : 'opacity-0 max-h-0'
          }`}>
            <button 
              onClick={() => {
                navigate("/accountsettings");
                closeSidebarOnMobile();
              }} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                !props.isOpen() ? 'justify-center' : ''
              } ${
                isActiveRoute("/accountsettings")
                  ? 'bg-pink-200/10 border border-pink-200/20 text-pink-200 hover:bg-pink-200/20'
                  : 'text-gray-400 hover:bg-gray-800/30 hover:text-pink-200'
              }`}
            >
              <Settings class="w-4 h-4 flex-shrink-0" />
              <span class={`font-medium text-sm transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Account Settings</span>
            </button>
          </div>

          {/* Add some padding at the bottom to ensure logout button is always visible on mobile */}
          {props.isMobile() && <div class="h-24" />}
        </nav>

        {/* Logout Button - Always visible at bottom */}
        <div class="p-6 border-t border-gray-700/50 flex-shrink-0 bg-gray-900/95 backdrop-blur-xl">
          <div class="relative group">
            <button 
              onClick={handleLogout} 
              class={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 ${
                !props.isOpen() ? 'justify-center' : ''
              }`}
            >
              <LogOut class="w-5 h-5 flex-shrink-0" />
              <span class={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                props.isOpen() ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}>Log Out</span>
            </button>
            {/* Tooltip untuk collapsed state */}
            {!props.isOpen() && !props.isMobile() && (
              <div class="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                Log Out
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {props.isOpen() && props.isMobile() && (
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => props.setIsOpen(false)}
        />
      )}
    </>
  );
}