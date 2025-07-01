import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";

const ImageDisplay = ({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading image...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Image could not be loaded</p>
          </div>
        </div>
      )}

      {/* Image */}
      {src && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-64 object-cover"
          style={{ display: isLoading ? "none" : "block" }}
        />
      )}

      {/* Fallback when no src provided */}
      {!src && (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No image available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
