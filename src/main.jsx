import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { esES } from '@clerk/localizations'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const appearance = {
  layout: {
    logoImageUrl: '/logo.jpeg',
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'iconButton',
  },
  variables: {
    colorPrimary: '#128bb5',
    colorText: '#0a235c',
    colorBackground: '#ffffff',
  },
  elements: {
    card: 'shadow-xl rounded-3xl border border-gray-100',
    formButtonPrimary: 'bg-gradient-to-r from-[#128bb5] to-[#0a235c] text-white shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer',
    headerTitle: 'text-2xl font-extrabold text-[#0a235c]',
    headerSubtitle: 'text-sm text-gray-500',
  }
}

function ClerkWithRoutes() {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      localization={esES}
      appearance={appearance}
      signInFallbackRedirectUrl="/app"
      signUpFallbackRedirectUrl="/app"
      afterSignOutUrl="/"
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/app/*" element={<App />} />
      </Routes>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
  </StrictMode>,
)
