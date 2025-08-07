import { createSignal, createEffect, onCleanup } from 'solid-js';

// Icons as simple SVG components
const Receipt = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
    <path d="M12 18V6"/>
  </svg>
);

const Users = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21-3.916-3.916"/>
    <circle cx="16" cy="5" r="3"/>
  </svg>
);

const Calculator = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2"/>
    <line x1="8" x2="16" y1="6" y2="6"/>
    <line x1="16" x2="16" y1="14" y2="18"/>
    <path d="m16 10 4 4-4 4"/>
  </svg>
);

const PlusCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6"/>
    <path d="m9 9 6 6"/>
  </svg>
);

const CheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

const DollarSign = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export default function SplitBillLanding() {
  const [isVisible, setIsVisible] = createSignal(false);
  const [currentFeature, setCurrentFeature] = createSignal(0);
  const [isYearly, setIsYearly] = createSignal(false);

  createEffect(() => {
    setIsVisible(true);
    
    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 3000);
    
    onCleanup(() => clearInterval(interval));
  });

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Navigation functions
  const navigateToLogin = () => {
    // Arahkan ke halaman login yang sudah Anda buat
    window.location.href = '/login';
  };

  const navigateToSignUp = () => {
    // Arahkan ke halaman register yang sudah Anda buat  
    window.location.href = '/register';
  };

  const pricingPlans = [
    {
      type: "FREE",
      period: "Forever",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      users: "Up to 5 users",
      bills: "10 bills/month",
      features: "Basic splitting",
      support: "Community support",
      popular: false
    },
    {
      type: "PRO",
      period: "Per Month", 
      monthlyPrice: "$4.99",
      yearlyPrice: "$49.99",
      users: "Up to 20 users",
      bills: "Unlimited bills",
      features: "Advanced features",
      support: "Priority support",
      popular: true,
      savings: "Save $10"
    },
    {
      type: "TEAM",
      period: "Per Month",
      monthlyPrice: "$9.99", 
      yearlyPrice: "$99.99",
      users: "Unlimited users",
      bills: "Unlimited bills",
      features: "Team management",
      support: "24/7 support",
      savings: "Save $20"
    }
  ];

  return (
    <div class="min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Navigation */}
      <nav class="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6 bg-black/90 backdrop-blur-md w-full top-0">
        <div class="text-2xl font-bold flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg flex items-center justify-center">
            <Receipt />
          </div>
          <span class="text-white">BILLSPLIT</span>
        </div>
        <div class="hidden md:flex items-center space-x-8 text-sm">
          <button onClick={() => scrollToSection('home')} class="text-gray-300 hover:text-pink-300 transition-colors cursor-pointer">HOME</button>
          <button onClick={() => scrollToSection('about')} class="text-gray-300 hover:text-pink-300 transition-colors cursor-pointer">ABOUT US</button>
          <button onClick={() => scrollToSection('pricing')} class="text-gray-300 hover:text-pink-300 transition-colors cursor-pointer">PRICING</button>
          <button onClick={() => scrollToSection('how-it-works')} class="text-gray-300 hover:text-pink-300 transition-colors cursor-pointer">HOW IT WORKS</button>
          <button onClick={() => scrollToSection('support')} class="text-gray-300 hover:text-pink-300 transition-colors cursor-pointer">SUPPORT</button>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            onClick={navigateToLogin}
            class="bg-pink-300 hover:bg-pink-400 px-6 py-2 rounded text-black font-medium transition-colors"
          >
            LOGIN
          </button>
          <button 
            onClick={navigateToSignUp}
            class="border border-pink-300 hover:bg-pink-300/10 px-6 py-2 rounded text-pink-300 font-medium transition-colors"
          >
            SIGN UP
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" class="relative min-h-screen flex items-center pt-20">
        {/* Background Effects */}
        <div class="absolute inset-0">
          <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-900/20 via-pink-800/10 to-transparent"></div>
          <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-pink-900/10 via-pink-800/5 to-transparent"></div>
        </div>

        <div class={`relative z-10 grid lg:grid-cols-2 gap-12 px-6 lg:px-12 w-full transition-all duration-1000 ${isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left Content */}
          <div class="flex flex-col justify-center space-y-8">
            <div class="space-y-6">
              <h1 class="text-5xl lg:text-7xl font-bold leading-tight">
                <span class="text-white">SMART BILL</span>
                <br />
                <span class="bg-gradient-to-r from-pink-300 to-pink-400 bg-clip-text text-transparent">
                  SPLITTING MADE EASY
                </span>
              </h1>
              
              <p class="text-gray-400 text-lg leading-relaxed max-w-lg">
                BillSplit is the ultimate expense sharing app that makes splitting 
                bills with friends, family, and roommates effortless. Track shared 
                expenses, calculate fair splits, and settle debts with just a few taps. 
                No more awkward money conversations or complex calculations.
              </p>
            </div>

            {/* Social Links */}
            <div class="flex items-center space-x-4 pt-8">
              <div class="w-10 h-10 bg-gray-800 hover:bg-pink-300 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <span class="text-white text-sm">f</span>
              </div>
              <div class="w-10 h-10 bg-gray-800 hover:bg-pink-300 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <span class="text-white text-sm">t</span>
              </div>
              <div class="w-10 h-10 bg-gray-800 hover:bg-pink-300 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <span class="text-white text-sm">in</span>
              </div>
              <div class="w-10 h-10 bg-gray-800 hover:bg-pink-300 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <span class="text-white text-sm">@</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mobile App Visualization */}
          <div class="flex items-center justify-center relative">
            <div class="relative">
              {/* Main Phone Mockup */}
              <div class="w-72 h-96 relative">
                {/* Glowing background */}
                <div class="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-pink-400/20 rounded-3xl blur-3xl animate-pulse"></div>
                
                {/* Phone Body */}
                <div class="absolute inset-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl border border-pink-300/30 shadow-2xl overflow-hidden">
                  {/* Screen Header */}
                  <div class="bg-pink-300 p-4 text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <Receipt />
                      <span class="text-black font-bold">BillSplit</span>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div class="p-6 space-y-4">
                    {/* Recent Bill Item */}
                    <div class="bg-gray-700/50 rounded-xl p-4 border border-pink-300/20">
                      <div class="flex justify-between items-center">
                        <div>
                          <h4 class="text-white font-semibold">Dinner at Pizza Palace</h4>
                          <p class="text-gray-400 text-sm">4 people • $120.00</p>
                        </div>
                        <div class="text-pink-300 font-bold">$30.00</div>
                      </div>
                    </div>
                    
                    {/* Another Bill Item */}
                    <div class="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                      <div class="flex justify-between items-center">
                        <div>
                          <h4 class="text-white font-semibold">Movie Tickets</h4>
                          <p class="text-gray-400 text-sm">2 people • $24.00</p>
                        </div>
                        <div class="text-pink-300 font-bold">$12.00</div>
                      </div>
                    </div>
                    
                    {/* Add Bill Button */}
                    <button class="w-full bg-pink-300/20 border-2 border-dashed border-pink-300/50 rounded-xl p-4 flex items-center justify-center space-x-2 hover:bg-pink-300/30 transition-colors">
                      <PlusCircle />
                      <span class="text-pink-300 font-medium">Add New Bill</span>
                    </button>
                  </div>
                </div>

                {/* Floating Features */}
                <div class="absolute -top-4 -left-8 w-12 h-12 bg-pink-300 rounded-full opacity-80 animate-bounce flex items-center justify-center shadow-lg">
                  <Calculator />
                </div>
                <div class="absolute -top-2 -right-6 w-10 h-10 bg-pink-400 rounded-full opacity-70 animate-bounce delay-500 flex items-center justify-center shadow-lg">
                  <Users />
                </div>
                <div class="absolute -bottom-4 -left-6 w-11 h-11 bg-pink-500 rounded-full opacity-75 animate-bounce delay-1000 flex items-center justify-center shadow-lg">
                  <DollarSign />
                </div>
                <div class="absolute -bottom-2 -right-8 w-12 h-12 bg-pink-200 rounded-full opacity-60 animate-bounce delay-1500 flex items-center justify-center shadow-lg">
                  <CheckCircle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" class="py-20 px-6 lg:px-12 relative">
        <div class="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content - Calculator Visual */}
          <div class="relative">
            <div class="w-80 h-80 relative mx-auto">
              {/* Calculator interface made of dots/nodes */}
              <div class="absolute inset-0">
                <svg viewBox="0 0 200 200" class="w-full h-full">
                  {/* Calculator grid */}
                  {Array.from({ length: 16 }, (_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    const x = 60 + col * 20;
                    const y = 60 + row * 20;
                    return (
                      <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#f9a8d4"
                        class="animate-pulse"
                        style={{ "animation-delay": `${i * 100}ms` }}
                      />
                    );
                  })}
                  {/* Connection lines */}
                  {Array.from({ length: 10 }, (_, i) => (
                    <line
                      x1={70 + (i * 6)}
                      y1={80}
                      x2={70 + (i * 6)}
                      y2={120}
                      stroke="#f9a8d4"
                      stroke-width="1"
                      opacity="0.4"
                      class="animate-pulse"
                      style={{ "animation-delay": `${i * 150}ms` }}
                    />
                  ))}
                </svg>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-pink-300/10 to-pink-400/10 rounded-2xl blur-2xl animate-pulse"></div>
            </div>
          </div>

          {/* Right Content */}
          <div class="space-y-8">
            <div class="space-y-4">
              <h2 class="text-5xl font-bold text-white">About <span class="text-pink-300">Us</span></h2>
              <h3 class="text-2xl font-semibold text-pink-300">We Make Bill Splitting Simple & Fair</h3>
            </div>
            
            <div class="space-y-6 text-gray-400 leading-relaxed">
              <p>
                BillSplit was born from the frustration of awkward money conversations and complex 
                calculations when dining out with friends. Our team of developers and UX designers 
                created an intuitive solution that eliminates the hassle of splitting expenses.
              </p>
              
              <p>
                Whether you're sharing a meal, splitting rent with roommates, or organizing a group trip, 
                our app automatically calculates fair splits based on what each person ordered or used. 
                No more mental math, no more arguments about who owes what.
              </p>
              
              <p>
                With features like receipt scanning, multiple split methods, and integrated payment 
                reminders, BillSplit ensures everyone pays their fair share while maintaining 
                friendships and keeping finances transparent and stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section id="pricing" class="py-20 px-6 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-white mb-4">
            <span class="text-pink-300">Pricing</span> Plans
          </h2>
        </div>

        {/* Plan Toggle */}
        <div class="flex justify-center mb-12">
          <div class="bg-gray-800 rounded-lg p-1 flex">
            <button 
              onClick={() => setIsYearly(false)}
              class={`px-6 py-2 rounded font-medium transition-colors ${
                !isYearly() ? 'bg-pink-300 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              class={`px-6 py-2 rounded font-medium transition-colors ${
                isYearly() ? 'bg-pink-300 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              YEARLY
            </button>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div class={`relative bg-gray-900 rounded-3xl p-8 border-2 transition-all duration-300 transform hover:scale-105 ${
              plan.popular ? 'border-pink-300 shadow-lg shadow-pink-300/20' : 'border-gray-700 hover:border-pink-300/50'
            }`}>
              {plan.popular && (
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-300 text-black px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </div>
              )}
              
              {/* Savings Badge for Yearly */}
              {isYearly() && plan.savings && (
                <div class="absolute -top-2 -right-2 bg-pink-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                  {plan.savings}
                </div>
              )}
              
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-pink-300 mb-2">{plan.type}</h3>
                <p class="text-gray-400">{isYearly() ? 'Per Year' : plan.period}</p>
              </div>

              <div class="text-center mb-8">
                <div class="text-4xl font-bold text-white mb-2">
                  {isYearly() ? plan.yearlyPrice : plan.monthlyPrice}
                </div>
                <div class="text-gray-400 text-sm">
                  {plan.type === 'FREE' ? 'Forever' : (isYearly() ? 'Per Year' : 'Per Month')}
                </div>
                {isYearly() && plan.type !== 'FREE' && (
                  <div class="text-xs text-pink-300 mt-1">
                    ${(parseFloat(plan.yearlyPrice.replace('$', '')) / 12).toFixed(2)}/month billed annually
                  </div>
                )}
              </div>

              <div class="space-y-4 mb-8">
                <div class="flex items-center py-2">
                  <CheckCircle />
                  <span class="text-gray-300 ml-3">{plan.users}</span>
                </div>
                <div class="flex items-center py-2">
                  <CheckCircle />
                  <span class="text-gray-300 ml-3">{plan.bills}</span>
                </div>
                <div class="flex items-center py-2">
                  <CheckCircle />
                  <span class="text-gray-300 ml-3">{plan.features}</span>
                </div>
                <div class="flex items-center py-2">
                  <CheckCircle />
                  <span class="text-gray-300 ml-3">{plan.support}</span>
                </div>
                <div class="flex items-center py-2">
                  <CheckCircle />
                  <span class="text-gray-300 ml-3">Receipt scanning</span>
                </div>
              </div>

              <button class={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.popular 
                  ? 'bg-pink-300 hover:bg-pink-400 text-black'
                  : 'bg-gray-800 hover:bg-pink-300 text-gray-300 hover:text-black border border-gray-600 hover:border-pink-300'
              }`}>
                {plan.type === 'FREE' ? 'GET STARTED' : 'CHOOSE PLAN'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" class="py-20 px-6 lg:px-12 bg-gray-900">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-white mb-4">
            How It <span class="text-pink-300">Works</span>
          </h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Split bills in three simple steps and keep everyone happy
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="text-center space-y-6">
            <div class="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center mx-auto">
              <span class="text-black text-2xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-bold text-white">Add Your Bill</h3>
            <p class="text-gray-400">
              Simply scan your receipt or manually enter the bill details. Our smart recognition makes it quick and easy.
            </p>
          </div>
          
          <div class="text-center space-y-6">
            <div class="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center mx-auto">
              <span class="text-black text-2xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-bold text-white">Choose Split Method</h3>
            <p class="text-gray-400">
              Split equally, by percentage, or assign specific items to each person. Multiple options for every situation.
            </p>
          </div>
          
          <div class="text-center space-y-6">
            <div class="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center mx-auto">
              <span class="text-black text-2xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-bold text-white">Send & Settle</h3>
            <p class="text-gray-400">
              Share the split with your group and track payments. Everyone knows exactly what they owe.
            </p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" class="py-20 px-6 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold text-white mb-4">
            Need <span class="text-pink-300">Support</span>?
          </h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team or browse our help resources.
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div class="space-y-6">
            <h3 class="text-2xl font-bold text-white">Get Help</h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                <div class="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
                  <span class="text-black">?</span>
                </div>
                <div>
                  <h4 class="text-white font-semibold">FAQ</h4>
                  <p class="text-gray-400 text-sm">Find answers to common questions</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                <div class="w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center">
                  <span class="text-black">@</span>
                </div>
                <div>
                  <h4 class="text-white font-semibold">Email Support</h4>
                  <p class="text-gray-400 text-sm">support@billsplit.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <h3 class="text-2xl font-bold text-white">Contact Form</h3>
            <div class="space-y-4">
              <input type="email" placeholder="Your email" class="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-pink-300 outline-none" />
              <textarea placeholder="Your message" rows="4" class="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-pink-300 outline-none resize-none"></textarea>
              <button class="w-full bg-pink-300 hover:bg-pink-400 text-black py-3 rounded-lg font-medium transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="py-16 px-6 lg:px-12 bg-gray-900">
        <div class="text-center">
          <div class="text-2xl font-bold flex items-center justify-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg flex items-center justify-center">
              <Receipt />
            </div>
            <span class="text-white">BILLSPLIT</span>
          </div>
          <p class="text-gray-400 mb-8 max-w-2xl mx-auto">
            Making bill splitting simple, fair, and stress-free for everyone. Split smarter, not harder.
          </p>
          <div class="flex justify-center space-x-8 text-gray-400 text-sm">
            <a href="#" class="hover:text-pink-300 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-pink-300 transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-pink-300 transition-colors">Contact</a>
            <a href="#" class="hover:text-pink-300 transition-colors">Support</a>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-700 text-gray-500 text-sm">
            © 2024 BillSplit - Smart Bill Splitting App. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}