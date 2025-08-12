import { createSignal, onMount } from "solid-js";
import { UserPlus, Mail, Phone, ArrowLeft, Check, AlertCircle, Sparkles } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
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

export default function AddFriendPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  
  // Form state
  const [formData, setFormData] = createSignal<FormData>({
    name: "",
    email: "",
    phone: ""
  });
  
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [errors, setErrors] = createSignal<FormErrors>({});

  // Header data
  const [notifications, setNotifications] = createSignal<Notification[]>([]);
  const [searchData, setSearchData] = createSignal<SearchResult[]>([]);

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);

    // Load notifications and search data
    loadNotifications();
    loadSearchData();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSearchData = () => {
    try {
      // Load friends for search
      const friends = JSON.parse(localStorage.getItem('split_bills_friends') || '[]');
      const friendResults: SearchResult[] = friends.map((friend: Friend) => ({
        type: 'friend',
        title: friend.name,
        subtitle: friend.email,
        status: friend.status === 'owes_you' ? 'Owes You' : friend.status === 'you_owe' ? 'You Owe' : 'Settled',
        id: friend.id
      }));

      // Load bills for search (if you have bills data)
      // const bills = JSON.parse(localStorage.getItem('split_bills') || '[]');
      // const billResults = bills.map(bill => ({ ... }));

      setSearchData([...friendResults]);
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors()[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const data = formData();
    
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Check if friend already exists
    try {
      const existingFriends = JSON.parse(localStorage.getItem('split_bills_friends') || '[]') as Friend[];
      const emailExists = existingFriends.some(friend => friend.email.toLowerCase() === data.email.toLowerCase());
      if (emailExists) {
        newErrors.email = "A friend with this email already exists";
      }
    } catch (error) {
      console.error('Error checking existing friends:', error);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const saveFriendToLocalStorage = (friendData: FormData) => {
    try {
      // Get existing friends
      const existingFriends = JSON.parse(localStorage.getItem('split_bills_friends') || '[]') as Friend[];
      
      // Create new friend object
      const newFriend: Friend = {
        id: generateId(),
        name: friendData.name.trim(),
        email: friendData.email.trim().toLowerCase(),
        phone: friendData.phone.trim() || undefined,
        balance: 0, // Start with 0 balance
        status: "settled",
        addedDate: new Date().toISOString()
      };
      
      // Add to existing friends
      const updatedFriends = [...existingFriends, newFriend];
      
      // Save to localStorage
      localStorage.setItem('split_bills_friends', JSON.stringify(updatedFriends));
      
      // Create welcome activity
      const existingActivities = JSON.parse(localStorage.getItem('split_bills_activities') || '[]') as Activity[];
      const welcomeActivity: Activity = {
        id: generateId(),
        friendId: newFriend.id,
        friendName: newFriend.name,
        action: "settled",
        amount: 0,
        description: `Added ${newFriend.name} as a friend`,
        date: new Date().toISOString()
      };
      
      const updatedActivities = [welcomeActivity, ...existingActivities];
      localStorage.setItem('split_bills_activities', JSON.stringify(updatedActivities));
      
      return true;
    } catch (error) {
      console.error('Error saving friend to localStorage:', error);
      return false;
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = saveFriendToLocalStorage(formData());
      
      setIsSubmitting(false);
      
      if (success) {
        setShowSuccess(true);
        
        // Reset form
        setFormData({ name: "", email: "", phone: "" });
        
        // Hide success message and navigate back
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/friends");
        }, 2000);
      } else {
        // Handle error case
        setErrors({ email: "Failed to add friend. Please try again." });
      }
    }, 1500);
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
          title="Add Friend"
          subtitle="Add a new friend to split bills with"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Back Button */}
        <div class="flex justify-start">
          <button 
            onClick={() => navigate("/friends")}
            class="flex items-center gap-2 text-gray-400 hover:text-pink-200 transition-all duration-300"
          >
            <ArrowLeft class="w-4 h-4" />
            Back to Friends
          </button>
        </div>

        {/* Success Message */}
        {showSuccess() && (
          <div class="fixed top-4 right-4 z-50 bg-emerald-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-xl animate-pulse">
            <Check class="w-5 h-5" />
            <span class="font-medium">Friend added successfully!</span>
          </div>
        )}

        {/* Add Friend Form */}
        <div class={`max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
          <div class="flex items-center gap-3 mb-8">
            <div class="p-3 bg-pink-500/20 rounded-xl">
              <UserPlus class="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Friend Information</h2>
              <p class="text-gray-400">Fill in the details to add a new friend</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Name Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <div class="relative">
                <input
                  type="text"
                  value={formData().name}
                  onInput={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().name ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's full name"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <UserPlus class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().name && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <div class="relative">
                <input
                  type="email"
                  value={formData().email}
                  onInput={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().email ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's email address"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().email && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <div class="relative">
                <input
                  type="tel"
                  value={formData().phone}
                  onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                  class={`w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 ${
                    errors().phone ? 'border-red-500' : 'border-gray-700/50 focus:border-pink-400'
                  }`}
                  placeholder="Enter friend's phone number"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Phone class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors().phone && (
                <div class="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  {errors().phone}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div class="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/friends")}
                class="flex-1 px-6 py-3 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/60 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting()}
                class={`flex-1 px-6 py-3 bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 font-bold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                  isSubmitting() ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting() ? (
                  <>
                    <div class="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                    Adding Friend...
                  </>
                ) : (
                  <>
                    <UserPlus class="w-5 h-5" />
                    Add Friend
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div class={`max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-1000 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-amber-500/20 rounded-xl">
              <Sparkles class="w-5 h-5 text-amber-400" />
            </div>
            <h3 class="text-lg font-semibold text-white">Tips for Adding Friends</h3>
          </div>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Make sure the email address is correct - your friend will receive notifications here</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Phone numbers are optional but helpful for easier contact</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Once added, you can start splitting bills with this friend immediately</span>
            </li>
            <li class="flex items-start gap-2">
              <div class="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Duplicate email addresses are not allowed - each friend must have a unique email</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}