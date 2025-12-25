import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import WordAnimator from "@/components/ui/word-animator";
import AnnouncementBadge from "@/components/ui/announcement-badge";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Individual imports for better tree-shaking
import { ArrowRight } from "lucide-react";
import { Link2 } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { QrCode } from "lucide-react";
import { Zap } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO, FAQJsonLd } from "@/components/seo";
import { pageSEO } from "@/config/seo.config";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);

  // Scroll animation for hero image - matching UI-Layouts style
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start 0.9", "end 0.5"]  // Start when element is near bottom, end when past center
  });
  
  // Start tilted and overlapping, flatten and move down to reveal heading
  const heroRotateXRaw = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const heroYRaw = useTransform(scrollYProgress, [0, 0.5], [0, 40]);  // Move down 40px to reveal heading
  
  // Apply spring for smoother animation
  const springConfig = { stiffness: 300, damping: 50, restDelta: 0.001 };
  const heroRotateX = useSpring(heroRotateXRaw, springConfig);
  const heroY = useSpring(heroYRaw, springConfig);

  const activeDivs = useMemo(
    () => ({
      0: new Set([4, 1]),
      2: new Set([3]),
      4: new Set([2, 5, 8]),
      5: new Set([4]),
      6: new Set([0]),
      7: new Set([1]),
      10: new Set([3]),
      12: new Set([7]),
      13: new Set([2, 4]),
      14: new Set([1, 5]),
      15: new Set([3, 6]),
    }),
    []
  );

  // Defer the heavy grid animation until browser is idle (after LCP)
  useEffect(() => {
    const updateBlocks = () => {
      const { innerWidth, innerHeight } = window;
      const blockSize = innerWidth * 0.06;
      const amountOfBlocks = Math.ceil(innerHeight / blockSize);

      const newBlocks = Array.from({ length: 17 }, (_, columnIndex) => (
        <div key={columnIndex} className="w-[6vw] h-full">
          {Array.from({ length: amountOfBlocks }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`h-[6vw] w-full border border-white/[0.015] ${
                activeDivs[columnIndex]?.has(rowIndex)
                  ? "bg-white/[0.03]"
                  : ""
              }`}
              style={{ height: `${blockSize}px` }}
            ></div>
          ))}
        </div>
      ));
      setBlocks(newBlocks);
    };

    // Defer grid creation until browser is idle to not block LCP
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(updateBlocks);
      } else {
        updateBlocks();
      }
    }, 1000); // Delay 1 second to allow LCP to complete first

    window.addEventListener("resize", updateBlocks);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateBlocks);
    };
  }, [activeDivs]);

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  const words = ["Shorter", "Smarter", "Faster", "Better"];

  const features = [
    {
      icon: Link2,
      title: "URL Shortening",
      description: "Transform long URLs into clean, shareable links in seconds"
    },
    {
      icon: BarChart3,
      title: "Click Analytics",
      description: "Track clicks, locations, and devices with detailed insights"
    },
    {
      icon: QrCode,
      title: "QR Codes",
      description: "Generate QR codes for your shortened links instantly"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized redirects for the fastest user experience"
    }
  ];

  // FAQ data for JSON-LD structured data
  const faqData = [
    {
      question: "How does the Trimmm URL shortener work?",
      answer: "When you enter a long URL, our system generates a shorter version of that URL. This shortened URL redirects to the original long URL when accessed, while we track valuable analytics for you."
    },
    {
      question: "Do I need an account to use the app?",
      answer: "Yes. Creating an account allows you to manage your URLs, view analytics, customize your short URLs, and access your links from anywhere."
    },
    {
      question: "What analytics are available for my shortened URLs?",
      answer: "You can view the number of clicks, geolocation data of the clicks, device types (mobile/desktop), and more for each of your shortened URLs."
    },
    {
      question: "Can I customize my short URLs?",
      answer: "Yes! You can create custom short URLs with your own chosen slug, making your links more memorable and branded."
    }
  ];

  return (
    <>
      {/* SEO Component */}
      <SEO
        title={pageSEO.home.title}
        description={pageSEO.home.description}
        keywords={pageSEO.home.keywords}
        canonicalUrl="https://trimmm.netlify.app/"
      />
      {/* FAQ Structured Data */}
      <FAQJsonLd faqs={faqData} />
      
      <div className="relative">
      {/* Hero Section - Full viewport with centered content */}
      <section className="overflow-hidden relative z-20 min-h-screen flex flex-col" aria-label="Hero">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true"></div>
        <div className="absolute inset-0 top-0 left-0 h-full w-full bg-gradient-to-t from-[#050505] from-0% to-transparent to-60%" aria-hidden="true"></div>

        {/* SVG Glow */}
        <div className="pointer-events-none absolute inset-0 flex w-screen justify-end opacity-50">
          <svg
            width="1512"
            height="1714"
            viewBox="0 0 1512 1714"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute left-0 top-0 h-auto w-full lg:w-1/2"
          >
            <g clipPath="url(#clip0_143_13)">
              <g filter="url(#filter0_f_143_13)">
                <path
                  d="M1045.18 982.551C1129.83 903.957 204.996 477.237 -235.529 294L-339.645 584.211C59.2367 752.376 960.521 1061.15 1045.18 982.551Z"
                  fill="white"
                  fillOpacity="0.15"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_143_13"
                x="-595.645"
                y="38"
                width="1902.26"
                height="1213.13"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                ></feBlend>
                <feGaussianBlur
                  stdDeviation="64"
                  result="effect1_foregroundBlur_143_13"
                ></feGaussianBlur>
              </filter>
              <clipPath id="clip0_143_13">
                <rect width="1512" height="1714" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Hero Content - Matching UI-Layouts structure */}
        <article className="mx-auto w-full max-w-5xl grid relative z-10 px-4 pt-40 pb-48">
          <div className="flex justify-center">
            <AnnouncementBadge
              label="New"
              message="Track clicks with detailed analytics"
              href="/auth"
            />
          </div>

          <h1 className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl text-center font-bold text-white tracking-tight mt-8">
            <span className="text-xl sm:text-2xl md:text-3xl text-gray-400 block mb-4">The Only URL Shortener You'll Ever Need</span>
            <span className="relative flex gap-3 justify-center items-center flex-wrap">
              Make Links{" "}
              <WordAnimator
                words={words}
                duration={3}
                className="italic w-fit px-4 py-2 bg-gray-800/80 border border-neutral-700 rounded-lg"
              />
            </span>
          </h1>

          <p className="mx-auto lg:w-[600px] sm:w-[80%] text-center sm:text-lg text-base mt-6 text-gray-400">
            Shorten URLs, generate QR codes, and track every click with 
            powerful analytics. Simple, fast, and free.
          </p>

          {/* URL Input Form */}
          <form
            onSubmit={handleShorten}
            className="max-w-2xl mx-auto w-full mt-8 flex flex-col sm:flex-row gap-3 px-4"
          >
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="h-14 flex-1 px-5 text-white bg-gray-900/80 border-gray-700 focus:border-[#f97316] placeholder:text-gray-500 rounded-xl"
            />
            <Button
              type="submit"
              className="h-14 px-8 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl text-base"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              Shorten URL
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <motion.p 
            className="text-center text-gray-500 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Free forever • No credit card required
          </motion.p>
        </article>

        {/* Dashboard Preview - Pushed to bottom of viewport */}
        <div className="relative z-10 px-4 mt-auto pb-20">
          <div className="text-center mb-0 relative z-0">
            <motion.span 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <span className="text-[#f97316]">✦</span>
              Dashboard Preview
            </motion.span>
            <motion.p 
              className="text-gray-400 text-base sm:text-lg mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Shorten links. Analyze clicks.
            </motion.p>
            <motion.h2 
              className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              Your Analytics Hub
            </motion.h2>
          </div>

          {/* Hero Image with Scroll Animation */}
          <motion.div 
            ref={heroRef}
            className="max-w-6xl mx-auto relative w-full px-2 sm:px-0 -mt-4 sm:-mt-6 z-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              rotateX: heroRotateX,
              y: heroY,
              transformPerspective: 1000,
              transformOrigin: "center top",
              willChange: "transform"
            }}
          >
            {/* Outer frame - laptop/device border */}
            <div className="h-full w-full border-4 border-zinc-700 rounded-2xl sm:rounded-3xl bg-zinc-900 shadow-2xl shadow-black/50">
              {/* Inner content wrapper */}
              <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="/banner.webp"
                  alt="Trimmm Dashboard Preview - URL shortener with analytics"
                  className="w-full h-auto"
                  width="1200"
                  height="675"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated Grid Background */}
        <div className="flex h-full overflow-hidden top-0 left-0 inset-0 z-0 absolute opacity-30">
          {blocks}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
              Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Essential tools for your
              <span className="block text-gray-500 italic mt-2">link management</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to shorten, track, and optimize your links in one powerful platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL Shortening Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-[#f97316]/70 transition-all duration-500"
            >
              <h3 className="text-xl font-semibold text-white mb-3">URL Shortening</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                Transform long, unwieldy URLs into clean, shareable links. Perfect for social media, emails, and marketing campaigns.
              </p>
              
              {/* Animated URL Transform Visual */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-800/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">Before</span>
                    <motion.div 
                      className="flex-1 bg-gray-800/50 rounded-lg px-4 py-3 overflow-hidden"
                      initial={{ opacity: 0.5 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.p 
                        className="text-gray-400 text-sm font-mono truncate"
                        animate={{ x: [0, -100, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        https://example.com/very/long/url/path/that/nobody/wants/to/share
                      </motion.p>
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-[#f97316] rotate-90" />
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">After</span>
                    <motion.div 
                      className="flex-1 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg px-4 py-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-[#f97316] text-sm font-mono font-medium">trimmm.netlify.app/ui</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Click Analytics Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-[#f97316]/70 transition-all duration-500"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Click Analytics</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                Track every click with detailed insights. Monitor locations, devices, and referrers in real-time.
              </p>
              
              {/* Animated Chart Visual */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Total Clicks</span>
                  <span className="text-gray-500 text-xs">Last 7 days</span>
                </div>
                <div className="flex items-end gap-1 h-24">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#f97316] to-[#f97316]/50 rounded-t"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day} className="text-gray-600 text-xs">{day}</span>
                  ))}
                </div>
                <motion.div 
                  className="mt-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <span className="text-2xl font-bold text-white">2,847</span>
                  <span className="text-green-500 text-sm flex items-center gap-1">
                    <motion.span
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >↑</motion.span>
                    12.5%
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* QR Codes Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-[#f97316]/70 transition-all duration-500"
            >
              <h3 className="text-xl font-semibold text-white mb-3">QR Code Generation</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                Generate beautiful QR codes instantly. Perfect for print materials, business cards, and offline marketing.
              </p>
              
              {/* QR Code Visual */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-6">
                  {/* QR Code */}
                  <motion.div 
                    className="relative bg-white p-3 rounded-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-9 gap-0.5 w-20 h-20">
                      {/* Static QR pattern - corner markers */}
                      {Array.from({ length: 81 }).map((_, i) => {
                        const row = Math.floor(i / 9);
                        const col = i % 9;
                        // Corner patterns
                        const isTopLeft = (row < 3 && col < 3) || (row === 0 && col < 3) || (col === 0 && row < 3);
                        const isTopRight = (row < 3 && col > 5) || (row === 0 && col > 5) || (col === 8 && row < 3);
                        const isBottomLeft = (row > 5 && col < 3) || (row === 8 && col < 3) || (col === 0 && row > 5);
                        // Center and data patterns
                        const isData = [4, 12, 14, 22, 31, 32, 40, 49, 58, 66, 68, 76].includes(i);
                        const isFilled = isTopLeft || isTopRight || isBottomLeft || isData || (Math.random() > 0.6);
                        
                        return (
                          <motion.div
                            key={i}
                            className={`w-full h-full ${isFilled ? 'bg-gray-900' : 'bg-white'}`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.02, delay: i * 0.008 }}
                          />
                        );
                      })}
                    </div>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-lg"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* QR Info */}
                  <div className="flex-1 space-y-3">
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-500 text-xs">Ready to scan</span>
                    </motion.div>
                    <motion.p 
                      className="text-gray-400 text-xs"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      trimmm.netlify.app/xyz
                    </motion.p>
                    <motion.button
                      className="flex items-center gap-2 bg-[#f97316]/20 hover:bg-[#f97316]/30 text-[#f97316] text-xs px-3 py-1.5 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <QrCode className="w-3 h-3" />
                      Download PNG
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Lightning Fast Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-[#f97316]/70 transition-all duration-500"
            >
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast Redirects</h3>
              <p className="text-gray-400 text-sm mb-8 max-w-sm">
                Optimized infrastructure for instant redirects. Your users won't even notice the redirect happening.
              </p>
              
              {/* Speed Gauge Visual */}
              <div className="bg-black/40 rounded-xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-8">
                  {/* Speedometer */}
                  <div className="relative w-28 h-28">
                    {/* Outer ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#speedGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        initial={{ strokeDashoffset: 283 }}
                        whileInView={{ strokeDashoffset: 30 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        12
                      </motion.span>
                      <span className="text-gray-500 text-xs">ms</span>
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 border-2 border-[#f97316]/30 rounded-full"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="flex-1 space-y-3">
                    {[
                      { label: 'Uptime', value: '99.9%', color: 'text-green-500' },
                      { label: 'Avg Response', value: '12ms', color: 'text-[#f97316]' },
                      { label: 'Global CDN', value: 'Active', color: 'text-blue-500' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        <span className="text-gray-500 text-xs">{stat.label}</span>
                        <span className={`text-sm font-medium ${stat.color}`}>{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4 bg-[#050505]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-center mb-12">
              Got questions? We&apos;ve got answers.
            </p>
          </motion.div>

          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-gray-800 rounded-lg px-4 bg-gray-900/30">
              <AccordionTrigger className="text-white hover:text-[#f97316]">
                How does the Trimmm URL shortener work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                When you enter a long URL, our system generates a shorter version of
                that URL. This shortened URL redirects to the original long URL when
                accessed, while we track valuable analytics for you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-gray-800 rounded-lg px-4 bg-gray-900/30">
              <AccordionTrigger className="text-white hover:text-[#f97316]">
                Do I need an account to use the app?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes. Creating an account allows you to manage your URLs, view
                analytics, customize your short URLs, and access your links from
                anywhere.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-gray-800 rounded-lg px-4 bg-gray-900/30">
              <AccordionTrigger className="text-white hover:text-[#f97316]">
                What analytics are available for my shortened URLs?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                You can view the number of clicks, geolocation data of the clicks,
                device types (mobile/desktop), and more for each of your shortened URLs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border border-gray-800 rounded-lg px-4 bg-gray-900/30">
              <AccordionTrigger className="text-white hover:text-[#f97316]">
                Can I customize my short URLs?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes! You can create custom short URLs with your own chosen slug,
                making your links more memorable and branded.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-[#050505]">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Trimmm for their link management needs.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="h-14 px-8 text-lg bg-[#f97316] hover:bg-[#ea580c]"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-gray-800 bg-[#050505]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Trimmm</span>
            </div>
            
            <div className="text-gray-400 text-xs flex items-center gap-1.5">
              Built with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
              <a
                href="https://devzahid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f97316] font-medium hover:underline hover:text-[#ea580c] transition-colors"
              >
                Zahid Mushtaq
              </a>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Trimmm. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default LandingPage;