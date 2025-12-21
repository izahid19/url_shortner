import Header from '@/components/header';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
  const location = useLocation();

  // Check if the current path is '/' (landing page)
  const isLandingPage = location.pathname === '/';
  // Check if the current path starts with '/auth' or other auth-related routes
  const isAuthRoute = location.pathname.startsWith('/auth') || 
                      location.pathname.startsWith('/forgot-password') ||
                      location.pathname.startsWith('/verify-email') ||
                      location.pathname.startsWith('/reset-password');

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <Header />
      <main className={`flex-1 ${isLandingPage ? '' : 'container pt-20'}`}>
        <Outlet />
      </main>
      {!isAuthRoute && !isLandingPage && (
        <footer className="p-6 text-center bg-[#050505] border-t border-gray-800 mt-auto">
          <p className="text-gray-400 text-sm">
            Made with ❤️ by{' '}
            <a 
              href="https://github.com/izahid19" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#f97316] hover:underline"
            >
              Zahid
            </a>
          </p>
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
