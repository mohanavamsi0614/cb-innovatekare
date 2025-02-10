import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Import Tailwind CSS
import { BrowserRouter } from 'react-router'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Analytics/>

  </BrowserRouter>
)
