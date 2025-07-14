import { useNavigate } from "@solidjs/router";
import { Sparkles, Users, Calculator, Heart, Star, Zap } from "lucide-solid";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden font-inter">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-4 -right-4 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-8 -left-8 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div class="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-12 text-white">
        <div class="text-center space-y-8 max-w-4xl">
          {/* Icon */}
          <div class="relative">
            <div class="absolute inset-0 bg-pink-400/30 rounded-full blur-xl animate-pulse"></div>
            <div class="relative bg-gray-900/60 backdrop-blur-sm rounded-full p-6 inline-block border border-pink-400/30 shadow-lg">
              <Sparkles class="w-16 h-16 text-pink-400 animate-spin" style="animation-duration: 3s" />
            </div>
          </div>

          {/* Title */}
          <div class="space-y-4">
            <h1 class="text-5xl md:text-7xl font-black leading-tight">
              <span class="bg-gradient-to-r from-pink-400 via-white to-pink-300 bg-clip-text text-transparent">
                Split Bills
              </span>
              <br />
              <span class="bg-gradient-to-r from-white via-pink-400 to-pink-500 bg-clip-text text-transparent">
                Beautifully ✨
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-pink-100 font-medium max-w-2xl mx-auto leading-relaxed">
              Bagi pengeluaran bareng teman jadi mudah, cepat, dan stylish 💖
            </p>
          </div>

          {/* Features */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
            <div class="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/20 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-400/20">
              <Users class="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 class="font-bold text-lg mb-2 text-white">Bareng Teman</h3>
              <p class="text-pink-100 text-sm">Ajak teman dan keluarga untuk split bill dengan mudah</p>
            </div>

            <div class="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/20 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-400/20">
              <Calculator class="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 class="font-bold text-lg mb-2 text-white">Hitung Otomatis</h3>
              <p class="text-pink-100 text-sm">Perhitungan akurat dan pembagian yang adil</p>
            </div>

            <div class="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/20 hover:bg-gray-800/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-400/20">
              <Heart class="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 class="font-bold text-lg mb-2 text-white">Tanpa Drama</h3>
              <p class="text-pink-100 text-sm">Selesaikan pembayaran tanpa ribet dan canggung</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div class="flex justify-center gap-4 mt-12 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              class="group relative bg-pink-500 text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-pink-400/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative z-10 transition-colors duration-300">
                <Zap class="w-5 h-5 inline mr-2" />
                Mulai Sekarang
              </span>
            </button>

            <button
              onClick={() => navigate("/register")}
              class="group bg-gray-900/60 backdrop-blur-sm text-pink-400 font-bold px-8 py-4 rounded-full border-2 border-pink-400/50 hover:bg-gray-800/60 hover:border-pink-400/70 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Star class="w-5 h-5 inline mr-2" />
              Daftar Gratis
            </button>
          </div>

          {/* Social Proof */}
          <div class="mt-12 text-center">
            <p class="text-pink-200 text-sm mb-4">Dipercaya oleh ribuan pengguna</p>
            <div class="flex justify-center items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star class="w-5 h-5 text-pink-400 fill-current" />
              ))}
              <span class="text-white font-semibold ml-2">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-10 animate-bounce delay-300">
        <div class="w-3 h-3 bg-pink-400 rounded-full opacity-70"></div>
      </div>
      <div class="absolute top-40 right-20 animate-bounce delay-700">
        <div class="w-2 h-2 bg-pink-500 rounded-full opacity-70"></div>
      </div>
      <div class="absolute bottom-32 left-20 animate-bounce delay-1000">
        <div class="w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
      </div>
      <div class="absolute bottom-20 right-32 animate-bounce delay-500">
        <div class="w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
      </div>
    </div>
  );
}