import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'domain', label: 'Checking domain availability', icon: '🌐' },
  { id: 'social', label: 'Scanning social platforms', icon: '📱' },
  { id: 'similarity', label: 'Analyzing phonetic conflicts', icon: '🔊' },
  { id: 'visibility', label: 'Searching app stores & web', icon: '🔍' },
  { id: 'trademark', label: 'Researching trademarks', icon: '⚖️' },
  { id: 'analysis', label: 'Generating strategic report', icon: '📊' },
];

const ElegantLoader = ({ 
  brandName = 'your brand',
  progress = 0, 
  currentStep = 'starting',
  completedSteps = [],
  etaSeconds = 90 
}) => {
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [countdown, setCountdown] = useState(etaSeconds);
  const [pulseActive, setPulseActive] = useState(true);
  
  // Smooth progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedProgress(prev => {
        if (prev < progress) {
          return Math.min(prev + 1, progress);
        }
        return prev;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [progress]);
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Update ETA when it changes from backend
  useEffect(() => {
    if (etaSeconds > 0) {
      setCountdown(etaSeconds);
    }
  }, [etaSeconds]);
  
  // Pulse animation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds) => {
    if (seconds <= 0) return 'Almost done...';
    if (seconds < 60) return `~${seconds} seconds`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `~${mins}m ${secs}s`;
  };
  
  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (currentStep === stepId) return 'active';
    return 'pending';
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-violet-900/90 to-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4 ${pulseActive ? 'scale-105' : 'scale-100'} transition-transform duration-700`}>
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Analyzing "{brandName}"
            </h2>
            <p className="text-white/60 text-sm">
              Our AI is conducting a comprehensive brand evaluation
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm font-medium">Progress</span>
              <span className="text-white font-bold">{displayedProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${displayedProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
          
          {/* Steps List */}
          <div className="space-y-3 mb-8">
            {STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    status === 'completed' 
                      ? 'bg-green-500/20' 
                      : status === 'active' 
                        ? 'bg-violet-500/30 scale-[1.02]' 
                        : 'bg-white/5'
                  }`}
                >
                  {/* Status Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    status === 'completed' 
                      ? 'bg-green-500' 
                      : status === 'active' 
                        ? 'bg-violet-500' 
                        : 'bg-white/10'
                  }`}>
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : status === 'active' ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-white/40" />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      status === 'completed' 
                        ? 'text-green-300' 
                        : status === 'active' 
                          ? 'text-white' 
                          : 'text-white/40'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Step Emoji */}
                  <span className={`text-lg ${status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                    {step.icon}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* ETA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
              <span>Estimated time:</span>
              <span className="font-bold text-white">{formatTime(countdown)}</span>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-center text-white/40 text-xs mt-6 italic">
            "Good brand names are worth the wait"
          </p>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-violet-400/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ElegantLoader;
