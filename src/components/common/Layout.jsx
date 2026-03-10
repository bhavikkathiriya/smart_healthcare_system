import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070d] transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="pt-16 min-h-screen">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
