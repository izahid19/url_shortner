import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <h1 className="text-[10rem] sm:text-[14rem] font-bold text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-[#f97316] px-6 py-2 rounded-full"
            >
              <span className="text-white font-semibold text-lg">Page Not Found</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-400 text-lg mt-4 mb-8 max-w-md mx-auto"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-12 px-6 border-[#f97316] text-[#f97316] hover:bg-[#f97316]/10 hover:text-[#f97316]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="h-12 px-6 bg-[#f97316] hover:bg-[#ea580c] text-white"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f97316]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f97316]/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
