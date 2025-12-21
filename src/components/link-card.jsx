/* eslint-disable react/prop-types */
// LinkCard - Aceternity UI Style
// Premium card with spotlight effect and smooth animations

import { Copy, Download, Trash2, ExternalLink, Check, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Use current origin for short URL display
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

const LinkCard = ({ url = [], fetchUrls }) => {
  const [copied, setCopied] = useState(false);

  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

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
    navigator.clipboard.writeText(`${BASE_URL}/${url?.custom_url || url?.short_url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  // Format date nicely
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  // Truncate long URLs
  const truncateUrl = (urlString, maxLength = 45) => {
    if (!urlString) return "";
    return urlString.length > maxLength
      ? urlString.substring(0, maxLength) + "..."
      : urlString;
  };

  return (
    <motion.div
      className="group relative flex flex-col md:flex-row gap-5 p-5 bg-zinc-900/70 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300"
      onMouseMove={handleMouseMove}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.1),
              transparent 80%
            )
          `,
        }}
      />

      {/* Border Glow Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* QR Code Section */}
      <div className="flex justify-center md:justify-start self-center relative z-10">
        <div className="relative group/qr">
          <div className="absolute -inset-1 bg-gradient-to-br from-[#f97316]/30 to-[#f97316]/0 rounded-xl blur-sm opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
          <div className="relative p-1 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50">
            <img
              src={url?.qr}
              className="h-32 w-32 md:h-28 md:w-28 object-contain rounded-lg bg-white"
              alt="QR code"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 min-w-0 relative z-10 group/link">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 truncate group-hover/link:text-[#f97316] transition-colors duration-300">
          {url?.title}
        </h3>

        {/* Short URL */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#f97316] font-medium text-sm truncate">
            {BASE_URL}/{url?.custom_url || url?.short_url}
          </span>
          <ExternalLink className="h-3 w-3 text-[#f97316] opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        {/* Original URL */}
        <p className="text-gray-500 text-xs truncate mb-3">
          → {truncateUrl(url?.original_url, 55)}
        </p>

        {/* Created Date */}
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-auto">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(url?.created_at)}</span>
        </div>
      </Link>

      {/* Action Buttons Section */}
      <div className="flex md:flex-col gap-2 justify-center items-center relative z-10">
        <TooltipProvider delayDuration={200}>
          {/* Copy Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-[#f97316] hover:text-white border border-zinc-700/50 hover:border-[#f97316] transition-all duration-200"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="bg-zinc-800 border-zinc-700 text-xs text-white z-50">
              <p>{copied ? "Copied!" : "Copy URL"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Download Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadImage}
                className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-[#f97316] hover:text-white border border-zinc-700/50 hover:border-[#f97316] transition-all duration-200"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10} className="bg-zinc-800 border-zinc-700 text-xs text-white z-50">
              <p>Download QR</p>
            </TooltipContent>
          </Tooltip>

          {/* Delete Button with Modal */}
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-zinc-800/80 hover:bg-red-500 hover:text-white border border-zinc-700/50 hover:border-red-500 transition-all duration-200"
                    disabled={loadingDelete}
                  >
                    {loadingDelete ? (
                      <BeatLoader size={4} color="white" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="bg-zinc-800 border-zinc-700 text-xs text-white z-50">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>

            <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-zinc-800 shadow-2xl p-6 sm:rounded-2xl gap-0 max-w-sm">
              <DialogHeader className="items-center text-center space-y-3 pb-6 border-b border-white/5">
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                  <Trash2 className="text-red-500 h-7 w-7" />
                </div>
                <DialogTitle className="text-xl font-semibold text-white">Delete this link?</DialogTitle>
                <p className="text-gray-400 text-sm max-w-[280px]">
                  This action cannot be undone. The short URL will stop working permanently.
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
                  onClick={() => fnDelete().then(() => fetchUrls())}
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
    </motion.div>
  );
};

export default LinkCard;