# React Components Structure

This directory contains the modular React components for the CrowdLlama desktop application.

## Component Architecture

### Layout Components
- **BaseLayout**: The main layout wrapper that provides consistent structure
  - Contains Header and NetworkStatusBar
  - Provides a dynamic content area for different views
  - Handles network status and peer count display

- **Header**: Top navigation bar with logo and menu buttons
  - CrowdLlama logo and branding
  - History, Settings, and User menu buttons
  - Callback props for menu actions

- **NetworkStatusBar**: Network status indicator
  - Real-time connection status with animated indicator
  - Peer count display
  - Designed for async updates from backend

### Chat Components
- **ChatView**: Main chat interface component
  - Combines ChatHistory and PromptInput
  - Manages welcome state visibility
  - Handles message sending and suggestion clicks

- **ChatHistory**: Message display area
  - Shows conversation between user and AI
  - Displays welcome state with suggestion cards
  - Supports different message types (user/AI)
  - Auto-scrolling chat area

- **PromptInput**: Message input component
  - Auto-resizing textarea
  - Send button with keyboard shortcuts
  - Attachment, voice, and image buttons
  - Enter/Shift+Enter handling

- **WelcomeState**: Initial welcome screen
  - "How can I help you today?" message
  - Suggestion cards for common tasks
  - Responsive grid layout

- **SuggestionCard**: Reusable suggestion button
  - Icon, title, and description
  - Color-coded categories
  - Hover effects and transitions

### Welcome Components
- **WelcomePage**: Initial app welcome screen
  - CrowdLlama branding and hero section
  - Two action cards: "Share My Compute" and "Use CrowdLlama Network"
  - Features section highlighting benefits
  - Navigation to different app modes

### Share Compute Components
- **ShareComputePage**: Compute sharing configuration
  - Placeholder for compute sharing setup UI
  - Will be updated with specific design from share_my_compute.html
  - Back navigation to welcome page

## Routing Structure

The app uses React Router with the following routes:

- **`/` (Welcome)**: Shows the welcome page with two action cards
- **`/chat`**: Shows the main chat interface (AI Assistant)
- **`/share-compute`**: Shows the compute sharing configuration page

### Navigation Flow

1. **Welcome Page** (`/`)
   - User sees CrowdLlama welcome with two options
   - "Share My Compute" → Navigate to `/share-compute`
   - "Use CrowdLlama Network" → Navigate to `/chat`

2. **Chat Page** (`/chat`)
   - Main AI assistant interface
   - Chat history and prompt input
   - Network status bar shows connection info

3. **Share Compute Page** (`/share-compute`)
   - Model selection interface with checkboxes
   - 5 available models: llava, mistral, codellama, phi, gemma
   - Real-time selection count and total size calculation
   - "Start Sharing" → Navigate to `/chat` (main interface)
   - "Cancel" → Navigate to `/chat` (main interface)

## State Management

The app uses React Context (`AppContext`) to manage:

- **Current Route**: Tracks which page is active
- **Show Welcome**: Controls whether to show welcome page (for development)
- **Network Status**: Connection status and peer count
- **Navigation**: Functions to navigate between pages

## Usage Example

```tsx
import { AppProvider, useAppContext } from './context/AppContext';
import { BaseLayout, ChatView, WelcomePage, ShareComputePage } from './components';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePageWrapper />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/share-compute" element={<ShareComputePageWrapper />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
```

## Development Notes

- **Welcome Page**: Currently shows on every app start for development
- **Share Compute Page**: Placeholder UI - will be updated with specific design
- **Network Integration**: Components ready for backend integration
- **Styling**: Uses Tailwind CSS with CrowdLlama branding

## Future Enhancements

- Add persistent storage for user preferences
- Implement real backend integration
- Add proper share compute UI from design
- Add user authentication
- Implement real-time network status updates 
