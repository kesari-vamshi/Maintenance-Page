# Maintenance Page with Server-Side State Persistence

A professional maintenance page built with React, TypeScript, and Express.js that maintains progress state on the server. The maintenance progress persists across page refreshes and only resets when the server restarts.

## Features

- **Server-Side State Management**: Maintenance progress is stored on the server and persists across page refreshes
- **Real-Time Progress Tracking**: Automatic progress updates through multiple maintenance phases
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Professional UI**: Modern gradient design with animations and transitions
- **Error Handling**: Graceful error handling with retry functionality
- **Docker Support**: Ready for containerized deployment
- **TypeScript**: Full type safety throughout the application

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js server with in-memory state storage
- **State Persistence**: Server maintains maintenance state until restart
- **Real-Time Updates**: Frontend polls server every 2 seconds for updates

## Maintenance Phases

The maintenance process includes 7 phases with realistic timing:

1. **Initializing maintenance** (3 seconds) - 10% progress
2. **Backing up database** (30 minutes) - 25% progress  
3. **Updating server components** (10 minutes) - 45% progress
4. **Applying security patches** (10 minutes) - 65% progress
5. **Optimizing performance** (10 minutes) - 80% progress
6. **Running final tests** (10 minutes) - 95% progress
7. **Maintenance complete** (10 minutes) - 100% progress

**Total Duration**: ~1 hour 20 minutes (realistic maintenance window)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd maintenance-page
npm install
```

2. **Start the backend server**:
```bash
npm run server
```
The server will start on `http://localhost:3001`

3. **In a new terminal, start the frontend**:
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

### Development
- `npm run dev` - Start Vite development server (frontend only)
- `npm run server` - Start Express.js backend server
- `npm run dev:server` - Start backend with nodemon (auto-restart)

### Production
- `npm run build` - Build the React app for production
- `npm start` - Build and start production server (serves built frontend + API)

### Utilities
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## API Endpoints

### GET `/api/maintenance/status`
Returns current maintenance status:
```json
{
  "progress": 45.2,
  "phaseIndex": 2,
  "currentPhase": {
    "name": "Updating server components",
    "progress": 45,
    "duration": 12
  },
  "isComplete": false,
  "remainingTimeSeconds": 28.5,
  "startTime": 1640995200000,
  "phases": [...]
}
```

### POST `/api/maintenance/reset`
Resets maintenance state (for testing):
```json
{
  "message": "Maintenance state reset",
  "state": { ... }
}
```

### GET `/api/info`
Returns server information:
```json
{
  "message": "Maintenance Server Running",
  "uptime": 123.45,
  "startTime": 1640995200000
}
```

## State Persistence Behavior

- **Page Refresh**: Progress continues from current state
- **Multiple Tabs**: All tabs show synchronized progress
- **Server Restart**: Maintenance resets to beginning
- **Network Issues**: Frontend shows error with retry option

## Docker Deployment

### Build and run with Docker:

```bash
# Build the image
docker build -t maintenance-page .

# Run the container
docker run -p 3001:3001 maintenance-page
```

The application will be available at `http://localhost:3001`

### Docker Compose (optional):

```yaml
version: '3.8'
services:
  maintenance-page:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
```

## Customization

### Modify Maintenance Duration

Edit `server/server.js` to change phase durations:

```javascript
const maintenancePhases = [
  { name: 'Initializing maintenance', progress: 10, duration: 30 }, // 30 seconds
  { name: 'Backing up database', progress: 25, duration: 120 }, // 2 minutes
  // ... modify as needed
];
```

### Update Company Information

Edit `src/App.tsx`:

```tsx
// Change company name
<p>© 2025 arcadiamusicacademy.com Name. We appreciate your patience.</p>

// Change support email
<a href="mailto:your-smwsupport@arcadiamusicacademy.com">
```

### Customize Styling

The app uses Tailwind CSS. Modify classes in `src/App.tsx` or extend the theme in `tailwind.config.js`.

## Environment Variables

### Frontend (Vite)
- `VITE_API_URL` - Override API base URL (optional)

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## Troubleshooting

### Common Issues

1. **"Failed to connect to server"**
   - Ensure backend server is running on port 3001
   - Check if ports are available
   - Verify API_BASE_URL in frontend

2. **TypeScript errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript version compatibility

3. **Build failures**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Ensure Node.js version is 18+

### Development Tips

- Use browser dev tools to monitor API calls
- Check server console for backend logs
- Use `npm run dev:server` for auto-restart during development

## License

MIT License - feel free to use this project for your maintenance pages.
