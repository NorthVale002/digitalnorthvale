import React from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { AdminBar } from './components/common/AdminBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/pages/HomePage';
import { BlogArchivePage } from './components/pages/BlogArchivePage';
import { BlogPostPage } from './components/pages/BlogPostPage';
import { CustomPageView } from './components/pages/CustomPageView';
import { ServicesCatalogPage } from './components/pages/ServicesCatalogPage';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { OrderModal } from './components/common/OrderModal';

const CmsAppContent: React.FC = () => {
  const { config, activeView, isAdminAuthenticated } = useCms();
  const { theme } = config;

  // If viewing Secret Admin Login Portal
  if (activeView === 'admin-login') {
    return <AdminLoginPage />;
  }

  // Determine font family class
  const fontClass =
    theme.fontFamily === 'serif'
      ? 'font-serif-cms'
      : theme.fontFamily === 'mono'
      ? 'font-mono-cms'
      : 'font-sans-cms';

  return (
    <div
      id="cms-app-root"
      className={`min-h-screen flex flex-col transition-colors duration-200 ${fontClass}`}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* WordPress-style Top Admin Bar - strictly visible only when admin is authenticated */}
      {isAdminAuthenticated && <AdminBar />}

      {/* Website Header */}
      <Header />

      {/* Dynamic Main Body Content */}
      <div className="flex-1 flex flex-col">
        {activeView === 'home' && <HomePage />}
        {activeView === 'services' && <ServicesCatalogPage />}
        {activeView.startsWith('service:') && (
          <ServiceDetailPage slug={activeView.replace('service:', '')} />
        )}
        {activeView === 'blog' && <BlogArchivePage />}
        {activeView.startsWith('post:') && (
          <BlogPostPage slug={activeView.replace('post:', '')} />
        )}
        {activeView.startsWith('page:') && (
          <CustomPageView slug={activeView.replace('page:', '')} />
        )}
      </div>

      {/* Website Footer */}
      <Footer />

      {/* Full Admin Panel Modal - accessible only when authenticated */}
      {isAdminAuthenticated && <AdminDashboard />}

      {/* Firebase-backed Client Order & Booking Modal */}
      <OrderModal />
    </div>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <CmsAppContent />
    </CmsProvider>
  );
}
