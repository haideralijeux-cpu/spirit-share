// React 18 createRoot API for better performance
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mount the React application to the DOM
// Using React 18's createRoot for better concurrent features
createRoot(document.getElementById("root")!).render(<App />);
