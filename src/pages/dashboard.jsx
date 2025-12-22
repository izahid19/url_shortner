// Dashboard - URL Shortener
// Premium Aceternity UI Design with animated components

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, MousePointerClick, Search, Plus, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import BackgroundBeams from "@/components/ui/background-beams";
import CardSpotlight from "@/components/ui/card-spotlight";

import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";

// Shimmer Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-800/50 rounded-lg ${className}`} />
);

// Stats Card Skeleton
const StatsCardSkeleton = () => (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 lg:col-span-2">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-10 w-20 mb-2" />
    <Skeleton className="h-3 w-32" />
  </div>
);

// Link Card Skeleton
const LinkCardSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-5 p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
    <Skeleton className="h-28 w-28 md:h-32 md:w-32 self-center rounded-xl" />
    <div className="flex-1 space-y-3">
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-32" />
    </div>
    <div className="flex md:flex-col gap-2 justify-center">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  </div>
);

// Animated Number Component
const AnimatedNumber = ({ value, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return <span>{displayValue}</span>;
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 10;

  const { user } = UrlState();
  const { loading, error, data: urlsResponse, fn: fnUrls } = useFetch(getUrls);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urlsResponse?.data?.map((url) => url.id)
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch URLs when page or search changes
  useEffect(() => {
    fnUrls({ page, limit, search: debouncedSearch });
  }, [page, debouncedSearch]);

  // Update pagination when response changes
  useEffect(() => {
    if (urlsResponse?.pagination) {
      setPagination(urlsResponse.pagination);
    }
  }, [urlsResponse]);

  // Fetch clicks when URLs change
  useEffect(() => {
    if (urlsResponse?.data?.length) fnClicks();
  }, [urlsResponse?.data?.length]);

  const urls = urlsResponse?.data || [];
  const isLoading = loading;

  const handleNextPage = () => {
    if (pagination?.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrev) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-40" />

      <motion.div
        className="relative z-10 flex flex-col gap-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              Welcome back
              <Sparkles className="h-8 w-8 text-[#f97316] animate-pulse" />
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your links today.
            </p>
          </div>
          <CreateLink />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {isLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              {/* Links Created Card */}
              <CardSpotlight className="lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Total Links</p>
                    <p className="text-5xl font-bold text-white tracking-tight">
                      <AnimatedNumber value={pagination?.total || 0} delay={200} />
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">Active</span> shortened URLs
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-lg shadow-[#f97316]/20">
                    <Link2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardSpotlight>

              {/* Total Clicks Card */}
              <CardSpotlight className="lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Total Clicks</p>
                    <p className="text-5xl font-bold text-white tracking-tight">
                      <AnimatedNumber value={clicks?.length || 0} delay={400} />
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3 text-[#f97316]" />
                      Across all your links
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] shadow-lg shadow-[#f97316]/20">
                    <MousePointerClick className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardSpotlight>
            </>
          )}
        </motion.div>

        {/* Links Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-zinc-800/50 pt-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Your Links</h2>
            <p className="text-gray-500 text-sm mt-1">
              {pagination?.total || 0} {pagination?.total === 1 ? 'link' : 'links'} total
              {debouncedSearch && ` • Searching for "${debouncedSearch}"`}
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-gray-500 w-full sm:w-80 rounded-xl focus:border-[#f97316] focus:ring-[#f97316]/20 transition-all backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Links List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <>
                <LinkCardSkeleton />
                <LinkCardSkeleton />
              </>
            ) : urls.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-4"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-[#f97316]/20 rounded-full blur-3xl" />
                  <div className="relative w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Link2 className="h-12 w-12 text-[#f97316]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {debouncedSearch ? "No links found" : "No links yet"}
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {debouncedSearch 
                    ? `No links match "${debouncedSearch}". Try a different search term.`
                    : "Create your first short link to start tracking clicks and sharing with the world."}
                </p>
                {!debouncedSearch && (
                  <CreateLink>
                    <Button className="h-12 px-8 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white font-semibold rounded-xl shadow-lg shadow-[#f97316]/25 transition-all duration-300 hover:shadow-[#f97316]/40 hover:scale-105">
                      <Plus className="mr-2 h-5 w-5" />
                      Create Your First Link
                    </Button>
                  </CreateLink>
                )}
              </motion.div>
            ) : (
              urls.map((url, i) => (
                <motion.div
                  key={url.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                  layout
                >
                  <LinkCard url={url} fetchUrls={() => fnUrls({ page, limit, search: debouncedSearch })} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        {!isLoading && urls.length > 0 && pagination && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-zinc-800/50"
          >
            <p className="text-sm text-gray-400">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} links
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrev}
                variant="outline"
                className="h-10 px-4 bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-300 px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                variant="outline"
                className="h-10 px-4 bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;