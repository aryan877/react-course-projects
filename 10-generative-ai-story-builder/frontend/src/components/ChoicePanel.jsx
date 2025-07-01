import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ChoicePanel = ({ choices, onMakeChoice, disabled }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        What happens next?
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {choices.map((choice, index) => {
          const choiceText = typeof choice === "string" ? choice : choice.text;
          const choiceId =
            typeof choice === "string" ? `choice-${index}` : choice.id;

          return (
            <motion.button
              key={choiceId || index}
              onClick={() => onMakeChoice(choice, index)}
              disabled={disabled}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-secondary-50 border border-gray-200 hover:border-primary-300 rounded-xl text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 group-hover:text-primary-700 font-medium">
                  {choiceText}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transform group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ChoicePanel;
