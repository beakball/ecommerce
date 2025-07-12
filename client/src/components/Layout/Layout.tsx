import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, searchQuery }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={onSearch} searchQuery={searchQuery} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;