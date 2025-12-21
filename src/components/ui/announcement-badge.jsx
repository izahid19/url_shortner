import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const AnnouncementBadge = ({ 
  label = "New", 
  message, 
  href = "#",
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex justify-center w-fit mx-auto items-center gap-1 rounded-full",
        "bg-[#f97316] border-4 border-neutral-800 shadow-lg",
        "py-0.5 pl-0.5 pr-3 text-xs",
        "hover:scale-105 transition-transform duration-200",
        className
      )}
    >
      <div className="rounded-full bg-white px-2 py-1 text-xs text-black font-medium">
        {label}
      </div>
      <p className="text-white sm:text-sm text-xs inline-block">
        ✨ {message}
      </p>
      <ArrowRight className="h-3 w-3 text-white" />
    </a>
  );
};

export default AnnouncementBadge;
