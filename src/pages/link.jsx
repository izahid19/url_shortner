// Link Details Page - Aceternity UI Redesign
// Premium analytics dashboard with charts and detailed click info

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, Download, Trash2, ExternalLink, Check, Calendar, 
  MousePointerClick, Globe, Smartphone, Monitor, MapPin, 
  Clock, TrendingUp, Eye, ArrowLeft, Share2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

import { Button } from "@/components/ui/button";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { BeatLoader } from "react-spinners";
import BackgroundBeams from "@/components/ui/background-beams";
import CardSpotlight from "@/components/ui/card-spotlight";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Use current origin for short URL display
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

// Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-zinc-800/50 rounded-lg ${className}`} />
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

// Chart Colors
const CHART_COLORS = ['#f97316', '#ea580c', '#fb923c', '#fdba74', '#fed7aa'];

const LinkPage = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  const link = url?.custom_url ? url?.custom_url : url?.short_url;

  // Process analytics data
  const processLocationData = () => {
    if (!stats?.length) return [];
    const cityCount = stats.reduce((acc, item) => {
      const city = item.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(cityCount)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const processDeviceData = () => {
    if (!stats?.length) return [];
    const deviceCount = stats.reduce((acc, item) => {
      const device = item.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(deviceCount).map(([device, count]) => ({ device, count }));
  };

  const processCountryData = () => {
    if (!stats?.length) return [];
    const countryCount = stats.reduce((acc, item) => {
      const country = item.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countryCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${BASE_URL}/${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = loading || loadingStats;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <BackgroundBeams className="opacity-30" />

      <motion.div
        className="relative z-10 flex flex-col gap-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Link Info Card */}
          <CardSpotlight className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{url?.title}</h1>
                  <div className="flex gap-2">
                    <TooltipProvider delayDuration={200}>
                      <TooltipUI>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={copyToClipboard}
                            className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-[#f97316] hover:text-white border border-zinc-700/50 hover:border-[#f97316]"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">{copied ? "Copied!" : "Copy URL"}</TooltipContent>
                      </TooltipUI>

                      <TooltipUI>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={downloadImage}
                            className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-[#f97316] hover:text-white border border-zinc-700/50 hover:border-[#f97316]"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Download QR</TooltipContent>
                      </TooltipUI>

                      <Dialog>
                        <TooltipUI>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-red-500 hover:text-white border border-zinc-700/50 hover:border-red-500"
                                disabled={loadingDelete}
                              >
                                {loadingDelete ? <BeatLoader size={4} color="white" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="top">Delete</TooltipContent>
                        </TooltipUI>

                        <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-800 shadow-2xl p-6 sm:rounded-2xl gap-0 max-w-sm">
                          <DialogHeader className="items-center text-center space-y-3 pb-6 border-b border-white/5">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                              <Trash2 className="text-red-500 h-7 w-7" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-white">Delete this link?</DialogTitle>
                            <p className="text-gray-400 text-sm max-w-[280px]">
                              This action cannot be undone. All analytics data will be lost.
                            </p>
                          </DialogHeader>
                          <DialogFooter className="flex flex-row gap-3 pt-6 w-full">
                            <DialogClose asChild>
                              <Button type="button" variant="outline" className="flex-1 h-11 bg-transparent border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-white rounded-xl">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
                              disabled={loadingDelete}
                              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl"
                            >
                              {loadingDelete ? <BeatLoader size={8} color="white" /> : "Delete"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Short URL */}
                <a
                  href={`${BASE_URL}/${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#f97316] font-medium text-lg hover:underline mb-3"
                >
                  {BASE_URL}/{link}
                  <ExternalLink className="h-4 w-4" />
                </a>

                {/* Original URL */}
                <p className="text-gray-400 text-sm truncate mb-4">
                  <span className="text-gray-500">Original: </span>
                  {url?.original_url}
                </p>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(url?.created_at)}</span>
                </div>
              </>
            )}
          </CardSpotlight>

          {/* QR Code Card */}
          <CardSpotlight className="flex items-center justify-center p-4">
            {isLoading ? (
              <Skeleton className="h-40 w-40 rounded-xl" />
            ) : (
              <div className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 w-full md:w-auto flex justify-center">
                <img
                  src={url?.qr}
                  className="w-full aspect-square max-w-[200px] md:h-40 md:w-40 object-contain rounded-lg bg-white"
                  alt="QR code"
                />
              </div>
            )}
          </CardSpotlight>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <CardSpotlight>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f97316]/10">
                <MousePointerClick className="h-5 w-5 text-[#f97316]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : <AnimatedNumber value={stats?.length || 0} />}
                </p>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f97316]/10">
                <Globe className="h-5 w-5 text-[#f97316]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Countries</p>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : <AnimatedNumber value={processCountryData().length} delay={100} />}
                </p>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f97316]/10">
                <MapPin className="h-5 w-5 text-[#f97316]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Cities</p>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : <AnimatedNumber value={processLocationData().length} delay={200} />}
                </p>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f97316]/10">
                <Smartphone className="h-5 w-5 text-[#f97316]" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Devices</p>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? <Skeleton className="h-6 w-12" /> : <AnimatedNumber value={processDeviceData().length} delay={300} />}
                </p>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Charts Section */}
        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Location Bar Chart */}
            <CardSpotlight>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#f97316]" />
                Top Cities
              </h3>
              <div className="space-y-4">
                {processLocationData().map((item, index) => {
                  const maxCount = Math.max(...processLocationData().map(d => d.count));
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <motion.div
                      key={item.city}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#f97316]">#{index + 1}</span>
                          <span className="text-white font-medium">{item.city}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{item.count} clicks</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
                {processLocationData().length === 0 && (
                  <p className="text-gray-500 text-center py-8">No location data yet</p>
                )}
              </div>
            </CardSpotlight>

            {/* Device Pie Chart */}
            <CardSpotlight>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-[#f97316]" />
                Device Breakdown
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={processDeviceData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {processDeviceData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardSpotlight>
          </motion.div>
        )}

        {/* Click History Table */}
        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CardSpotlight>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#f97316]" />
                Recent Clicks
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Device</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Browser</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">OS</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.slice(0, 15).map((click, index) => (
                      <motion.tr
                        key={click.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="whitespace-nowrap">{formatDate(click.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-[#f97316]" />
                            <span className="whitespace-nowrap">{click.city || 'Unknown'}, {click.country || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center gap-2">
                            {click.device === 'mobile' ? (
                              <Smartphone className="h-3 w-3 text-blue-400" />
                            ) : click.device === 'tablet' ? (
                              <Smartphone className="h-3 w-3 text-purple-400" />
                            ) : (
                              <Monitor className="h-3 w-3 text-green-400" />
                            )}
                            <span className="capitalize">{click.device || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{click.browser || 'Unknown'}</td>
                        <td className="py-3 px-4 text-gray-400">{click.os || 'Unknown'}</td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-gray-400">
                            {click.ip || 'Unknown'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardSpotlight>
          </motion.div>
        )}

        {/* No Stats Message */}
        {!isLoading && (!stats || stats.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#f97316]/20 rounded-full blur-3xl" />
              <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <MousePointerClick className="h-10 w-10 text-[#f97316]" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No clicks yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Share your link to start tracking analytics. Every click will show up here with detailed information.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LinkPage;
