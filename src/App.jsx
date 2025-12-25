import "./App.css";
import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UrlProvider from "./context";

import AppLayout from "./layouts/app-layout";
import RequireAuth from "./components/require-auth";

// Lazy load pages for code splitting
const LandingPage = lazy(() => import("./pages/landing-page"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const LinkPage = lazy(() => import("./pages/link"));
const Profile = lazy(() => import("./pages/profile"));
const Auth = lazy(() => import("./pages/auth"));
const VerifyEmail = lazy(() => import("./components/verify-email"));
const ForgotPassword = lazy(() => import("./components/forgot-password"));
const NotFound = lazy(() => import("./pages/not-found"));
const RedirectLink = lazy(() => import("./pages/redirect-link"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "/auth",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Auth />
          </Suspense>
        ),
      },
      {
        path: "/verify-email",
        element: (
          <Suspense fallback={<PageLoader />}>
            <VerifyEmail />
          </Suspense>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <LinkPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: "/404",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: "/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RedirectLink />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;