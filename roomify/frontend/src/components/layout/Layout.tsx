import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100">
      {/* Fixed Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Mobile sidebar */}
      <MobileNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop sidebar and main content */}
      <div className="flex pt-16">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 lg:pl-64">
          <main className="py-8 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
