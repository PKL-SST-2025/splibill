import { createSignal, onMount, For } from "solid-js";
import { DollarSign, Clock, TrendingUp, ArrowUp, ArrowDown, Users, Receipt } from "lucide-solid";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

// Type definitions
interface MonthlySpending {
  month: string;
  amount: number;
  category: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'settled' | 'pending';
  category: string;
  participants: string[];
}

interface PendingPayment {
  id: string;
  from: string;
  description: string;
  amount: number;
  dueDate: string;
  avatar: string;
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

interface StoredBill {
  date: string;
  total: number;
  description: string;
  participants: number;
  category: string;
  splitType: string;
  createdAt: string;
}

interface StoredFriend {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  status: string;
  addedDate: string;
}

export default function FinancePage() {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Data signals that will be populated from localStorage
  const [monthlySpending, setMonthlySpending] = createSignal<MonthlySpending[]>([]);
  const [recentTransactions, setRecentTransactions] = createSignal<Transaction[]>([]);
  const [pendingPayments, setPendingPayments] = createSignal<PendingPayment[]>([]);
  
  // Sample data for search and notifications
  const [searchData] = createSignal<SearchResult[]>([
    {
      type: 'bill',
      title: 'Dinner at Restaurant',
      subtitle: 'Rp 150,000 • 3 participants',
      date: '2024-01-15',
      status: 'active',
      id: 'bill-1'
    },
    {
      type: 'friend',
      title: 'John Doe',
      subtitle: 'Owes you Rp 50,000',
      status: 'Pending',
      id: 'friend-1'
    }
  ]);

  const [notifications, setNotifications] = createSignal<Notification[]>([
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'John paid Rp 50,000 for dinner bill',
      time: '2 hours ago',
      read: false,
      icon: 'check'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Payment Reminder',
      message: 'Movie ticket bill is due in 2 days',
      time: '1 day ago',
      read: false,
      icon: 'alert'
    }
  ]);

  // Load data from localStorage
  const loadFinanceData = () => {
    try {
      // Load split bills
      const storedBills = localStorage.getItem('splitBills');
      if (storedBills) {
        const bills: StoredBill[] = JSON.parse(storedBills);
        
        // Process bills into monthly spending data
        const monthlyData = new Map<string, { amount: number; category: string }>();
        
        bills.forEach(bill => {
          const date = new Date(bill.date);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlyData.has(monthKey)) {
            const existing = monthlyData.get(monthKey)!;
            monthlyData.set(monthKey, {
              amount: existing.amount + bill.total,
              category: existing.category // Keep first category or could be "Mixed"
            });
          } else {
            monthlyData.set(monthKey, {
              amount: bill.total,
              category: bill.category.charAt(0).toUpperCase() + bill.category.slice(1)
            });
          }
        });
        
        // Convert to array and sort by date
        const monthlySpendingData: MonthlySpending[] = Array.from(monthlyData.entries())
          .map(([month, data]) => ({
            month,
            amount: data.amount,
            category: data.category
          }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
          .slice(-6); // Get last 6 months
        
        setMonthlySpending(monthlySpendingData);
        
        // Convert bills to recent transactions
        const transactions: Transaction[] = bills
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10) // Get 10 most recent
          .map((bill, index) => ({
            id: `trans-${index}`,
            description: bill.description,
            amount: bill.total,
            date: new Date(bill.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            status: 'settled' as const,
            category: bill.category.charAt(0).toUpperCase() + bill.category.slice(1),
            participants: Array.from({ length: bill.participants }, (_, i) => `Friend ${i + 1}`)
          }));
        
        setRecentTransactions(transactions);
      }
      
      // Load friends with outstanding balances
      const storedFriends = localStorage.getItem('split_bills_friends');
      if (storedFriends) {
        const friends: StoredFriend[] = JSON.parse(storedFriends);
        
        // Filter friends who owe money and convert to pending payments
        const pendingPaymentsData: PendingPayment[] = friends
          .filter(friend => friend.balance > 0 && friend.status === 'owes_you')
          .map((friend, index) => ({
            id: `pending-${index}`,
            from: friend.name,
            description: `Outstanding balance`,
            amount: friend.balance,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            avatar: friend.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
          }));
        
        setPendingPayments(pendingPaymentsData);
      }
      
    } catch (error) {
      console.error('Error loading finance data:', error);
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
    
    // Load finance data from localStorage
    loadFinanceData();
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    // Refresh data periodically (in case user navigates back from other pages)
    const refreshInterval = setInterval(loadFinanceData, 5000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(refreshInterval);
    };
  });

  // Calculate financial metrics - will return actual values now
  const totalExpenses = () => monthlySpending().reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = () => pendingPayments().reduce((sum, payment) => sum + payment.amount, 0);
  const settledAmount = () => recentTransactions()
    .filter(t => t.status === "settled")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

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
          title="Finance Dashboard"
          subtitle="Monitor your spending patterns and financial health"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Financial Summary Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign class="w-6 h-6 text-emerald-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <ArrowUp class="w-4 h-4" />
                <span class="text-sm font-medium">
                  {recentTransactions().length > 0 ? `${recentTransactions().length} bills` : '--'}
                </span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(settledAmount())}</h3>
            <p class="text-gray-400 text-sm">Total Settled</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-amber-500/20 rounded-xl">
                <Clock class="w-6 h-6 text-amber-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <ArrowDown class="w-4 h-4" />
                <span class="text-sm font-medium">{pendingPayments().length} items</span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(pendingAmount())}</h3>
            <p class="text-gray-400 text-sm">Pending Payments</p>
          </div>

          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-105 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp class="w-6 h-6 text-purple-400" />
              </div>
              <div class="flex items-center gap-1 text-gray-500">
                <TrendingUp class="w-4 h-4" />
                <span class="text-sm font-medium">
                  {monthlySpending().length > 0 ? `${monthlySpending().length} months` : '--'}
                </span>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white">{formatCurrency(totalExpenses())}</h3>
            <p class="text-gray-400 text-sm">Monthly Spending</p>
          </div>
        </div>

        {/* Spending Chart */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp class="w-5 h-5 text-pink-200" />
              Monthly Spending Trends
            </h2>
            <button 
              onClick={loadFinanceData}
              class="px-3 py-1 text-sm bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
            >
              Refresh
            </button>
          </div>
          {monthlySpending().length === 0 ? (
            <div class="flex items-center justify-center h-32 text-gray-500">
              <div class="text-center">
                <TrendingUp class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p>No spending data available</p>
                <p class="text-sm">Create some split bills to see your trends</p>
              </div>
            </div>
          ) : (
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <For each={monthlySpending()}>
                {(item, index) => (
                  <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                    <div class="text-center">
                      <div class="text-pink-200 font-semibold text-sm mb-1">{item.month}</div>
                      <div class="text-white text-lg font-bold mb-2">
                        {formatCurrency(item.amount).replace('Rp ', 'Rp')}
                      </div>
                      <div class="text-gray-400 text-xs">{item.category}</div>
                      <div class="mt-2 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div 
                          class="h-full bg-gradient-to-r from-pink-200 to-pink-300 rounded-full transition-all duration-1000"
                          style={{width: `${(item.amount / Math.max(...monthlySpending().map(s => s.amount))) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Payments */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1000ms">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-amber-500/20 rounded-xl">
                  <Users class="w-5 h-5 text-amber-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Pending Payments</h2>
              </div>
              <div class="text-sm text-gray-400">
                {pendingPayments().length} payments
              </div>
            </div>
            
            {pendingPayments().length === 0 ? (
              <div class="flex items-center justify-center h-40 text-gray-500">
                <div class="text-center">
                  <Clock class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No pending payments</p>
                  <p class="text-sm">All your bills are up to date!</p>
                </div>
              </div>
            ) : (
              <div class="max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <For each={pendingPayments()}>
                  {(payment) => (
                    <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {payment.avatar}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{payment.from}</h3>
                            <p class="text-gray-400 text-sm">{payment.description}</p>
                            <p class="text-amber-400 text-xs">Due: {payment.dueDate}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-white font-bold">{formatCurrency(payment.amount)}</div>
                          <button class="text-amber-400 hover:text-amber-300 text-sm mt-1 hover:underline transition-colors">
                            Remind
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 1200ms">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-emerald-500/20 rounded-xl">
                  <Receipt class="w-5 h-5 text-emerald-400" />
                </div>
                <h2 class="text-xl font-bold text-white">Recent Transactions</h2>
              </div>
              <div class="text-sm text-gray-400">
                {recentTransactions().length} transactions
              </div>
            </div>
            
            {recentTransactions().length === 0 ? (
              <div class="flex items-center justify-center h-40 text-gray-500">
                <div class="text-center">
                  <Receipt class="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No recent transactions</p>
                  <p class="text-sm">Start splitting bills to see your activity</p>
                </div>
              </div>
            ) : (
              <div class="max-h-80 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50">
                <For each={recentTransactions()}>
                  {(transaction) => (
                    <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all duration-300">
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                          <div class={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.category === 'Food' ? 'bg-orange-500/20' :
                            transaction.category === 'Entertainment' ? 'bg-purple-500/20' :
                            transaction.category === 'Shopping' ? 'bg-blue-500/20' :
                            transaction.category === 'Transport' ? 'bg-green-500/20' :
                            transaction.category === 'Utilities' ? 'bg-red-500/20' :
                            'bg-gray-500/20'
                          }`}>
                            {transaction.category === 'Food' ? '🍕' :
                             transaction.category === 'Entertainment' ? '🎬' :
                             transaction.category === 'Shopping' ? '🛍️' :
                             transaction.category === 'Transport' ? '🚗' :
                             transaction.category === 'Utilities' ? '⚡' :
                             '📄'}
                          </div>
                          <div>
                            <h3 class="text-white font-medium">{transaction.description}</h3>
                            <p class="text-gray-400 text-sm">{transaction.date}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-white font-bold">{formatCurrency(transaction.amount)}</div>
                          <div class={`text-xs px-2 py-1 rounded-full mt-1 ${
                            transaction.status === 'settled' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {transaction.status}
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <For each={transaction.participants}>
                          {(participant) => (
                            <span class="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                              {participant}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}