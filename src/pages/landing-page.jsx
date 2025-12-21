import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/ui/shimmer-button";
import WordAnimator from "@/components/ui/word-animator";
import AnnouncementBadge from "@/components/ui/announcement-badge";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Link2, BarChart3, QrCode, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const heroRotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 40]);  // Move down 40px to reveal heading

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

    updateBlocks();
    window.addEventListener("resize", updateBlocks);

    return () => window.removeEventListener("resize", updateBlocks);
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

  return (
    <div className="relative">
      {/* Hero Section - Full viewport with centered content */}
      <section className="overflow-hidden relative z-20 min-h-screen flex flex-col">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 top-0 left-0 h-full w-full bg-gradient-to-t from-[#050505] from-0% to-transparent to-60%"></div>

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
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AnnouncementBadge
              label="New"
              message="Track clicks with detailed analytics"
              href="/auth"
            />
          </motion.div>

          <motion.h1 
            className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl text-center font-bold text-white tracking-tight mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-xl sm:text-2xl md:text-3xl text-gray-400 block mb-4">The Only URL Shortener You'll Ever Need</span>
            <span className="relative flex gap-3 justify-center items-center flex-wrap">
              Make Links{" "}
              <WordAnimator
                words={words}
                duration={3}
                className="italic w-fit px-4 py-2 bg-gray-800/80 border border-neutral-700 rounded-lg"
              />
            </span>
          </motion.h1>

          <motion.p 
            className="mx-auto lg:w-[600px] sm:w-[80%] text-center sm:text-lg text-base mt-6 text-gray-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Shorten URLs, generate QR codes, and track every click with 
            powerful analytics. Simple, fast, and free.
          </motion.p>

          {/* URL Input Form */}
          <motion.form
            onSubmit={handleShorten}
            className="max-w-2xl mx-auto w-full mt-8 flex flex-col sm:flex-row gap-3 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            >
              Shorten URL
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>

          <motion.p 
            className="text-center text-gray-500 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Free forever • No credit card required
          </motion.p>
        </article>

        {/* Dashboard Preview - Pushed to bottom of viewport */}
        <div className="relative z-10 px-4 mt-auto pb-8">
          <div className="text-center mb-0 relative z-0">
            <motion.span 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-[#f97316]">✦</span>
              Dashboard Preview
            </motion.span>
            <motion.p 
              className="text-gray-400 text-base sm:text-lg mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Shorten links. Analyze clicks.
            </motion.p>
            <motion.h2 
              className="xl:text-7xl md:text-6xl sm:text-5xl text-3xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            transition={{ duration: 0.8, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              rotateX: heroRotateX,
              y: heroY,
              transformPerspective: 1000,
              transformOrigin: "center top"
            }}
          >
            {/* Outer frame - laptop/device border */}
            <div className="h-full w-full border-4 border-zinc-700 rounded-2xl sm:rounded-3xl bg-zinc-900 shadow-2xl shadow-black/50">
              {/* Inner content wrapper */}
              <div className="h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src="/banner.png"
                  alt="Trimmm Dashboard Preview"
                  className="w-full h-auto"
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
      <section className="relative z-10 py-20 px-4 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Powerful features to help you manage, track, and optimize your links
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-[#f97316]/50 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-[#f97316]/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#f97316]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
  );
};

export default LandingPage;