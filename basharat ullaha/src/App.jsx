import { Suspense, lazy } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { SiteAssetsProvider } from './context/SiteAssetsContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

// ─── Public pages — eagerly loaded (fast first paint) ────────────────────────
import Home from './pages/Home'

// ─── Secondary public pages — lazy loaded ────────────────────────────────────
const About           = lazy(() => import('./pages/About'))
const Achievements    = lazy(() => import('./pages/Achievements'))
const SocialServices  = lazy(() => import('./pages/SocialServices'))
const Awards          = lazy(() => import('./pages/Awards'))
const Certificates    = lazy(() => import('./pages/Certificates'))
const Gallery         = lazy(() => import('./pages/Gallery'))
const Connections     = lazy(() => import('./pages/Connections'))
const Contact         = lazy(() => import('./pages/Contact'))

// ─── Admin pages — lazy loaded (never needed by public visitors) ──────────────
const AdminLayout          = lazy(() => import('./pages/admin/AdminLayout'))
const Login                = lazy(() => import('./pages/admin/Login'))
const Dashboard            = lazy(() => import('./pages/admin/Dashboard'))
const ProfileManager       = lazy(() => import('./pages/admin/ProfileManager'))
const GalleryManager       = lazy(() => import('./pages/admin/GalleryManager'))
const AchievementsManager  = lazy(() => import('./pages/admin/AchievementsManager'))
const AwardsManager        = lazy(() => import('./pages/admin/AwardsManager'))
const CertificatesManager  = lazy(() => import('./pages/admin/CertificatesManager'))
const ConnectionsManager   = lazy(() => import('./pages/admin/ConnectionsManager'))
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
                  <Route path="/achievements"    element={<Achievements />} />
                  <Route path="/social-services" element={<SocialServices />} />
                  <Route path="/awards"          element={<Awards />} />
                  <Route path="/certificates"    element={<Certificates />} />
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
                  <Route path="profile"      element={<ProfileManager />} />
                  <Route path="gallery"      element={<GalleryManager />} />
                  <Route path="achievements" element={<AchievementsManager />} />
                  <Route path="awards"       element={<AwardsManager />} />
                  <Route path="certificates" element={<CertificatesManager />} />
                  <Route path="connections"  element={<ConnectionsManager />} />
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
