
import React from 'react';
import Sidebar from './Sidebar';
import { FileProvider } from '@/context/FileContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <FileProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </FileProvider>
  );
};

export default Layout;
