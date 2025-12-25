import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut, AlignJustify, X, LayoutDashboard, Sparkles, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { UrlState } from "@/context";
import { useState } from "react";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUser } = UrlState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full top-0 z-50 absolute lg:flex lg:items-center lg:px-8 lg:py-4">
        <div className="flex max-w-5xl mx-auto w-full items-center relative justify-between h-16 px-4 p-2 bg-zinc-950 border border-neutral-800 rounded-b-xl">
          {/* Logo + Hamburger together on left */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button - Only show when logged in */}
            {user && (
              <button
                className="lg:hidden px-3 text-white h-10 grid place-content-center bg-gradient-to-b from-[#f97316] to-[#ea580c] w-fit rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <AlignJustify />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                Trimmm
              </span>
            </Link>

            {/* Desktop Navigation - next to logo */}
            <nav className="hidden lg:flex items-center gap-1">
              {user && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    location.pathname === '/dashboard' 
                      ? 'text-[#f97316] bg-[#f97316]/10' 
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <nav className="flex items-center gap-3">
            {!user ? (
              !location.pathname.includes("/auth") && (
                <button
                  onClick={() => navigate("/auth")}
                  className="flex items-center gap-2 bg-[#f97316] text-white border border-transparent h-10 px-4 rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  <ArrowRight size={18} />
                  Login
                </button>
              )
            ) : (
              <>
                {/* Profile Avatar */}
                <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#f97316]/50 hover:ring-[#f97316] transition-all">
                  <Avatar>
                    <AvatarImage 
                      src={user?.profilePic} 
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="w-full h-full bg-[#f97316] flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Logout Button - Hidden on mobile, visible on tablet/desktop */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="hidden sm:flex items-center gap-2 bg-[#f97316] text-white border border-[#f97316] h-10 px-4 rounded-lg hover:bg-[#ea580c] transition-colors font-medium">
                      <LogOut size={18} />
                      Logout
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-800 shadow-2xl p-6 sm:rounded-2xl gap-0 max-w-sm">
                    <DialogHeader className="items-center text-center space-y-3 pb-6 border-b border-white/5">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                        <LogOut className="text-red-500 h-6 w-6 ml-1" />
                      </div>
                      <DialogTitle className="text-xl font-semibold text-white">Log out of Trimmm?</DialogTitle>
                      <p className="text-gray-400 text-sm max-w-[260px]">
                        Are you sure you want to sign out? You'll need to sign back in to access your links.
                      </p>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-3 pt-6 w-full">
                      <DialogClose asChild>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="flex-1 h-11 bg-transparent border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-xl"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          fnLogout().then(() => {
                            fetchUser();
                            navigate("/");
                          });
                        }}
                        className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl"
                      >
                        Log Out
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-20 left-4 right-4 bg-zinc-900 border border-neutral-800 rounded-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {user && (
              <nav className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'text-[#f97316] bg-[#f97316]/10'
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/");
                      setMobileMenuOpen(false);
                    });
                  }}
                  className="flex items-center gap-3 px-4 py-3 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </nav>
            )}
            {!user && !location.pathname.includes("/auth") && (
              <button
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white text-zinc-900 h-12 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <ArrowRight size={18} />
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {loading && <BarLoader className="fixed top-[68px] left-0 right-0 z-50" width={"100%"} color="#f97316" />}
    </>
  );
};

export default Header;