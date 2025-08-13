import { createSignal, onMount } from "solid-js";
import { User, Lock, Save, X, Settings, Eye, EyeOff, Shield, Globe, Smartphone, Camera } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import Header from "../layouts/Header"; // Import your existing Header component
import Sidebar from "../layouts/Sidebar"; // Import your existing Sidebar component

export default function AccountSettings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);
  const [isMobile, setIsMobile] = createSignal(false);
  const [animate, setAnimate] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("profile");

  // Current user data
  const [currentUser, setCurrentUser] = createSignal(null);
  const [userEmail, setUserEmail] = createSignal("");
  
  // Form states - initialized with current user data
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [country, setCountry] = createSignal("Indonesia");
  const [bio, setBio] = createSignal("");

  // Password states
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showCurrentPassword, setShowCurrentPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

  // Notifications and alerts
  const [saveMessage, setSaveMessage] = createSignal("");
  const [saveMessageType, setSaveMessageType] = createSignal("success"); // success, error, warning
  const [showSaveMessage, setShowSaveMessage] = createSignal(false);

  // Header props - Search data and notifications
  const [notifications, setNotifications] = createSignal([
    {
      id: 1,
      type: "info",
      title: "Account Settings",
      message: "Your account settings have been updated successfully.",
      time: "5 minutes ago",
      read: false,
      icon: "user"
    },
    {
      id: 2,
      type: "security",
      title: "Security Alert",
      message: "New login detected from Chrome on MacBook.",
      time: "1 hour ago",
      read: false,
      icon: "alert"
    }
  ]);

  const searchData = () => [
    {
      type: "setting",
      title: "Change Password",
      subtitle: "Update your account password",
      id: "change-password"
    },
    {
      type: "setting",
      title: "Privacy Settings",
      subtitle: "Manage your privacy preferences",
      id: "privacy"
    },
    {
      type: "setting",
      title: "Profile Information",
      subtitle: "Edit your personal details",
      id: "profile"
    }
  ];

  // Password hashing function
  const hashPassword = async (password: string | undefined) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Get current logged-in user
  const getCurrentUser = () => {
    try {
      // Try session storage first
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      // Fallback to localStorage for remembered users
      const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        return JSON.parse(rememberedUser);
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Get user account data from registered accounts
  const getUserAccountData = (email: string) => {
    try {
      const registeredAccounts = localStorage.getItem('registeredAccounts');
      if (registeredAccounts) {
        const accounts = JSON.parse(registeredAccounts);
        return accounts.find((account: { email: any; }) => account.email === email);
      }
      return null;
    } catch (error) {
      console.error('Error getting user account data:', error);
      return null;
    }
  };

  // Update user account data in localStorage
  const updateUserAccountData = (email: string, updatedData: { name: string; username: string; email: string; phone: string; country: string; bio: string; updatedAt: string; }) => {
    try {
      const registeredAccounts = localStorage.getItem('registeredAccounts');
      if (registeredAccounts) {
        const accounts = JSON.parse(registeredAccounts);
        const accountIndex = accounts.findIndex((account: { email: any; }) => account.email === email);
        
        if (accountIndex !== -1) {
          // Update the account data
          accounts[accountIndex] = { ...accounts[accountIndex], ...updatedData };
          localStorage.setItem('registeredAccounts', JSON.stringify(accounts));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating user account data:', error);
      return false;
    }
  };

  // Update current user session
  const updateCurrentUserSession = (updatedData: { username: string; email: string; name: string; }) => {
    try {
      // Update session storage
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        const updatedUserData = { ...userData, ...updatedData };
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      }

      // Update remembered user if exists
      const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        const updatedUserData = { ...userData, ...updatedData };
        localStorage.setItem('rememberedUser', JSON.stringify(updatedUserData));
      }

      return true;
    } catch (error) {
      console.error('Error updating current user session:', error);
      return false;
    }
  };

  // Check if new username/email is available
  const isUsernameEmailAvailable = (newUsername: string, newEmail: string, currentEmail: string) => {
    try {
      const registeredAccounts = localStorage.getItem('registeredAccounts');
      if (registeredAccounts) {
        const accounts = JSON.parse(registeredAccounts);
        
        // Check if username is taken by another user
        const usernameExists = accounts.find((account: { username: any; email: any; }) => 
          account.username === newUsername && account.email !== currentEmail
        );
        
        // Check if email is taken by another user
        const emailExists = accounts.find((account: { email: any; }) => 
          account.email === newEmail && account.email !== currentEmail
        );
        
        return {
          usernameAvailable: !usernameExists,
          emailAvailable: !emailExists
        };
      }
      return { usernameAvailable: true, emailAvailable: true };
    } catch (error) {
      console.error('Error checking username/email availability:', error);
      return { usernameAvailable: false, emailAvailable: false };
    }
  };

  // Verify current password
  const verifyCurrentPassword = async (inputPassword: string) => {
    try {
      const userAccountData = getUserAccountData(userEmail());
      if (!userAccountData) return false;

      // Check if user has created a new password
      const currentPasswordHash = localStorage.getItem(`currentPassword_${userEmail()}`);
      
      if (currentPasswordHash) {
        // User has created new password, verify against hash
        const inputPasswordHash = await hashPassword(inputPassword);
        return currentPasswordHash === inputPasswordHash;
      } else {
        // User hasn't created new password, verify against original registration password
        return userAccountData.password === inputPassword;
      }
    } catch (error) {
      console.error('Error verifying current password:', error);
      return false;
    }
  };

  // Load current user data
  const loadCurrentUserData = () => {
    const userData = getCurrentUser();
    if (!userData) {
      navigate("/login");
      return;
    }

    setCurrentUser(userData);
    setUserEmail(userData.email);

    // Get detailed account data
    const accountData = getUserAccountData(userData.email);
    if (accountData) {
      // Parse name into first and last name
      const nameParts = (accountData.name || accountData.username || "").split(' ');
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(' ') || "");
      
      setUsername(accountData.username || "");
      setEmail(accountData.email || "");
      setPhone(accountData.phone || "");
      setCountry(accountData.country || "Indonesia");
      setBio(accountData.bio || "");
    }
  };

  // Show message helper
  const showMessage = (message: string, type = "success") => {
    setSaveMessage(message);
    setSaveMessageType(type);
    setShowSaveMessage(true);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 5000);
  };

  // Generate user avatar
  const generateAvatar = (name: string) => {
    if (!name) return "U";
    const nameParts = name.split(' ').filter((part: string | any[]) => part.length > 0);
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Handle profile save
  const handleProfileSave = async () => {
    if (!userEmail()) {
      showMessage("User session expired. Please login again.", "error");
      return;
    }

    // Validate required fields
    if (!firstName().trim() || !email().trim() || !username().trim()) {
      showMessage("Please fill in all required fields (First Name, Username, Email).", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email().trim())) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    // Check if username/email is available
    const availability = isUsernameEmailAvailable(username().trim(), email().trim(), userEmail());
    if (!availability.usernameAvailable) {
      showMessage("Username is already taken by another user.", "error");
      return;
    }
    if (!availability.emailAvailable) {
      showMessage("Email is already registered by another user.", "error");
      return;
    }

    try {
      const fullName = `${firstName().trim()} ${lastName().trim()}`.trim();
      
      // Prepare updated data
      const updatedAccountData = {
        name: fullName,
        username: username().trim(),
        email: email().trim(),
        phone: phone().trim(),
        country: country().trim(),
        bio: bio().trim(),
        updatedAt: new Date().toISOString()
      };

      // Update account data in localStorage
      const updateSuccess = updateUserAccountData(userEmail(), updatedAccountData);
      if (!updateSuccess) {
        showMessage("Failed to update account data. Please try again.", "error");
        return;
      }

      // If email changed, we need to handle password data migration
      if (email().trim() !== userEmail()) {
        const oldEmail = userEmail();
        const newEmail = email().trim();
        
        // Migrate password data if exists
        const currentPasswordHash = localStorage.getItem(`currentPassword_${oldEmail}`);
        const passwordChanged = localStorage.getItem(`passwordChanged_${oldEmail}`);
        
        if (currentPasswordHash) {
          localStorage.setItem(`currentPassword_${newEmail}`, currentPasswordHash);
          localStorage.removeItem(`currentPassword_${oldEmail}`);
        }
        if (passwordChanged) {
          localStorage.setItem(`passwordChanged_${newEmail}`, passwordChanged);
          localStorage.removeItem(`passwordChanged_${oldEmail}`);
        }

        // Update userEmail state
        setUserEmail(newEmail);
      }

      // Update current user session
      updateCurrentUserSession({
        username: username().trim(),
        email: email().trim(),
        name: fullName
      });

      showMessage("Profile updated successfully! Changes will take effect immediately.", "success");

      // Update notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          type: "success",
          title: "Profile Updated",
          message: "Your profile information has been saved successfully.",
          time: "Just now",
          read: false,
          icon: "check"
        },
        ...prev
      ]);

    } catch (error) {
      console.error('Error saving profile:', error);
      showMessage("An error occurred while saving your profile. Please try again.", "error");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!userEmail()) {
      showMessage("User session expired. Please login again.", "error");
      return;
    }

    // Validate inputs
    if (!currentPassword().trim()) {
      showMessage("Please enter your current password.", "error");
      return;
    }
    if (!newPassword().trim()) {
      showMessage("Please enter a new password.", "error");
      return;
    }
    if (!confirmPassword().trim()) {
      showMessage("Please confirm your new password.", "error");
      return;
    }

    // Validate password match
    if (newPassword() !== confirmPassword()) {
      showMessage("New passwords do not match.", "error");
      return;
    }

    // Validate password strength
    if (newPassword().length < 6) {
      showMessage("New password must be at least 6 characters long.", "error");
      return;
    }

    // Verify current password
    const currentPasswordValid = await verifyCurrentPassword(currentPassword());
    if (!currentPasswordValid) {
      showMessage("Current password is incorrect.", "error");
      return;
    }

    try {
      // Hash new password
      const newPasswordHash = await hashPassword(newPassword());
      
      // Save new password hash
      localStorage.setItem(`currentPassword_${userEmail()}`, newPasswordHash);
      localStorage.setItem(`passwordChanged_${userEmail()}`, Date.now().toString());
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      showMessage("Password changed successfully! Please use your new password for future logins.", "success");

      // Update notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          type: "security",
          title: "Password Changed",
          message: "Your account password has been updated successfully.",
          time: "Just now",
          read: false,
          icon: "shield"
        },
        ...prev
      ]);

    } catch (error) {
      console.error('Error changing password:', error);
      showMessage("An error occurred while changing your password. Please try again.", "error");
    }
  };

  // Handle save based on active tab
  const handleSave = () => {
    if (activeTab() === "profile") {
      handleProfileSave();
    } else if (activeTab() === "security") {
      handlePasswordChange();
    } else {
      showMessage("Settings saved!", "success");
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
    
    // Load current user data
    loadCurrentUserData();
    
    // Animation delay
    setTimeout(() => setAnimate(true), 100);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "devices", label: "Devices", icon: Smartphone }
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex relative overflow-hidden">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-200/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200/4 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Use your existing Sidebar component */}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main content */}
      <main class={`flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 relative z-10 transition-all duration-300 ${
        isMobile() ? 'ml-0' : ''
      }`}>
        {/* Use your existing Header component */}
        <Header
          title="Account Settings"
          subtitle="Manage your account preferences and security"
          searchData={searchData}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* Save Message */}
        {showSaveMessage() && (
          <div class={`fixed top-4 right-4 z-50 p-4 rounded-xl border backdrop-blur-xl transition-all duration-500 ${
            saveMessageType() === "success" 
              ? "bg-green-500/20 border-green-400/30 text-green-200" 
              : saveMessageType() === "error"
              ? "bg-red-500/20 border-red-400/30 text-red-200"
              : "bg-yellow-500/20 border-yellow-400/30 text-yellow-200"
          }`}>
            <div class="flex items-center gap-3">
              <div class={`w-2 h-2 rounded-full ${
                saveMessageType() === "success" ? "bg-green-400" : 
                saveMessageType() === "error" ? "bg-red-400" : "bg-yellow-400"
              }`}></div>
              <span class="text-sm font-medium">{saveMessage()}</span>
              <button 
                onClick={() => setShowSaveMessage(false)}
                class="ml-2 text-current hover:opacity-70"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div class={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative group">
              <div class="w-24 h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center text-gray-900 text-3xl font-bold shadow-xl">
                {generateAvatar(`${firstName()} ${lastName()}`)}
              </div>
              <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:scale-110 transition-transform duration-200">
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <div class="text-center md:text-left">
              <h2 class="text-2xl font-bold text-white mb-1">{`${firstName()} ${lastName()}`.trim() || "User"}</h2>
              <p class="text-gray-400 mb-3">{email()}</p>
              <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  Verified Account
                </span>
                <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 200ms">
          <div class="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                class={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab() === tab.id
                    ? 'bg-pink-200/20 text-pink-200 border border-pink-200/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <tab.icon class="w-4 h-4" />
                <span class="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div class="lg:col-span-2 space-y-6">
            {activeTab() === "profile" && (
              <>
                {/* Personal Information */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User class="w-5 h-5 text-pink-200" />
                    Personal Information
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">First Name *</label>
                      <input 
                        type="text" 
                        value={firstName()}
                        onInput={(e) => setFirstName(e.currentTarget.value)}
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName()}
                        onInput={(e) => setLastName(e.currentTarget.value)}
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Username *</label>
                      <input 
                        type="text" 
                        value={username()}
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        value={email()} 
                        onInput={(e) => setEmail(e.currentTarget.value)} 
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={phone()}
                        onInput={(e) => setPhone(e.currentTarget.value)}
                        placeholder="+62 812-3456-7890"
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Country</label>
                      <select 
                        value={country()}
                        onInput={(e) => setCountry(e.currentTarget.value)}
                        class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                      >
                        <option>Indonesia</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Singapore</option>
                        <option>Malaysia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 500ms">
                  <h3 class="text-xl font-bold text-white mb-6">About You</h3>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea 
                      rows="4"
                      value={bio()}
                      onInput={(e) => setBio(e.currentTarget.value)}
                      placeholder="Tell us about yourself..."
                      class="w-full p-4 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90 resize-none"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "security" && (
              <>
                {/* Password Change */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock class="w-5 h-5 text-purple-400" />
                    Change Password
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Current Password *</label>
                      <div class="relative">
                        <input 
                          type={showCurrentPassword() ? "text" : "password"}
                          value={currentPassword()}
                          onInput={(e) => setCurrentPassword(e.currentTarget.value)}
                          placeholder="Enter current password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowCurrentPassword(!showCurrentPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showCurrentPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">New Password *</label>
                      <div class="relative">
                        <input 
                          type={showNewPassword() ? "text" : "password"}
                          value={newPassword()} 
                          onInput={(e) => setNewPassword(e.currentTarget.value)} 
                          placeholder="Enter new password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showNewPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-2">Confirm New Password *</label>
                      <div class="relative">
                        <input 
                          type={showConfirmPassword() ? "text" : "password"}
                          value={confirmPassword()}
                          onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                          placeholder="Confirm new password"
                          class="w-full p-4 pr-12 rounded-xl bg-gray-800/70 text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200/50 focus:border-pink-200/50 transition-all duration-300 hover:bg-gray-800/90"
                        />
                        <button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                        >
                          {showConfirmPassword() ? <EyeOff class="w-5 h-5" /> : <Eye class="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div class="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                      <p class="text-gray-300 text-sm mb-2">Password Requirements:</p>
                      <ul class="text-gray-400 text-xs space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Mix of letters and numbers recommended</li>
                        <li>• Avoid using personal information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 500ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield class="w-5 h-5 text-green-400" />
                    Two-Factor Authentication
                  </h3>
                  <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                    <div>
                      <p class="text-white font-medium">Enable 2FA</p>
                      <p class="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button class="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-all duration-200">
                      Enable
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "privacy" && (
              <>
                {/* Privacy Settings */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe class="w-5 h-5 text-blue-400" />
                    Privacy Controls
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Profile Visibility</p>
                        <p class="text-gray-400 text-sm">Control who can see your profile</p>
                      </div>
                      <select class="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Activity Status</p>
                        <p class="text-gray-400 text-sm">Show when you're online</p>
                      </div>
                      <button class="bg-pink-200/20 text-pink-200 px-4 py-2 rounded-lg border border-pink-200/30">
                        Enabled
                      </button>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div>
                        <p class="text-white font-medium">Data Collection</p>
                        <p class="text-gray-400 text-sm">Allow analytics and performance tracking</p>
                      </div>
                      <button class="bg-gray-600/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-600/30">
                        Disabled
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab() === "devices" && (
              <>
                {/* Connected Devices */}
                <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-900/80 transition-all duration-700 hover:scale-[1.01] ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 400ms">
                  <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Smartphone class="w-5 h-5 text-cyan-400" />
                    Connected Devices
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Smartphone class="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p class="text-white font-medium">Current Device</p>
                          <p class="text-gray-400 text-sm">Last active: Now</p>
                        </div>
                      </div>
                      <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                        Current
                      </span>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/30">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Globe class="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p class="text-white font-medium">Chrome Browser</p>
                          <p class="text-gray-400 text-sm">Last active: 1 hour ago</p>
                        </div>
                      </div>
                      <button class="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-all duration-200">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div class="space-y-6">
            {/* Quick Actions */}
            <div class={`bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 600ms">
              <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button class="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-pink-200 transition-all duration-300">
                  <Save class="w-4 h-4" />
                  Export Data
                </button>
                <button 
                  onClick={() => setActiveTab("privacy")}
                  class="w-full flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:text-pink-200 transition-all duration-300"
                >
                  <Lock class="w-4 h-4" />
                  Privacy Settings
                </button>
                <button class="w-full flex items-center gap-3 p-3 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500/20 transition-all duration-300 border border-red-500/20">
                  <X class="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div class={`bg-gradient-to-br from-pink-200/10 to-pink-300/5 backdrop-blur-xl rounded-2xl p-6 border border-pink-200/20 transition-all duration-700 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 700ms">
              <h3 class="text-lg font-bold text-white mb-4">Account Status</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Storage Used</span>
                  <span class="text-white">2.3 GB / 5 GB</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-pink-200 to-pink-300 h-2 rounded-full" style="width: 46%"></div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Plan</span>
                  <span class="text-pink-200">Premium</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Member Since</span>
                  <span class="text-white">Jan 2024</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-400">Last Login</span>
                  <span class="text-white">{currentUser() ? "Now" : "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div class={`flex flex-col sm:flex-row gap-4 ${animate() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style="transition-delay: 800ms">
          <button 
            onClick={handleSave}
            class="bg-gradient-to-r from-pink-200 to-pink-300 text-gray-900 px-8 py-4 rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <Save class="w-5 h-5" />
            {activeTab() === "profile" ? "Save Profile" : activeTab() === "security" ? "Update Password" : "Save Changes"}
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            class="bg-gray-800/60 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700/60 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}