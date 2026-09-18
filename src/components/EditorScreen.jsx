import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, RefreshCw, Layers, Palette, Sliders, Type, Sparkles, Share2 } from 'lucide-react';

const THEMES = [
  { 
    id: 'sakura-blush', 
    name: 'Sakura Blossom 🌸', 
    hex: '#FCE7F3',
    text: '#5C2943', 
    border: '#F472B6',
    customBg: { 
      backgroundColor: '#FFF0F5',
      backgroundImage: 'radial-gradient(#FBCFE8 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'matcha-sage', 
    name: 'Matcha & Sage Calm 🍵', 
    hex: '#D1E7DD',
    text: '#264234', 
    border: '#95B8A6',
    customBg: { 
      backgroundColor: '#F0F5F1',
      backgroundImage: 'radial-gradient(#C6DDD0 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'coquette-ribbon', 
    name: 'Coquette Soft Ribbon 🎀', 
    hex: '#FDF2F0',
    text: '#523438', 
    border: '#E8BFB8',
    customBg: { 
      backgroundColor: '#FFFDF9',
      backgroundImage: 'radial-gradient(#F3D9D5 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'lavender-dream', 
    name: 'Lavender Dream 💜', 
    hex: '#EDE9FE',
    text: '#3B2961', 
    border: '#C4B5FD',
    customBg: { 
      backgroundColor: '#F7F4FF',
      backgroundImage: 'radial-gradient(#DDD6FE 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'baby-blue', 
    name: 'Baby Blue Serenity ☁️', 
    hex: '#E0F2FE',
    text: '#1E3A5F', 
    border: '#BAE6FD',
    customBg: { 
      backgroundColor: '#F2F8FD',
      backgroundImage: 'radial-gradient(#BAE6FD 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'vanilla-cafe', 
    name: 'Cozy Vanilla Cafe 🧸', 
    hex: '#F5EBE1',
    text: '#483526', 
    border: '#DBC5AF',
    customBg: { 
      backgroundColor: '#FAF5EE',
      backgroundImage: 'radial-gradient(#E8D9C5 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'strawberry-milk', 
    name: 'Strawberry Milk 🍓', 
    hex: '#FFE4E6',
    text: '#702236', 
    border: '#FDA4AF',
    customBg: { 
      backgroundColor: '#FFF1F4',
      backgroundImage: 'radial-gradient(#FECDD3 1.2px, transparent 0)',
      backgroundSize: '16px 16px'
    }
  },
  { 
    id: 'polaroid-classic', 
    name: 'Polaroid Classic 📸', 
    hex: '#F8F7F4',
    text: '#222222', 
    border: 'rgba(0, 0, 0, 0.08)',
    customBg: { backgroundColor: '#F8F7F4' }
  },
  { 
    id: 'retro-film', 
    name: 'Retro Film Strip 🎞️', 
    hex: '#0A0A0A',
    text: '#E5E5E5', 
    border: '#2A2A2A',
    customBg: { backgroundColor: '#0A0A0A' }
  },
  { 
    id: 'vintage-news', 
    name: 'Daily Archive 📰', 
    hex: '#F3EFE8',
    text: '#111111', 
    border: '#111111',
    customBg: { backgroundColor: '#F3EFE8' }
  },
  { 
    id: 'postage-stamp', 
    name: 'Vintage Stamp ✉️', 
    hex: '#F4F0E6',
    text: '#222222', 
    border: '#222222',
    customBg: { backgroundColor: '#F4F0E6' }
  }
];

const FILTERS = [
  { id: 'original', name: 'Original', style: 'none' },
  { id: 'soft-blush', name: 'Soft & Sweet 🌸', style: 'brightness(104%) contrast(98%) saturate(110%) sepia(8%)' },
  { id: 'bw', name: 'Cinematic B&W', style: 'grayscale(100%) contrast(115%) brightness(105%)' },
  { id: 'warm', name: 'Warm Vintage', style: 'sepia(30%) contrast(95%) saturate(95%) brightness(102%)' },
  { id: 'cold', name: 'Cold Chrome', style: 'saturate(115%) hue-rotate(185deg) contrast(108%) brightness(100%)' }
];

const getPhotoWidth = (themeId, layout) => {
  if (layout === 'vertical') {
    switch (themeId) {
      case 'retro-film': return '248px';
      case 'vintage-news': return '276px';
      case 'postage-stamp': return '272px';
      case 'polaroid-classic': return '284px';
      default: return '272px';
    }
  } else {
    // grid layout
    switch (themeId) {
      case 'retro-film': return '184px';
      case 'postage-stamp': return '196px';
      case 'vintage-news': return '202px';
      case 'polaroid-classic': return '202px';
      default: return '200px';
    }
  }
};

const getPhotoHeight = (themeId, layout) => {
  if (layout === 'vertical') {
    switch (themeId) {
      case 'retro-film': return '152px';
      case 'vintage-news': return '158px';
      case 'postage-stamp': return '154px';
      case 'polaroid-classic': return '158px';
      default: return '154px';
    }
  } else {
    // grid layout
    switch (themeId) {
      case 'retro-film': return '170px';
      case 'vintage-news': return '186px';
      case 'postage-stamp': return '180px';
      case 'polaroid-classic': return '188px';
      default: return '180px';
    }
  }
};

export default function EditorScreen({ photos, onRetake }) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [layout, setLayout] = useState('vertical'); // 'vertical' or 'grid'
  const [studioName, setStudioName] = useState('AYA STUDIO 🌸');
  const [dateStr, setDateStr] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImage, setExportedImage] = useState(null);
  const printRef = useRef(null);
  const blobUrlRef = useRef(null);

  // Clean up blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const triggerDownload = (url) => {
    if (!url) return;
    const link = document.createElement('a');
    link.download = `aya-miniphotobox-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (url) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], `aya-miniphotobox-${Date.now()}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Photostrip Aya 🌸',
          text: 'Hasil foto dari Webcam Aya Studio 🌸',
        });
        return;
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn("Share failed:", e);
      }
    }
    // Fallback if sharing is cancelled or not supported
    triggerDownload(url);
  };

  const handleDownload = async () => {
    if (!printRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      const images = printRef.current.querySelectorAll('img');
      const loadPromises = Array.from(images).map(img => {
        if (img.complete && img.naturalWidth > 0) {
          return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        }
        return new Promise(resolve => {
          img.onload = () => {
            if (img.decode) img.decode().catch(() => {}).then(resolve);
            else resolve();
          };
          img.onerror = resolve;
        });
      });
      await Promise.all(loadPromises);
      
      await new Promise(resolve => setTimeout(resolve, 200));

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const renderOptions = {
        pixelRatio: isMobile ? 2 : 3, // Safe 2x for mobile canvas memory limits, 3x on desktop
        skipFonts: true, // Prevents CORS SecurityError on fonts.googleapis.com
        style: {
          transform: 'none',
          left: '0',
          top: '0',
        },
        width: layout === 'vertical' ? 320 : 460,
        height: layout === 'vertical' ? 860 : 580,
        cacheBust: true,
      };
      
      // Generate actual binary PNG Blob for guaranteed .png download
      let blob = await htmlToImage.toBlob(printRef.current, renderOptions);

      if (!blob) {
        // Fallback: generate via toPng and convert base64 into a PNG Blob
        const dataUrl = await htmlToImage.toPng(printRef.current, renderOptions);
        const parts = dataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const binaryStr = atob(parts[1]);
        const len = binaryStr.length;
        const u8arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          u8arr[i] = binaryStr.charCodeAt(i);
        }
        blob = new Blob([u8arr], { type: mime });
      }

      // Revoke previous blob if any
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      const blobUrl = URL.createObjectURL(blob);
      blobUrlRef.current = blobUrl;
      setExportedImage(blobUrl);
      
      // On mobile, attempt Web Share API first so users can directly "Save Image" to their phone Gallery / Camera Roll
      if (isMobile && navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], `aya-miniphotobox-${Date.now()}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Photostrip Aya 🌸',
              text: 'Hasil foto dari Webcam Aya Studio 🌸',
            });
            return;
          }
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.warn("Mobile share not completed:", shareErr);
          }
        }
      }

      // Automatically trigger browser download
      triggerDownload(blobUrl);
    } catch (err) {
      console.error("Failed to generate photostrip image:", err);
      alert("Pemberitahuan: Terjadi kendala saat merender gambar PNG. Silakan coba kembali atau tekan lama pada foto untuk menyimpan.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onRetake}
          className="text-pink-900/75 hover:text-pink-950 font-medium transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-pink-500" />
          <span>Retake / Foto Ulang</span>
        </button>
        <span className="text-xs tracking-widest text-pink-800 font-bold uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          Webcam Aya Editor 🌸
        </span>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls - Left side */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full bg-white/85 backdrop-blur-xl rounded-[32px] p-6 border-2 border-pink-200/80 order-2 lg:order-1 shadow-xl shadow-pink-200/30">
          
          {/* Section 1: Layout Selector */}
          <div>
            <label className="text-xs font-bold tracking-wider text-[#4a154b] uppercase flex items-center gap-2 mb-3">
              <Layers className="w-3.5 h-3.5 text-pink-500" />
              1. Layout / Tata Letak
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLayout('vertical')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  layout === 'vertical'
                    ? 'border-pink-400 bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-300/50'
                    : 'border-pink-200 bg-white text-pink-900/70 hover:border-pink-300 hover:bg-pink-50/50'
                }`}
              >
                Classic 4-Strip 🎀
              </button>
              <button
                onClick={() => setLayout('grid')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  layout === 'grid'
                    ? 'border-pink-400 bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-300/50'
                    : 'border-pink-200 bg-white text-pink-900/70 hover:border-pink-300 hover:bg-pink-50/50'
                }`}
              >
                2x2 Modern Grid ✨
              </button>
            </div>
          </div>

          {/* Section 2: Frame Concept Selector */}
          <div>
            <label className="text-xs font-bold tracking-wider text-[#4a154b] uppercase flex items-center gap-2 mb-3">
              <Palette className="w-3.5 h-3.5 text-pink-500" />
              2. Template Cewek Kalem & Pastel 🌸
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    selectedTheme.id === theme.id
                      ? 'border-pink-400 bg-pink-100/90 text-[#4a154b] font-bold shadow-sm ring-2 ring-pink-300/40'
                      : 'border-pink-200/80 bg-white text-pink-900/80 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: theme.hex }}
                  />
                  <span className="text-xs truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Preset Filter */}
          <div>
            <label className="text-xs font-bold tracking-wider text-[#4a154b] uppercase flex items-center gap-2 mb-3">
              <Sliders className="w-3.5 h-3.5 text-pink-500" />
              3. Preset Filter
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter)}
                  className={`py-2.5 px-3 rounded-xl border text-[11px] font-bold tracking-wide transition-all cursor-pointer truncate ${
                    selectedFilter.id === filter.id
                      ? 'border-pink-400 bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm'
                      : 'border-pink-200/80 bg-white text-pink-900/80 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Text Customization */}
          <div>
            <label className="text-xs font-bold tracking-wider text-[#4a154b] uppercase flex items-center gap-2 mb-3">
              <Type className="w-3.5 h-3.5 text-pink-500" />
              4. Branding Text / Teks Custom
            </label>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-pink-900/70 font-semibold block mb-1">Nama Studio / Teks Utama</span>
                <input
                  type="text"
                  maxLength={25}
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value.toUpperCase())}
                  className="w-full bg-pink-50/70 border border-pink-200/90 rounded-xl px-4 py-2.5 text-xs text-[#4a154b] font-semibold placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white"
                  placeholder="e.g. AYA STUDIO 🌸"
                />
              </div>
              <div>
                <span className="text-[10px] text-pink-900/70 font-semibold block mb-1">Tanggal / Momen</span>
                <input
                  type="text"
                  maxLength={18}
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full bg-pink-50/70 border border-pink-200/90 rounded-xl px-4 py-2.5 text-xs text-[#4a154b] font-semibold placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white"
                  placeholder="e.g. 2026.06.23"
                />
              </div>
            </div>
          </div>

          {/* Export Action */}
          <div className="mt-2 pt-4 border-t border-pink-200/70 flex flex-col gap-3">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className={`w-full py-4 px-6 rounded-full font-bold tracking-wider text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 cursor-pointer ${
                isExporting
                  ? 'bg-pink-300/50 text-pink-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white shadow-pink-300/60 hover:shadow-2xl hover:shadow-pink-300/80 hover:scale-[1.02] active:scale-98'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Sedang merender PNG jernih...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Photostrip Aya 🌸</span>
                </>
              )}
            </button>
            <button
              onClick={onRetake}
              className="w-full py-3 px-6 rounded-full border border-pink-200 bg-white text-pink-900/75 hover:text-pink-950 hover:bg-pink-50/80 text-xs font-semibold transition-all cursor-pointer"
            >
              Foto Ulang / Ambil Pose Baru
            </button>
          </div>

        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center w-full min-h-[500px] bg-white/70 backdrop-blur-xl rounded-[32px] p-6 border-2 border-pink-200/80 order-1 lg:order-2 shadow-xl shadow-pink-200/30">
          
          <div className="text-xs font-bold text-pink-900/70 tracking-widest uppercase mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Hasil Print Preview</span>
          </div>

          <div className="w-full flex items-center justify-center overflow-auto py-2">
            
            {/* Visual Scaling Wrapper */}
            <div className="origin-top transition-transform duration-300 scale-[0.55] sm:scale-[0.75] md:scale-90 lg:scale-[0.62] xl:scale-[0.85]"
              style={{
                height: layout === 'vertical' ? '860px' : '580px',
                width: layout === 'vertical' ? '320px' : '460px'
              }}>
              
              {/* FIXED SIZE ELEMENT TO BE CAPTURED BY HTML2IMAGE */}
              <div
                ref={printRef}
                id="photo-strip-capture"
                className="shadow-2xl flex flex-col justify-between overflow-hidden relative"
                style={{
                  width: layout === 'vertical' ? '320px' : '460px',
                  height: layout === 'vertical' ? '860px' : '580px',
                  ...selectedTheme.customBg,
                  color: selectedTheme.text,
                  padding: selectedTheme.id === 'retro-film'
                    ? (layout === 'vertical' ? '20px 36px 18px 36px' : '24px 40px 18px 40px')
                    : selectedTheme.id === 'vintage-news'
                      ? (layout === 'vertical' ? '42px 22px 18px 22px' : '48px 22px 18px 22px')
                      : selectedTheme.id === 'postage-stamp'
                        ? (layout === 'vertical' ? '20px 24px 18px 24px' : '24px 28px 18px 28px')
                        : (layout === 'vertical' ? '36px 24px 18px 24px' : '28px 24px 18px 24px'),
                  transition: 'background-color 0.3s ease, color 0.3s ease'
                }}
              >
                
                {/* 1. Sakura Blossom Custom Graphics */}
                {selectedTheme.id === 'sakura-blush' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-pink-200 text-[8px] font-medium tracking-[0.2em] text-[#5C2943] select-none whitespace-nowrap shadow-xs">
                      <span>🌸</span>
                      <span>SAKURA ARCHIVE · AYA'S MOMENTS</span>
                      <span>🌸</span>
                    </div>
                    {/* Delicate Corner Sakura Petals */}
                    <div className="absolute top-2 left-2 text-pink-300/80 text-sm select-none pointer-events-none">🌸</div>
                    <div className="absolute top-2 right-2 text-pink-300/80 text-sm select-none pointer-events-none">🌸</div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-light tracking-[0.25em] text-[#5C2943]/60 uppercase select-none z-20 whitespace-nowrap">
                      ✧ blooming quietly in soft light ✧
                    </div>
                  </>
                )}

                {/* 2. Matcha & Sage Calm Custom Graphics */}
                {selectedTheme.id === 'matcha-sage' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-[#95B8A6]/60 text-[8px] font-medium tracking-[0.2em] text-[#264234] select-none whitespace-nowrap shadow-xs">
                      <span>🌿</span>
                      <span>BOTANICAL ARCHIVE · SERENE</span>
                      <span>🌿</span>
                    </div>
                    <div className="absolute top-2.5 left-3 text-[#95B8A6] text-xs select-none pointer-events-none">🍃</div>
                    <div className="absolute top-2.5 right-3 text-[#95B8A6] text-xs select-none pointer-events-none">🍃</div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-light tracking-[0.25em] text-[#264234]/60 uppercase select-none z-20 whitespace-nowrap">
                      calm mind · gentle soul · table for one
                    </div>
                  </>
                )}

                {/* 3. Coquette Soft Ribbon Custom Graphics */}
                {selectedTheme.id === 'coquette-ribbon' && (
                  <>
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center select-none pointer-events-none">
                      {/* Ribbon Bow SVG */}
                      <svg width="34" height="20" viewBox="0 0 40 24" fill="none">
                        <path d="M20 12C15 6 7 6 5 11C3 16 11 17 20 12Z" fill="#E8A5A5" opacity="0.9" />
                        <path d="M20 12C25 6 33 6 35 11C37 16 29 17 20 12Z" fill="#E8A5A5" opacity="0.9" />
                        <circle cx="20" cy="12" r="3" fill="#D98282" />
                        <path d="M18 14C16 18 13 22 10 23" stroke="#D98282" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M22 14C24 18 27 22 30 23" stroke="#D98282" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 z-20 text-[7px] font-serif italic tracking-[0.2em] text-[#523438] select-none whitespace-nowrap">
                      dear diary · aya's sweet story 🎀
                    </div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-serif italic tracking-[0.25em] text-[#523438]/70 select-none whitespace-nowrap">
                      ♡ soft hearts & sweet dreams ♡
                    </div>
                  </>
                )}

                {/* 4. Lavender Dream Custom Graphics */}
                {selectedTheme.id === 'lavender-dream' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-purple-200 text-[8px] font-medium tracking-[0.2em] text-[#3B2961] select-none whitespace-nowrap shadow-xs">
                      <span>✦</span>
                      <span>LAVENDER DREAM · AYA</span>
                      <span>✦</span>
                    </div>
                    <span className="absolute top-3 left-4 text-purple-400/80 text-[10px] select-none pointer-events-none">✦</span>
                    <span className="absolute top-3 right-4 text-purple-400/80 text-[10px] select-none pointer-events-none">✧</span>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-light tracking-[0.25em] text-[#3B2961]/60 uppercase select-none z-20 whitespace-nowrap">
                      under the pastel night sky ☾
                    </div>
                  </>
                )}

                {/* 5. Baby Blue Serenity Custom Graphics */}
                {selectedTheme.id === 'baby-blue' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-sky-200 text-[8px] font-medium tracking-[0.2em] text-[#1E3A5F] select-none whitespace-nowrap shadow-xs">
                      <span>☁️</span>
                      <span>CLEAR SKIES · PEACEFUL MOMENTS</span>
                      <span>☁️</span>
                    </div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-light tracking-[0.25em] text-[#1E3A5F]/60 uppercase select-none z-20 whitespace-nowrap">
                      breathe softly · serene & pure
                    </div>
                  </>
                )}

                {/* 6. Cozy Vanilla Cafe Custom Graphics */}
                {selectedTheme.id === 'vanilla-cafe' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-[#DBC5AF] text-[8px] font-medium tracking-[0.2em] text-[#483526] select-none whitespace-nowrap shadow-xs">
                      <span>☕</span>
                      <span>AYA'S COZY CAFE ARCHIVE</span>
                      <span>☕</span>
                    </div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-[0.2em] text-[#483526]/60 uppercase select-none z-20 whitespace-nowrap">
                      REC #0623 · WARM BLEND & SOFT LIGHT
                    </div>
                  </>
                )}

                {/* 7. Strawberry Milk Custom Graphics */}
                {selectedTheme.id === 'strawberry-milk' && (
                  <>
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/70 border border-rose-200 text-[8px] font-medium tracking-[0.2em] text-[#702236] select-none whitespace-nowrap shadow-xs">
                      <span>🍓</span>
                      <span>STRAWBERRY MILK DIARY</span>
                      <span>🍓</span>
                    </div>
                    <div className="absolute top-2.5 left-3 text-rose-400 text-xs select-none pointer-events-none">♡</div>
                    <div className="absolute top-2.5 right-3 text-rose-400 text-xs select-none pointer-events-none">♡</div>
                    <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 text-[7px] font-light tracking-[0.25em] text-[#702236]/60 uppercase select-none z-20 whitespace-nowrap">
                      sweet moments with aya ♡
                    </div>
                  </>
                )}

                {/* Retro 35mm Film Strip Custom Graphics */}
                {selectedTheme.id === 'retro-film' && (
                  <>
                    <div className="absolute left-2.5 top-0 bottom-0 w-3 flex flex-col justify-between py-4 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 12 : 8 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-4 bg-[#1E1E1E] rounded-[2px] border border-white/10" />
                      ))}
                    </div>
                    <div className="absolute right-2.5 top-0 bottom-0 w-3 flex flex-col justify-between py-4 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 12 : 8 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-4 bg-[#1E1E1E] rounded-[2px] border border-white/10" />
                      ))}
                    </div>
                    <div className="absolute left-7 top-[15%] text-[7px] font-mono tracking-[0.3em] text-white/35 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                      KODAK 400TX
                    </div>
                    <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[7px] font-mono tracking-[0.3em] text-white/35 select-none z-20 uppercase"
                         style={{ writingMode: 'vertical-rl' }}>
                      ▲ 12A
                    </div>
                  </>
                )}

                {/* Vintage Newspaper Custom Graphics */}
                {selectedTheme.id === 'vintage-news' && (
                  <>
                    <div className="absolute inset-2 border-4 border-double border-[#111111] pointer-events-none z-10" />
                    <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-20 border-b border-[#111111] pb-1">
                      <span className="text-[7px] font-serif italic font-bold text-[#111111]">DAILY ARCHIVE</span>
                      <span className="text-[7px] font-mono text-[#111111] tracking-widest">N° 1994</span>
                    </div>
                  </>
                )}

                {/* Vintage Postage Stamp Custom Graphics */}
                {selectedTheme.id === 'postage-stamp' && (
                  <>
                    <div className="absolute -left-1.5 top-0 bottom-0 w-3 flex flex-col justify-between py-6 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 18 : 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#FFF5F8] rounded-full border border-black/5" />
                      ))}
                    </div>
                    <div className="absolute -right-1.5 top-0 bottom-0 w-3 flex flex-col justify-between py-6 z-20 pointer-events-none">
                      {Array.from({ length: layout === 'vertical' ? 18 : 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#FFF5F8] rounded-full border border-black/5" />
                      ))}
                    </div>
                    <div className="absolute top-2 right-6 w-12 h-12 rounded-full border border-[#222222]/30 flex flex-col items-center justify-center text-[5px] font-mono text-[#222222]/40 select-none z-20 rotate-12 pointer-events-none">
                      <div className="border-b border-[#222222]/20 w-10 text-center pb-0.5 font-bold">AIR MAIL</div>
                      <div className="pt-0.5 tracking-widest leading-none">POSTAGE</div>
                    </div>
                  </>
                )}

                {/* 4-Strip Vertical Layout */}
                {layout === 'vertical' && (
                  <div className="flex flex-col gap-3 h-[730px] justify-between pt-1">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className="flex flex-col flex-shrink-0 items-center"
                      >
                        <div
                          className={`overflow-hidden relative transition-all ${
                            selectedTheme.id === 'polaroid-classic' 
                              ? 'p-2 pb-6 bg-white border border-gray-200/60 shadow-[0_4px_10px_rgba(0,0,0,0.06)]' 
                              : selectedTheme.id === 'sakura-blush'
                                ? 'p-1.5 pb-2 bg-white rounded-lg border border-pink-200/80 shadow-[0_4px_12px_rgba(251,207,232,0.35)]'
                                : selectedTheme.id === 'matcha-sage'
                                  ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#95B8A6]/60 shadow-[0_4px_10px_rgba(149,184,166,0.25)]'
                                  : selectedTheme.id === 'coquette-ribbon'
                                    ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#E8BFB8]/70 shadow-[0_4px_12px_rgba(232,191,184,0.35)]'
                                    : selectedTheme.id === 'lavender-dream'
                                      ? 'p-1.5 pb-2 bg-white rounded-lg border border-purple-200 shadow-[0_4px_12px_rgba(196,181,253,0.35)]'
                                      : selectedTheme.id === 'baby-blue'
                                        ? 'p-1.5 pb-2 bg-white rounded-lg border border-sky-200 shadow-[0_4px_12px_rgba(186,230,253,0.35)]'
                                        : selectedTheme.id === 'vanilla-cafe'
                                          ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#DBC5AF]/70 shadow-[0_4px_10px_rgba(219,197,175,0.3)]'
                                          : selectedTheme.id === 'strawberry-milk'
                                            ? 'p-1.5 pb-2 bg-white rounded-lg border border-rose-200 shadow-[0_4px_12px_rgba(253,164,175,0.35)]'
                                            : selectedTheme.id === 'postage-stamp'
                                              ? 'p-1 bg-[#F4F0E6] border border-dashed border-[#222222] shadow-sm'
                                              : 'p-1 bg-white border border-gray-200 shadow-sm'
                          }`}
                          style={{ 
                            width: getPhotoWidth(selectedTheme.id, 'vertical'),
                            height: getPhotoHeight(selectedTheme.id, 'vertical'),
                          }}
                        >
                          {/* Corner cute decorative tags */}
                          {selectedTheme.id === 'sakura-blush' && (
                            <div className="absolute top-2 right-2 text-[8px] text-pink-400 select-none z-10">🌸</div>
                          )}
                          {selectedTheme.id === 'matcha-sage' && (
                            <div className="absolute top-2 right-2 text-[8px] text-[#95B8A6] select-none z-10">🍃</div>
                          )}
                          {selectedTheme.id === 'coquette-ribbon' && (
                            <div className="absolute top-2 right-2 text-[8px] text-[#D98282] select-none z-10">🎀</div>
                          )}
                          {selectedTheme.id === 'lavender-dream' && (
                            <div className="absolute top-2 right-2 text-[8px] text-purple-400 select-none z-10">✧</div>
                          )}
                          {selectedTheme.id === 'strawberry-milk' && (
                            <div className="absolute top-2 right-2 text-[8px] text-rose-400 select-none z-10">♡</div>
                          )}

                          {/* Film frame numbering */}
                          {selectedTheme.id === 'retro-film' && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white/80 font-mono text-[6px] px-1 py-0.5 rounded border border-white/5 z-10 select-none leading-none">
                              #{index + 1}
                            </div>
                          )}

                          <img
                            src={src}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover rounded-[4px]"
                            style={{ filter: selectedFilter.style }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2x2 Modern Grid Layout */}
                {layout === 'grid' && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 h-[460px] content-start pt-1 px-1 justify-items-center">
                    {photos.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`overflow-hidden relative transition-all ${
                            selectedTheme.id === 'polaroid-classic' 
                              ? 'p-2 pb-5 bg-white border border-gray-200/60 shadow-[0_4px_10px_rgba(0,0,0,0.06)]' 
                              : selectedTheme.id === 'sakura-blush'
                                ? 'p-1.5 pb-2 bg-white rounded-lg border border-pink-200/80 shadow-[0_4px_10px_rgba(251,207,232,0.35)]'
                                : selectedTheme.id === 'matcha-sage'
                                  ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#95B8A6]/60 shadow-[0_4px_10px_rgba(149,184,166,0.25)]'
                                  : selectedTheme.id === 'coquette-ribbon'
                                    ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#E8BFB8]/70 shadow-[0_4px_10px_rgba(232,191,184,0.35)]'
                                    : selectedTheme.id === 'lavender-dream'
                                      ? 'p-1.5 pb-2 bg-white rounded-lg border border-purple-200 shadow-[0_4px_10px_rgba(196,181,253,0.35)]'
                                      : selectedTheme.id === 'baby-blue'
                                        ? 'p-1.5 pb-2 bg-white rounded-lg border border-sky-200 shadow-[0_4px_10px_rgba(186,230,253,0.35)]'
                                        : selectedTheme.id === 'vanilla-cafe'
                                          ? 'p-1.5 pb-2 bg-white rounded-lg border border-[#DBC5AF]/70 shadow-[0_4px_10px_rgba(219,197,175,0.3)]'
                                          : selectedTheme.id === 'strawberry-milk'
                                            ? 'p-1.5 pb-2 bg-white rounded-lg border border-rose-200 shadow-[0_4px_10px_rgba(253,164,175,0.35)]'
                                            : selectedTheme.id === 'postage-stamp'
                                              ? 'p-1 bg-[#F4F0E6] border border-dashed border-[#222222] shadow-sm'
                                              : 'p-1 bg-white border border-gray-200 shadow-sm'
                          }`}
                          style={{ 
                            width: getPhotoWidth(selectedTheme.id, 'grid'),
                            height: getPhotoHeight(selectedTheme.id, 'grid'),
                          }}
                        >
                          {selectedTheme.id === 'sakura-blush' && (
                            <div className="absolute top-2 right-2 text-[8px] text-pink-400 select-none z-10">🌸</div>
                          )}
                          {selectedTheme.id === 'coquette-ribbon' && (
                            <div className="absolute top-2 right-2 text-[8px] text-[#D98282] select-none z-10">🎀</div>
                          )}
                          {selectedTheme.id === 'strawberry-milk' && (
                            <div className="absolute top-2 right-2 text-[8px] text-rose-400 select-none z-10">♡</div>
                          )}

                          {selectedTheme.id === 'retro-film' && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white/80 font-mono text-[6px] px-1 py-0.5 rounded border border-white/5 z-10 select-none leading-none">
                              #{index + 1}
                            </div>
                          )}

                          <img
                            src={src}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover rounded-[4px]"
                            style={{ filter: selectedFilter.style }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Branding footer */}
                <div 
                  className={`flex flex-col items-center justify-center text-center shrink-0 ${
                    layout === 'vertical' ? 'h-[76px]' : 'h-[60px] mt-2'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center px-4 py-1">
                    <h4 
                      className={`font-bold uppercase leading-none mb-1 ${
                        selectedTheme.id === 'retro-film'
                          ? 'font-mono text-xs tracking-widest'
                          : selectedTheme.id === 'polaroid-classic' || selectedTheme.id === 'coquette-ribbon'
                            ? 'font-serif italic text-sm tracking-wider'
                            : selectedTheme.id === 'vintage-news' || selectedTheme.id === 'postage-stamp'
                              ? 'font-serif text-sm tracking-[0.25em]'
                              : 'font-sans text-sm tracking-[0.2em]'
                      }`}
                      style={{ color: selectedTheme.text }}
                    >
                      {studioName || 'AYA STUDIO 🌸'}
                    </h4>
                    
                    <p 
                      className={`text-[9px] tracking-widest font-light opacity-75 ${
                        selectedTheme.id === 'retro-film'
                          ? 'font-mono'
                          : ''
                      }`}
                      style={{ color: selectedTheme.text }}
                    >
                      {dateStr || '2026.06.23'}
                    </p>
                  </div>
                </div>

              </div>
              {/* END OF FIXED SIZE ELEMENT */}

            </div>
          </div>
        </div>

      </div>

      {/* Modal for Mobile Saving / Image Preview */}
      {exportedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white border-2 border-pink-200 rounded-[32px] p-6 max-w-md w-full flex flex-col items-center gap-4 shadow-2xl relative animate-scaleUp">
            
            <button 
              onClick={() => setExportedImage(null)}
              className="absolute top-4 right-4 text-pink-700 hover:text-pink-950 bg-pink-100 hover:bg-pink-200 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            >
              ✕
            </button>
            
            <h3 className="text-base font-bold tracking-wider text-[#4a154b] uppercase text-center mt-2 flex items-center gap-1.5">
              <span>🌸 Foto Aya Berhasil Dibuat!</span>
            </h3>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/80 border border-pink-300/80 text-[11px] font-bold text-pink-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Format: File Gambar PNG (.png)</span>
            </div>
            
            <p className="text-xs text-pink-900/70 text-center max-w-xs leading-relaxed">
              Foto format <strong>.png</strong> resolusi tinggi berhasil digenerate! Pada HP, Anda juga bisa <strong>tekan lama gambar</strong> di bawah lalu pilih <strong>"Simpan ke Foto" / "Save Image"</strong>.
            </p>
            
            {/* Displayed Image */}
            <div className="w-full flex justify-center py-2 max-h-[50vh] overflow-y-auto">
              <img 
                src={exportedImage} 
                className="max-h-[45vh] w-auto rounded-xl shadow-xl border border-pink-200/80 object-contain select-auto"
                alt="Captured photostrip"
              />
            </div>
            
            <div className="w-full flex flex-col gap-2.5 mt-2">
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleShare(exportedImage)}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white rounded-full text-xs font-bold text-center shadow-lg shadow-pink-300/50 hover:shadow-xl transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span>Simpan ke Galeri / Bagikan 📱</span>
                </button>
                <button
                  onClick={() => triggerDownload(exportedImage)}
                  className="flex-1 py-3.5 px-4 bg-white border-2 border-pink-300 hover:bg-pink-50 text-pink-900 rounded-full text-xs font-bold text-center shadow-sm transition-all cursor-pointer hover:scale-102 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-pink-600" />
                  <span>Unduh File PNG 💾</span>
                </button>
              </div>
              <button
                onClick={() => setExportedImage(null)}
                className="w-full py-2.5 bg-pink-100/80 border border-pink-200 rounded-full text-xs font-bold text-pink-900 hover:bg-pink-200/80 transition-all cursor-pointer"
              >
                Tutup / Close
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
