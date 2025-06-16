import React, { useState, useEffect } from 'react';
import { Settings, Clock, Mail, ArrowRight } from 'lucide-react';

interface MaintenancePhase {
  name: string;
  duration: number; // in seconds
  progress: number; // percentage
}

interface MaintenanceStatus {
  progress: number;
  phaseIndex: number;
  currentPhase: MaintenancePhase;
  isComplete: boolean;
  remainingTimeSeconds: number;
  startTime: number;
  phases: MaintenancePhase[];
}

function App() {
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API base URL - adjust for your environment
  const API_BASE_URL = import.meta.env.PROD 
    ? '' // Same origin in production
    : 'http://localhost:3001'; // Development server

  // Fetch maintenance status from server
  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/maintenance/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMaintenanceStatus(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch maintenance status:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining time display format
  const getRemainingTime = (remainingSeconds: number) => {
    if (remainingSeconds <= 0) return "Complete";
    
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    
    if (remainingMinutes < 60) return `${remainingMinutes} minutes`;
    
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    
    if (minutes === 0) {
      return hours === 1 ? "1 hour" : `${hours} hours`;
    } else {
      return hours === 1 
        ? `1 hour ${minutes} minutes`
        : `${hours} hours ${minutes} minutes`;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMaintenanceStatus();

    // Set up polling to update status every 2 seconds
    const interval = setInterval(fetchMaintenanceStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <Settings className="w-12 h-12 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading maintenance status...</h1>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !maintenanceStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Unable to load maintenance status'}</p>
            <button 
              onClick={fetchMaintenanceStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { progress, currentPhase, isComplete, remainingTimeSeconds, phaseIndex, phases } = maintenanceStatus;
  const remainingTime = getRemainingTime(remainingTimeSeconds);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Icon Area */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-lg">
              <Settings 
                className={`w-12 h-12 text-blue-600 ${isComplete ? '' : 'animate-spin'}`} 
                style={{ animationDuration: '3s' }} 
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
          {isComplete ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-6 leading-tight">
                Maintenance
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {' '}Complete!
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                All systems are now operational. Thank you for your patience!
              </p>

              <div className="inline-flex items-center gap-3 bg-green-50 rounded-full px-6 py-3 mb-10 border border-green-100">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">System Online</span>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                We're Under
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}Maintenance
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                We're working hard to improve your experience. Our site will be back online shortly.
              </p>

              {/* Time Estimate - Dynamic based on progress */}
              <div className="inline-flex items-center gap-3 bg-blue-50 rounded-full px-6 py-3 mb-6 border border-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Estimated time remaining: {remainingTime}
                </span>
              </div>

              {/* Current Phase */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 text-sm font-medium">
                    {currentPhase.name}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Contact Section */}
          <div className="space-y-6 mb-10">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
              Need immediate assistance?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:smwsupport@arcadiamusicacademy.com" 
                className="group inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Contact Support</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-8 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  isComplete 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Phase Timeline */}
            <div className="mt-4 flex justify-between text-xs text-gray-400">
              {phases.slice(0, -1).map((phase: MaintenancePhase, index: number) => (
                <div 
                  key={index}
                  className={`transition-colors duration-300 ${
                    index <= phaseIndex ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {phase.progress}%
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>© 2025 arcadiamusicacademy.com. We appreciate your patience.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
