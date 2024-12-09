import Header from '@/components/header';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
  const location = useLocation();

  // Check if the current path is '/auth'
  const isAuthRoute = location.pathname.startsWith('/auth');

  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      {!isAuthRoute && ( // Conditionally render the footer
        <div className="p-10 text-center bg-gray-800 mt-10">
          Made by{' '}
          <a href="https://github.com/izahid19" target="_blank" rel="noopener noreferrer">
            Zahid
          </a>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
