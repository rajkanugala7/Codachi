// index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import './index.css';  // Your global CSS (if any)
import App from './App'; // Importing App.js

// Select the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render your app using the root
root.render(
 
    <App />
 
);


