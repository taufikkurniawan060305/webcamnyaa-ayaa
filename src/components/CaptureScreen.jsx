import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertCircle, ArrowRight, Sparkles, Heart, Upload } from 'lucide-react';

export default function CaptureScreen({ onPhotosCaptured, onBack }) {
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    const readPromises = files.slice(0, 4).map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(loadedPhotos => {
      while (loadedPhotos.length < 4) {
        loadedPhotos.push(loadedPhotos[loadedPhotos.length - 1] || loadedPhotos[0]);
      }
      onPhotosCaptured(loadedPhotos);
    });
  };

  // Bind camera stream to the video element once it is rendered in the DOM
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Initialize camera and request permissions
  useEffect(() => {
    let activeStream = null;

    async function initCamera() {
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const videoConstraints = isMobile 
          ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        // Step 1: Request permission using standard video constraints to trigger dialog
        const initialStream = await navigator.mediaDevices.getUserMedia({ 
          video: videoConstraints 
        });
        
        activeStream = initialStream;
        setStream(initialStream);

        // Step 2: Enumerate devices (will be fully populated since permission is granted)
        const devs = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devs.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);

        if (videoDevs.length > 0) {
          const frontCam = videoDevs.find(d => d.label.toLowerCase().includes('front') || d.label.toLowerCase().includes('user'));
          const defaultDevice = frontCam ? frontCam.deviceId : videoDevs[0].deviceId;
          
          // Match the active track to find if its device matches
          const activeTrack = initialStream.getVideoTracks()[0];
          const activeSettings = activeTrack ? activeTrack.getSettings() : {};
          
          setSelectedDeviceId(activeSettings.deviceId || defaultDevice);
        }
        setError(null);
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please make sure permissions are granted and no other application is using your webcam.");
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle camera device switching
  useEffect(() => {
    if (!selectedDeviceId || !stream) return;
    
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    // Stop current stream before requesting the new one
    stream.getTracks().forEach(track => track.stop());

    navigator.mediaDevices.getUserMedia({
      video: { 
        deviceId: { exact: selectedDeviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    .then(mediaStream => {
      setStream(mediaStream);
      setError(null);
    })
    .catch(err => {
      console.error("Error switching camera device:", err);
    });
  }, [selectedDeviceId]);

  // Handle switching camera device
  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  // Start the automated 4-photo capture session
  const startCaptureSession = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPhotos([]);
    capturePhotosSequence();
  };

  const capturePhotosSequence = async () => {
    const captured = [];
    
    for (let i = 0; i < 4; i++) {
      setActivePhotoIndex(i);
      
      // 3-second countdown for each photo
      for (let count = 3; count > 0; count--) {
        setCountdown(count);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Trigger Flash & Photo Capture
      setCountdown('FLASH!');
      setFlash(true);
      captureSinglePhoto(captured);
      
      // Keep flash active briefly
      await new Promise(resolve => setTimeout(resolve, 150));
      setFlash(false);
      setCountdown(null);

      // Wait 2 seconds between photos so the user can pose for the next one
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsCapturing(false);
    setActivePhotoIndex(null);
    
    // Automatically transition to editor screen with the 4 captured photos
    setTimeout(() => {
      onPhotosCaptured(captured);
    }, 800);
  };

  // Capture a single frame from the video stream
  const captureSinglePhoto = (capturedList) => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Ensure dimensions are valid especially on mobile devices
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    
    if (!videoWidth || !videoHeight) {
      videoWidth = video.clientWidth || 1280;
      videoHeight = video.clientHeight || 720;
    }
    
    // Calculate 4:3 box dimensions
    let cropWidth, cropHeight;
    if (videoWidth / videoHeight > 4 / 3) {
      cropHeight = videoHeight;
      cropWidth = videoHeight * (4 / 3);
    } else {
      cropWidth = videoWidth;
      cropHeight = videoWidth * (3 / 4);
    }
    
    const startX = (videoWidth - cropWidth) / 2;
    const startY = (videoHeight - cropHeight) / 2;

    canvas.width = 1200; // high-res
    canvas.height = 900;
    
    const ctx = canvas.getContext('2d');
    
    // Mirror the captured image to match screen preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    try {
      ctx.drawImage(
        video,
        startX, startY, cropWidth, cropHeight, // source video
        0, 0, canvas.width, canvas.height       // destination canvas
      );
    } catch (drawErr) {
      console.warn("drawImage fallback:", drawErr);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    capturedList.push(dataUrl);
    setPhotos([...capturedList]);
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 flex flex-col items-center">
      {/* Top navigation/bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          disabled={isCapturing}
          className="text-pink-900/75 hover:text-pink-950 font-medium transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm disabled:opacity-50 cursor-pointer"
        >
          &larr; Back / Kembali
        </button>

        {/* Private Booth Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-pink-300/80 text-[11px] text-pink-800 font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Aya's Private Studio</span>
        </div>

        {/* Camera Selector */}
        {devices.length > 1 ? (
          <div className="flex items-center gap-2 bg-white/80 border border-pink-300/80 rounded-full px-4 py-1.5 text-xs text-pink-800 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              disabled={isCapturing}
              className="bg-transparent border-none text-pink-900 focus:outline-none cursor-pointer pr-3 font-medium"
            >
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-white text-pink-900">
                  {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-xs text-pink-900/70 font-medium flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Smile, Aya! ✨</span>
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Preview (3 cols on large, 1 on mobile) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          {/* Aesthetic Pastel Border Container */}
          <div className="relative w-full max-w-2xl p-2 rounded-[36px] bg-gradient-to-tr from-pink-300 via-rose-200 to-purple-300 shadow-2xl shadow-pink-300/40">
            <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden border border-pink-200/40 bg-[#16121f] shadow-inner">
              
              {/* Webcam video component */}
              {stream && !error && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}

              {/* Viewfinder Cute Pastel Corners */}
              <div className="absolute top-4 left-4 text-pink-300 font-mono text-sm pointer-events-none select-none">
                ┌
              </div>
              <div className="absolute top-4 right-4 text-pink-300 font-mono text-sm pointer-events-none select-none">
                ┐
              </div>
              <div className="absolute bottom-4 left-4 text-pink-300 font-mono text-sm pointer-events-none select-none">
                └
              </div>
              <div className="absolute bottom-4 right-4 text-pink-300 font-mono text-sm pointer-events-none select-none">
                ┘
              </div>

              {/* Top Booth Header Tag */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-300/70 text-[10px] tracking-wider uppercase text-[#4a154b] font-bold flex items-center gap-1.5 select-none pointer-events-none shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                <span>WEBCAM AYA 🌸</span>
              </div>

              {/* Placeholder / Loading */}
              {!stream && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-200/90 gap-3">
                  <div className="w-9 h-9 border-2 border-pink-300/40 border-t-pink-300 rounded-full animate-spin" />
                  <span className="text-xs font-medium tracking-wide">Menghubungkan Kamera Aya...</span>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#16121f] text-pink-200/80 gap-3">
                  <AlertCircle className="w-10 h-10 text-pink-400" />
                  <p className="max-w-md text-xs font-light leading-relaxed">{error}</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    <button
                      onClick={() => setSelectedDeviceId(selectedDeviceId)}
                      className="px-5 py-2 bg-pink-500/10 border border-pink-300/20 rounded-full hover:bg-pink-500/20 text-pink-100 text-xs tracking-wider uppercase transition-all cursor-pointer"
                    >
                      Coba Hubungkan Ulang
                    </button>
                    <button
                      onClick={() => {
                        // Generate 4 cute pastel demo photo data URLs
                        const demoPhotos = ['#FBCFE8', '#DDD6FE', '#BAE6FD', '#FED7AA'].map((color, idx) => {
                          const c = document.createElement('canvas');
                          c.width = 800;
                          c.height = 600;
                          const ctx = c.getContext('2d');
                          ctx.fillStyle = color;
                          ctx.fillRect(0, 0, 800, 600);
                          ctx.fillStyle = '#4A154B';
                          ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(`Aya's Pose #${idx + 1} 🌸`, 400, 300);
                          return c.toDataURL('image/png');
                        });
                        onPhotosCaptured(demoPhotos);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200 text-[#4a154b] font-bold rounded-full hover:scale-105 transition-all text-xs tracking-wide cursor-pointer shadow-md"
                    >
                      Gunakan Foto Demo / Coba Editor 🎀
                    </button>
                  </div>
                </div>
              )}

              {/* Countdown Overlay with Soft Pastel Glow */}
              {countdown !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[3px] transition-all">
                  <div className="text-center animate-scaleUp">
                    <span className={`font-serif text-8xl md:text-9xl font-bold tracking-tight text-white drop-shadow-[0_0_35px_rgba(244,114,182,0.7)] ${countdown === 'FLASH!' ? 'text-pink-100 scale-110' : ''}`}>
                      {countdown}
                    </span>
                    {countdown !== 'FLASH!' && (
                      <p className="text-sm font-semibold text-pink-100 mt-3 tracking-widest uppercase drop-shadow-md">
                        Siap-siap berpose ya! 🌸
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Screen Flash Animation */}
              {flash && (
                <div className="absolute inset-0 bg-white/95 animate-flash z-50 pointer-events-none" />
              )}

              {/* Progress overlay / Capture counter */}
              {isCapturing && (
                <div className="absolute bottom-5 left-5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-pink-300/80 text-xs font-bold text-[#4a154b] tracking-wider shadow-sm">
                  Foto {photos.length + 1} / 4 🎀
                </div>
              )}
            </div>
          </div>

          {/* Capture Trigger */}
          <div className="mt-7 flex flex-col items-center gap-2.5">
            <button
              onClick={startCaptureSession}
              disabled={isCapturing || !stream}
              className={`px-10 py-4.5 md:px-14 md:py-4.5 rounded-full font-bold tracking-wide text-sm flex items-center gap-3 shadow-xl transition-all duration-300 select-none cursor-pointer ${
                isCapturing 
                  ? 'bg-pink-200/80 border border-pink-300 text-pink-700 cursor-not-allowed scale-95 shadow-none' 
                  : 'bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white shadow-pink-300/60 hover:shadow-2xl hover:shadow-pink-300/80 hover:scale-105 active:scale-95'
              }`}
            >
              <Camera className={`w-5 h-5 ${isCapturing ? 'animate-bounce text-pink-700' : 'text-white'}`} />
              <span>
                {isCapturing 
                  ? `Sedang Mengambil Foto (${photos.length + 1} / 4)...` 
                  : 'Ambil 4 Foto Sekarang 🌸'
                }
              </span>
            </button>
            <p className="text-xs text-pink-900/65 font-medium text-center">
              4 jepretan otomatis dengan hitungan 3 detik. Siapkan pose terbaikmu! ✨
            </p>

            {/* Mobile / Alternative Gallery Upload */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-xs font-semibold text-pink-800 hover:text-pink-950 bg-white/90 hover:bg-white border border-pink-300/80 px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-102"
            >
              <Upload className="w-3.5 h-3.5 text-pink-500" />
              <span>Atau Pilih 4 Foto dari Galeri HP 📁</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Sidebar (1 col on large, horizontal list on mobile) */}
        <div className="lg:col-span-1 flex flex-col gap-3.5 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-wider text-[#4a154b] uppercase">
              Hasil Foto Aya 🎀
            </h3>
            <span className="text-[11px] text-pink-800/70 font-semibold">
              {photos.length}/4
            </span>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 no-scrollbar justify-center">
            {[0, 1, 2, 3].map((index) => {
              const photo = photos[index];
              const isActive = activePhotoIndex === index;
              
              return (
                <div 
                  key={index}
                  className={`flex-shrink-0 w-24 h-18 lg:w-full lg:h-28 rounded-2xl overflow-hidden relative border transition-all duration-300 shadow-sm ${
                    isActive 
                      ? 'border-pink-400 ring-4 ring-pink-300/50 scale-102 shadow-lg shadow-pink-300/30' 
                      : photo 
                        ? 'border-pink-300/60 bg-white' 
                        : 'border-pink-200/80 bg-white/70'
                  }`}
                >
                  {photo ? (
                    <img 
                      src={photo} 
                      alt={`Capture ${index + 1}`} 
                      className="w-full h-full object-cover scale-x-[-1]" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400 text-xs font-semibold tracking-wide">
                      {isActive && isCapturing ? (
                        <div className="w-5 h-5 border-2 border-pink-400/40 border-t-pink-500 rounded-full animate-spin" />
                      ) : (
                        `Frame ${index + 1}`
                      )}
                    </div>
                  )}
                  {photo && (
                    <div className="absolute bottom-2 right-2 bg-[#4a154b]/80 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-white/40 shadow-xs">
                      {index + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick jump if done but somehow stuck */}
          {photos.length === 4 && !isCapturing && (
            <button
              onClick={() => onPhotosCaptured(photos)}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:scale-102 text-white text-xs font-bold rounded-2xl shadow-lg shadow-pink-300/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Lanjut ke Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
