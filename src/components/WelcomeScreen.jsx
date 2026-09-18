import React from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden py-6">
      {/* Soft Decorative Floating Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-rose-200/35 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="max-w-md w-full glass-card rounded-[38px] p-8 sm:p-10 relative border-2 border-pink-200/80 flex flex-col items-center shadow-2xl shadow-pink-200/60 backdrop-blur-2xl">
        
        {/* Top Aesthetic Decorative Polaroid Collage */}
        <div className="flex items-center justify-center -space-x-4 mb-7 pt-2 select-none pointer-events-none">
          {/* Card 1 */}
          <div className="w-20 h-24 bg-pink-50 border-2 border-pink-200 rounded-2xl p-1.5 shadow-md transform -rotate-12 hover:rotate-0 transition-transform duration-300 flex flex-col items-center justify-between">
            <div className="w-full h-14 rounded-xl bg-pink-100 flex items-center justify-center text-xl">
              🌸
            </div>
            <span className="text-[8px] font-bold text-pink-700 font-sans tracking-wide">CANTIK</span>
          </div>

          {/* Card 2 (Center Hero) */}
          <div className="w-24 h-28 bg-white border-2 border-pink-300 rounded-2xl p-2 shadow-xl transform rotate-0 scale-105 z-10 flex flex-col items-center justify-between">
            <div className="w-full h-16 rounded-xl bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-200 flex items-center justify-center text-2xl shadow-inner">
              📸
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-[#4a154b]">
              <span>AYA</span>
              <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-20 h-24 bg-purple-50 border-2 border-purple-200 rounded-2xl p-1.5 shadow-md transform rotate-12 hover:rotate-0 transition-transform duration-300 flex flex-col items-center justify-between">
            <div className="w-full h-14 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
              🎀
            </div>
            <span className="text-[8px] font-bold text-purple-700 font-sans tracking-wide">SWEET</span>
          </div>
        </div>

        {/* Cute Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/90 border border-pink-300/80 text-pink-800 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Studio Foto Pribadi Aya</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4a154b] mb-3 leading-tight">
          WEBCAM <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 bg-clip-text text-transparent">AYA</span> 🌸
        </h1>

        {/* Short & Sweet Invitation */}
        <p className="text-sm text-pink-900/75 font-medium max-w-xs mb-8 leading-relaxed">
          Ambil 4 pose foto terbaikmu dan pilih template estetik favoritmu! ✨
        </p>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white font-bold text-sm sm:text-base rounded-full shadow-lg shadow-pink-300/60 hover:shadow-xl hover:shadow-pink-300/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Camera className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12" />
          <span className="tracking-wide">Mulai Sesi Foto 📸</span>
        </button>

      </div>
    </div>
  );
}
