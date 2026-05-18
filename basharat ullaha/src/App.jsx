import { Suspense, lazy } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { SiteAssetsProvider } from './context/SiteAssetsContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import GoogleAnalytics from './components/GoogleAnalytics'
import MicrosoftClarity from './components/MicrosoftClarity'
import ScrollToTop from './components/ScrollToTop'

// ─── Public pages — eagerly loaded (fast first paint) ────────────────────────
import Home from './pages/Home'

// ─── Secondary public pages — lazy loaded ────────────────────────────────────
const About           = lazy(() => import('./pages/About'))
const Milestone       = lazy(() => import('./pages/Milestone'))        // Phase 9 — merged section
const MediaCoverage   = lazy(() => import('./pages/MediaCoverage'))    // Phase 9 Step 3
const SocialServices  = lazy(() => import('./pages/SocialServices'))
const Gallery         = lazy(() => import('./pages/Gallery'))
const Connections     = lazy(() => import('./pages/Connections'))
const Contact         = lazy(() => import('./pages/Contact'))

// ─── Admin pages — lazy loaded (never needed by public visitors) ──────────────
const AdminLayout          = lazy(() => import('./pages/admin/AdminLayout'))
const Login                = lazy(() => import('./pages/admin/Login'))
const Dashboard            = lazy(() => import('./pages/admin/Dashboard'))
const AboutSectionSettings  = lazy(() => import('./pages/admin/ProfileManager'))
const HomeManager            = lazy(() => import('./pages/admin/HomeManager'))
const SocialServicesManager  = lazy(() => import('./pages/admin/SocialServicesManager'))
const GalleryManager         = lazy(() => import('./pages/admin/GalleryManager'))
const MilestoneManager         = lazy(() => import('./pages/admin/MilestoneManager'))       // Phase 9 — unified manager
const MediaCoverageManager   = lazy(() => import('./pages/admin/MediaCoverageManager')) // Phase 9 Step 3
const ConnectionsManager     = lazy(() => import('./pages/admin/ConnectionsManager'))
const Settings             = lazy(() => import('./pages/admin/Settings'))
const SiteAssetsManager    = lazy(() => import('./pages/admin/SiteAssetsManager'))
const MessagesManager      = lazy(() => import('./pages/admin/MessagesManager'))
const ForgotPassword       = lazy(() => import('./pages/admin/ForgotPassword'))

// ─── Minimal fallback while lazy chunks load ──────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--navy)',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
          borderTopColor: 'var(--gold)',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <AuthProvider>
        <ProfileProvider>
          <SiteAssetsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <GoogleAnalytics />
            <MicrosoftClarity />
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontFamily: 'Inter, sans-serif'
                }
              }} 
            />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/"                element={<Home />} />
                  <Route path="/about"           element={<About />} />
                  {/* Phase 9 — Milestone replaces individual pages */}
                  <Route path="/milestone"       element={<Milestone />} />
                  {/* Legacy redirects — keep old URLs working (bookmarks, SEO) */}
                  <Route path="/achievements"    element={<Navigate to="/milestone" replace />} />
                  <Route path="/awards"          element={<Navigate to="/milestone" replace />} />
                  <Route path="/certificates"    element={<Navigate to="/milestone" replace />} />
                  {/* Phase 9 Step 3 — Media Coverage */}
                  <Route path="/media-coverage"  element={<MediaCoverage />} />
                  <Route path="/social-services" element={<SocialServices />} />
                  <Route path="/gallery"         element={<Gallery />} />
                  <Route path="/connections"     element={<Connections />} />
                  <Route path="/contact"         element={<Contact />} />
                </Route>
  
                {/* Admin Routes */}
                <Route path="/admin/login"           element={<Login />} />
                <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/admin"
                  element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
                >
                  <Route path="dashboard"    element={<Dashboard />} />
                  <Route path="home"         element={<HomeManager />} />
                  <Route path="about"        element={<AboutSectionSettings />} />
                  <Route path="services"     element={<SocialServicesManager />} />
                  <Route path="gallery"      element={<GalleryManager />} />
                  {/* Phase 9 — unified milestone manager */}
                  <Route path="milestone"       element={<MilestoneManager />} />
                  {/* Phase 9 Step 3 — media coverage */}
                  <Route path="media-coverage"  element={<MediaCoverageManager />} />
                  <Route path="connections"     element={<ConnectionsManager />} />
                  <Route path="settings"     element={<Settings />} />
                  <Route path="site-assets"  element={<SiteAssetsManager />} />
                  <Route path="messages"     element={<MessagesManager />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          </SiteAssetsProvider>
        </ProfileProvider>
      </AuthProvider>
    </LazyMotion>
  )
}
