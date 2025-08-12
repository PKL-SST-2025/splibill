// src/pages/PayBillPage.tsx

import { createSignal, onMount, For, createEffect } from "solid-js";
import { DollarSign, Clock, Heart, TrendingUp, ArrowUp, ArrowDown, CreditCard, Wallet, Users, UserPlus, Calendar, Bell, Search, ChevronLeft, ChevronRight, Menu, X, Sparkles, Plus, LogOut, CheckCircle, AlertCircle, Settings, User, FileText, Receipt, Trash2 } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

interface Bill {
  id: number;
  title: string;
  amount: number;
  totalAmount: number; // Store original total amount
  status: string;
  group: string;
  date: string;
  dueDate: string;
  icon: any;
  description?: string;
  participants?: number;
  category?: string;
  splitType?: string;
  createdAt?: string;
}

interface Payment {
  id: number;
  title: string;
  amount: number;
  totalAmount: number; // Store original total amount
  status: string;
  group: string;
  date: string;
  icon: any;
}

interface SplitBill {
  date: string;
  total: number;
  description: string;
  participants: number;
  category?: string;
  splitType?: string;
  createdAt?: string;
  status?: 'active' | 'paid' | 'partial'; // Add status field
  paidDate?: string; // When it was paid
  paidAmount?: number; // How much was paid
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

export default function PayBillPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Dynamic data from localStorage
  const [billsToPay, setBillsToPay] = createSignal<Bill[]>([]);
  const [recentPayments, setRecentPayments] = createSignal<Payment[]>([]);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);

  // Search data for Header component
  const searchData = () => {
    const billData: SearchResult[] = billsToPay().map(bill => ({
      type: 'bill',
      title: bill.title,
      subtitle: `Rp ${bill.amount.toLocaleString()} - ${bill.group}`,
      date: bill.date,
      status: bill.status,
      id: bill.id.toString()
    }));

    const paymentData: SearchResult[] = recentPayments().map(payment => ({
      type: 'payment',
      title: payment.title,
      subtitle: `Rp ${payment.amount.toLocaleString()} - ${payment.group}`,
      date: payment.date,
      status: payment.status,
      id: payment.id.toString()
    }));

    return [...billData, ...paymentData];
  };

  // Load data from localStorage
  const loadDataFromStorage = () => {
    try {
      // Load split bills and convert them to bills to pay (only show active bills)
      const storedBills = localStorage.getItem('splitBills');
      if (storedBills) {
        const splitBills: SplitBill[] = JSON.parse(storedBills);
        
        // Convert split bills to bills format with per-person amount
        // Only show bills that are not paid yet
        const convertedBills: Bill[] = splitBills
          .filter(bill => bill.status !== 'paid') // Only show unpaid bills
          .map((bill, index) => {
            const perPersonAmount = Math.round(bill.total / bill.participants);
            
            return {
              id: index + 1,
              title: bill.description,
              amount: perPersonAmount, // This is now per-person amount
              totalAmount: bill.total, // Store original total
              status: bill.status || "pending",
              group: `${bill.participants} people`,
              date: bill.date,
              dueDate: bill.date, // You can modify this to add days if needed
              icon: DollarSign,
              description: bill.description,
              participants: bill.participants,
              category: bill.category,
              splitType: bill.splitType,
              createdAt: bill.createdAt
            };
          });
        
        setBillsToPay(convertedBills);
      }

      // Load recent payments
      const storedPayments = localStorage.getItem('recentPayments');
      if (storedPayments) {
        setRecentPayments(JSON.parse(storedPayments));
      }

      // Load notifications
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };

  // Helper function to create notification
  const createNotification = (type: string, title: string, message: string, icon = 'info') => {
    const notification = {
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
    
    // Get existing notifications from localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    // Add new notification at the beginning
    const updatedNotifications = [notification, ...existingNotifications];
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Update local state
    setNotifications(updatedNotifications);
    
    return notification;
  };

  // Delete bill function
  const deleteBill = (billIndex: number) => {
    const bill = billsToPay()[billIndex];
    const confirmMessage = `Are you sure you want to delete "${bill.title}"?\nYour share: Rp ${bill.amount.toLocaleString()}\nTotal bill: Rp ${bill.totalAmount.toLocaleString()}\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      // Remove from bills to pay (update local state)
      const updatedBills = billsToPay().filter((_, index) => index !== billIndex);
      setBillsToPay(updatedBills);
      
      // Also remove from splitBills in localStorage completely
      try {
        const storedBills = localStorage.getItem('splitBills');
        if (storedBills) {
          const splitBills = JSON.parse(storedBills);
          // Find the corresponding bill by matching description and amount
          const billToDelete = bill;
          const updatedSplitBills = splitBills.filter((splitBill: SplitBill) => 
            !(splitBill.description === billToDelete.title && splitBill.total === billToDelete.totalAmount)
          );
          localStorage.setItem('splitBills', JSON.stringify(updatedSplitBills));
        }
        
        // Add notification for deleted bill
        createNotification(
          'info',
          'Bill Deleted',
          `"${bill.title}" has been deleted successfully`,
          'info'
        );
        
        console.log('Bill deleted successfully');
      } catch (error) {
        console.error('Error saving updated bills to localStorage:', error);
        alert('Error deleting bill. Please try again.');
      }
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
    
    // Load data from localStorage
    loadDataFromStorage();
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    // Reload data when page is focused (to detect changes from other pages)
    const handleFocus = () => {
      loadDataFromStorage();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('focus', handleFocus);
    };
  });

  // Reload data when component mounts or when localStorage changes
  createEffect(() => {
    const interval = setInterval(() => {
      loadDataFromStorage();
    }, 1000); // Check every second for changes

    return () => clearInterval(interval);
  });

  // FIXED: Updated handlePay function to mark bill as paid instead of deleting
  const handlePay = (billId: number) => {
    const currentBills = billsToPay();
    const billIndex = currentBills.findIndex(b => b.id === billId);
    const bill = currentBills[billIndex];
    
    if (!bill) {
      console.error('Bill not found!');
      return;
    }

    if (confirm(`Are you sure you want to pay your share of "${bill.title}"?\nYour share: Rp ${bill.amount.toLocaleString()}\nTotal bill: Rp ${bill.totalAmount.toLocaleString()}`)) {
      try {
        // Create payment record with per-person amount
        const payment: Payment = {
          id: Date.now(),
          title: bill.title,
          amount: bill.amount, // Per-person amount
          totalAmount: bill.totalAmount, // Original total
          status: "paid",
          group: bill.group,
          date: new Date().toISOString().split('T')[0],
          icon: CheckCircle
        };

        // Update recent payments (add to beginning)
        const currentPayments = recentPayments();
        const updatedPayments = [payment, ...currentPayments];
        setRecentPayments(updatedPayments);
        localStorage.setItem('recentPayments', JSON.stringify(updatedPayments));

        // Remove from bills to pay (update local state immediately)
        const updatedBills = currentBills.filter(b => b.id !== billId);
        setBillsToPay(updatedBills);

        // FIXED: Update splitBills in localStorage to mark as paid instead of deleting
        const storedBills = localStorage.getItem('splitBills');
        if (storedBills) {
          const splitBills: SplitBill[] = JSON.parse(storedBills);
          
          // Find the corresponding bill by matching description and total amount
          const updatedSplitBills = splitBills.map((splitBill: SplitBill) => {
            if (splitBill.description === bill.title && splitBill.total === bill.totalAmount) {
              return {
                ...splitBill,
                status: 'paid' as const,
                paidDate: new Date().toISOString().split('T')[0],
                paidAmount: bill.totalAmount // Mark full bill as paid
              };
            }
            return splitBill;
          });
          
          localStorage.setItem('splitBills', JSON.stringify(updatedSplitBills));
        }

        // Create notification for payment
        createNotification(
          'payment',
          'Payment Completed',
          `Successfully paid your share of "${bill.title}" for Rp ${bill.amount.toLocaleString()}`,
          'check'
        );

        // Success message
        alert(`Payment processed successfully!\nPaid: Rp ${bill.amount.toLocaleString()} (your share)\nBill: ${bill.title}`);
        
        console.log('Payment completed successfully:', {
          billPaid: bill.title,
          yourShare: bill.amount,
          totalBill: bill.totalAmount,
          totalBillsRemaining: updatedBills.length,
          totalUnpaidAmount: updatedBills.reduce((sum, b) => sum + b.amount, 0)
        });

      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment. Please try again.');
      }
    }
  };

  // Calculate totals (these will automatically update when billsToPay changes)
  const totalUnpaid = () => billsToPay().reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = () => recentPayments().reduce((sum, payment) => sum + payment.amount, 0);
  const totalBills = () => billsToPay().length;

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'food': return DollarSign;
      case 'transport': return CreditCard;
      case 'entertainment': return Heart;
      case 'shopping': return Wallet;
      case 'utilities': return Receipt;
      default: return DollarSign;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'food': return 'from-orange-400/20 to-orange-500/20 text-orange-400';
      case 'transport': return 'from-blue-400/20 to-blue-500/20 text-blue-400';
      case 'entertainment': return 'from-purple-400/20 to-purple-500/20 text-purple-400';
      case 'shopping': return 'from-green-400/20 to-green-500/20 text-green-400';
      case 'utilities': return 'from-yellow-400/20 to-yellow-500/20 text-yellow-400';
      default: return 'from-pink-200/10 to-pink-200/20 text-pink-200';
    }
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
          title="Pay Your Bills"
          subtitle="Review and complete your share of payments"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Payment Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-red-500/20 rounded-xl">
                <AlertCircle class="w-6 h-6 text-red-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-red-400" />
                <span class="text-red-400 text-sm font-medium">{totalBills()} bills</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalUnpaid().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Your Share to Pay</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowUp class="w-4 h-4 text-emerald-400" />
                <span class="text-emerald-400 text-sm font-medium">+{recentPayments().length}</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">Rp {totalPaid().toLocaleString()}</h3>
            <p class="text-gray-400 text-sm">Your Paid Shares</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <Clock class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1">
                <ArrowDown class="w-4 h-4 text-purple-400" />
                <span class="text-purple-400 text-sm font-medium">Due soon</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{billsToPay().filter(bill => {
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7 && diffDays >= 0;
            }).length}</h3>
            <p class="text-gray-400 text-sm">Bills Due Soon</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bills to Pay - Dynamic from localStorage with per-person amounts */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 flex flex-col overflow-hidden ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/40">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-red-500/20 rounded-xl">
                  <AlertCircle class="w-5 h-5 text-red-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Your Bills to Pay</h2>
              </div>
              <div class="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {totalBills()} pending
              </div>
            </div>
            
            {billsToPay().length > 0 ? (
              <div class="flex-1 relative">
                <div class="h-96 overflow-hidden relative">
                  <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-6 py-4">
                    <div class="space-y-3">
                      <For each={billsToPay()}>
                        {(bill: Bill, index) => {
                          const IconComponent = getCategoryIcon(bill.category);
                          return (
                            <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/20 to-gray-800/40 rounded-xl border border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-pink-200/20 transition-all duration-300 group backdrop-blur-sm">
                              <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(bill.category)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                  <IconComponent class="w-5 h-5" />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="font-medium text-white group-hover:text-pink-100 transition-colors duration-300 truncate">{bill.title}</p>
                                  <p class="text-sm text-gray-400">{bill.date} • {bill.group}</p>
                                  {bill.category && (
                                    <p class="text-xs text-gray-500 capitalize">{bill.category}</p>
                                  )}
                                </div>
                              </div>
                              <div class="flex items-center gap-3 flex-shrink-0">
                                <div class="text-right">
                                  <p class="font-bold text-pink-200">Rp {bill.amount.toLocaleString()}</p>
                                  <p class="text-xs text-gray-500">Your share</p>
                                  <p class="text-xs text-gray-600">Total: Rp {bill.totalAmount.toLocaleString()}</p>
                                </div>
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={(e: Event) => {
                                      e.stopPropagation();
                                      handlePay(bill.id);
                                    }}
                                    class="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-lg transition-all duration-200 border border-emerald-500/20 hover:border-emerald-500/40 text-sm font-medium"
                                  >
                                    Pay
                                  </button>
                                  <button
                                    onClick={(e: Event) => {
                                      e.stopPropagation();
                                      deleteBill(index());
                                    }}
                                    class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                    title="Delete bill"
                                  >
                                    <Trash2 class="w-4 h-4" />
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
                  <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div class="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div class="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <FileText class="w-10 h-10 text-gray-500" />
                </div>
                <h3 class="text-lg font-semibold text-gray-300 mb-2">No Bills to Pay</h3>
                <p class="text-gray-500 text-sm mb-6 max-w-xs">
                  You don't have any outstanding bills at the moment. Create a new split bill to get started.
                </p>
                <button
                  class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
                  onClick={() => navigate("/addsplitbill")}
                >
                  + Create Split Bill
                </button>
              </div>
            )}
          </div>

          {/* Recent Payments - Dynamic from localStorage with per-person amounts */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 flex flex-col overflow-hidden ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1000ms">
            <div class="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/40">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-500/20 rounded-xl">
                  <CheckCircle class="w-5 h-5 text-emerald-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Your Recent Payments</h2>
              </div>
              <div class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                {recentPayments().length} completed
              </div>
            </div>
            
            {recentPayments().length > 0 ? (
              <div class="flex-1 relative">
                <div class="h-96 overflow-hidden relative">
                  <div class="h-full overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-pink-200/30 scrollbar-track-transparent px-6 py-4">
                    <div class="space-y-3">
                      <For each={recentPayments()}>
                        {(payment: Payment) => (
                          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/20 to-gray-800/40 rounded-xl border border-gray-700/20 hover:from-gray-800/40 hover:to-gray-800/60 hover:border-emerald-400/20 transition-all duration-300 group backdrop-blur-sm">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                <CheckCircle class="w-5 h-5 text-emerald-400" />
                              </div>
                              <div class="flex-1 min-w-0">
                                <p class="font-medium text-white group-hover:text-emerald-100 transition-colors duration-300 truncate">{payment.title}</p>
                                <p class="text-sm text-gray-400">{payment.date} • {payment.group}</p>
                              </div>
                            </div>
                            <div class="flex items-center gap-3 flex-shrink-0">
                              <div class="text-right">
                                <p class="font-bold text-emerald-400">Rp {payment.amount.toLocaleString()}</p>
                                <p class="text-xs text-emerald-500/70">Paid (your share)</p>
                                <p class="text-xs text-gray-600">Total: Rp {payment.totalAmount.toLocaleString()}</p>
                              </div>
                              <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle class="w-4 h-4 text-emerald-400" />
                              </div>
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
              <div class="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div class="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <Receipt class="w-10 h-10 text-gray-500" />
                </div>
                <h3 class="text-lg font-semibold text-gray-300 mb-2">No Recent Payments</h3>
                <p class="text-gray-500 text-sm mb-6 max-w-xs">
                  Your payment history will appear here once you start making payments.
                </p>
                <button
                  class="bg-gray-700/50 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed"
                  disabled
                >
                  No Payments Yet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div class={`bg-gray-900/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1200ms">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-500/20 rounded-xl flex-shrink-0">
              <CreditCard class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white mb-2">Payment Instructions</h4>
              <div class="space-y-2 text-gray-300">
                <p>• Bills show your individual share from split expenses, not the total amount</p>
                <p>• Click "Pay" to mark your share as paid - the bill will remain in Dashboard with "Paid" status</p>
                <p>• Total bill amount is shown for reference under "Your share"</p>
                <p>• You can delete bills using the trash icon if they're no longer needed</p>
                <p>• Payment history tracks your individual share payments</p>
                <p>• All actions will create notifications to keep you informed</p>
                <p>• Paid bills will appear in Dashboard's Recent Activities with green "Paid" status</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}