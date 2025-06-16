import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for maintenance state
let maintenanceState = {
  startTime: Date.now(),
  currentProgress: 0,
  currentPhaseIndex: 0,
  isComplete: false,
  lastUpdated: Date.now()
};

// Maintenance phases configuration
const maintenancePhases = [
  { name: 'Initializing maintenance', progress: 10, duration: 3 },
  { name: 'Backing up database', progress: 25, duration: 1800 }, // 30 minutes
  { name: 'Updating server components', progress: 45, duration: 600 }, // 10 minutes
  { name: 'Applying security patches', progress: 65, duration: 600 }, // 10 minutes
  { name: 'Optimizing performance', progress: 80, duration: 600 }, // 10 minutes
  { name: 'Running final tests', progress: 95, duration: 600 }, // 10 minutes
  { name: 'Maintenance complete', progress: 100, duration: 600 } // 10 minutes
];

// Calculate total duration in seconds
const totalDurationSeconds = maintenancePhases.reduce((total, phase) => total + phase.duration, 0);

// Function to calculate current progress based on elapsed time
function calculateCurrentProgress() {
  const now = Date.now();
  const elapsedSeconds = (now - maintenanceState.startTime) / 1000;
  
  if (elapsedSeconds >= totalDurationSeconds) {
    return {
      progress: 100,
      phaseIndex: maintenancePhases.length - 1,
      isComplete: true
    };
  }
  
  let accumulatedTime = 0;
  let currentPhaseIndex = 0;
  
  for (let i = 0; i < maintenancePhases.length; i++) {
    const phase = maintenancePhases[i];
    const phaseEndTime = accumulatedTime + phase.duration;
    
    if (elapsedSeconds <= phaseEndTime) {
      currentPhaseIndex = i;
      
      // Calculate progress within this phase
      const phaseStartProgress = i > 0 ? maintenancePhases[i - 1].progress : 0;
      const phaseProgressRange = phase.progress - phaseStartProgress;
      const phaseElapsedTime = elapsedSeconds - accumulatedTime;
      const phaseProgress = (phaseElapsedTime / phase.duration) * phaseProgressRange;
      
      const totalProgress = phaseStartProgress + phaseProgress;
      
      return {
        progress: Math.min(totalProgress, phase.progress),
        phaseIndex: currentPhaseIndex,
        isComplete: false
      };
    }
    
    accumulatedTime += phase.duration;
  }
  
  return {
    progress: 100,
    phaseIndex: maintenancePhases.length - 1,
    isComplete: true
  };
}

// API Routes

// Get current maintenance status
app.get('/api/maintenance/status', (req, res) => {
  const currentState = calculateCurrentProgress();
  
  // Update the stored state
  maintenanceState.currentProgress = currentState.progress;
  maintenanceState.currentPhaseIndex = currentState.phaseIndex;
  maintenanceState.isComplete = currentState.isComplete;
  maintenanceState.lastUpdated = Date.now();
  
  const currentPhase = maintenancePhases[currentState.phaseIndex] || maintenancePhases[maintenancePhases.length - 1];
  
  // Calculate remaining time
  const elapsedSeconds = (Date.now() - maintenanceState.startTime) / 1000;
  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
  
  res.json({
    progress: currentState.progress,
    phaseIndex: currentState.phaseIndex,
    currentPhase: currentPhase,
    isComplete: currentState.isComplete,
    remainingTimeSeconds: remainingSeconds,
    startTime: maintenanceState.startTime,
    phases: maintenancePhases
  });
});

// Reset maintenance (for testing purposes)
app.post('/api/maintenance/reset', (req, res) => {
  maintenanceState = {
    startTime: Date.now(),
    currentProgress: 0,
    currentPhaseIndex: 0,
    isComplete: false,
    lastUpdated: Date.now()
  };
  
  res.json({ message: 'Maintenance state reset', state: maintenanceState });
});

// Get server info
app.get('/api/info', (req, res) => {
  res.json({
    message: 'Maintenance Server Running',
    uptime: process.uptime(),
    startTime: maintenanceState.startTime
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Maintenance server running on port ${PORT}`);
  console.log(`Maintenance started at: ${new Date(maintenanceState.startTime).toISOString()}`);
  console.log(`Estimated completion: ${new Date(maintenanceState.startTime + totalDurationSeconds * 1000).toISOString()}`);
});

export default app;
