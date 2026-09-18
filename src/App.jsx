import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CaptureScreen from './components/CaptureScreen';
import EditorScreen from './components/EditorScreen';
import { Camera } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'capture' | 'editor'
  const [photos, setPhotos] = useState([]);

  const handleStartSession = () => {
    setPhotos([]);
    setStep('capture');
  };

  const handlePhotosCaptured = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    setStep('editor');
  };

  const handleRetake = () => {
    setPhotos([]);
    setStep('capture');
  };

  const handleBackToWelcome = () => {
    setPhotos([]);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FDF4FF] to-[#F0F7FF] text-[#36213e] flex flex-col font-sans selection:bg-[#FBCFE8] selection:text-[#831843] relative overflow-x-hidden">
      {/* Soft Luminous Pastel Gradient Clouds & Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-pink-300/35 via-rose-200/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-purple-300/30 via-sky-200/30 to-pink-200/20 blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-amber-100/40 to-pink-200/25 blur-3xl pointer-events-none -z-10" />

      {/* Premium Header */}
      {step !== 'welcome' && (
        <header className="w-full max-w-6xl mx-auto px-6 py-4 flex justify-between items-center border-b border-pink-200/50 bg-white/60 backdrop-blur-md sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-300 via-rose-200 to-purple-200 flex items-center justify-center text-[#4a154b] shadow-md shadow-pink-300/30">
              <Camera className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-wider text-[#4a154b] flex items-center gap-1.5">
                WEBCAM AYA 🌸
              </span>
              <span className="text-[10px] text-pink-700/60 font-medium tracking-widest block leading-none">
                PERSONAL STUDIO BOOTH
              </span>
            </div>
          </div>

          {/* Live Studio Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 border border-pink-300/80 text-[11px] text-pink-800 font-medium tracking-wide shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            Aya's Studio Active 🎀
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-6">
        {step === 'welcome' && (
          <WelcomeScreen onStart={handleStartSession} />
        )}
        {step === 'capture' && (
          <CaptureScreen 
            onPhotosCaptured={handlePhotosCaptured} 
            onBack={handleBackToWelcome} 
          />
        )}
        {step === 'editor' && (
          <EditorScreen 
            photos={photos} 
            onRetake={handleRetake} 
          />
        )}
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-pink-200/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-pink-900/60 font-light tracking-wide">
        <div className="flex items-center gap-1 font-medium">
          <span>&copy; {new Date().getFullYear()} WEBCAM AYA 🌸. All rights reserved.</span>
        </div>
        <div className="flex gap-4 font-medium">
          <span className="text-pink-700/80 font-medium">Special for ayaa ✨</span>
        </div>
      </footer>
    </div>
  );
}
