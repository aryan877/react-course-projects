import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TextEditor = ({ text, onSave, onCancel, position }) => {
  const [value, setValue] = useState(text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    // Adjust position to stay within viewport
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedLeft = position.x;
      let adjustedTop = position.y;

      // Adjust horizontal position
      if (rect.right > viewportWidth) {
        adjustedLeft = position.x - (rect.right - viewportWidth) - 20;
      }
      if (adjustedLeft < 20) {
        adjustedLeft = 20;
      }

      // Adjust vertical position
      if (rect.bottom > viewportHeight) {
        adjustedTop = position.y - rect.height - 20;
      }
      if (adjustedTop < 20) {
        adjustedTop = 20;
      }

      containerRef.current.style.left = `${adjustedLeft}px`;
      containerRef.current.style.top = `${adjustedTop}px`;
    }
  }, [position]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const trimmedValue = value.trim();

    try {
      onSave(trimmedValue || "New Node");
    } catch (error) {
      console.error("Error saving text:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = () => {
    // Small delay to allow for button clicks
    setTimeout(() => {
      if (!isSubmitting) {
        handleSave();
      }
    }, 150);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    // Limit text length
    if (newValue.length <= 100) {
      setValue(newValue);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed z-50 bg-white rounded-lg shadow-xl border-2 border-blue-500 p-1"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
        minWidth: "200px",
        maxWidth: "300px",
      }}
    >
      <div className="flex flex-col gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="px-3 py-2 text-sm font-medium text-gray-800 outline-none resize-none border-none bg-transparent"
          placeholder="Enter text..."
          rows={value.split("\n").length || 1}
          style={{ minHeight: "32px", maxHeight: "80px" }}
        />

        <div className="flex justify-between items-center px-2 py-1 bg-gray-50 rounded text-xs text-gray-500">
          <span>{value.length}/100</span>
          <div className="flex gap-1">
            <span>Enter: Save</span>
            <span>•</span>
            <span>Esc: Cancel</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextEditor;
