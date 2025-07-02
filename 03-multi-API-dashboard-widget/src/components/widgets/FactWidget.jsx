import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import Widget from "@/components/common/Widget";
import { fetchFactData } from "@/utils/api";
import { useActionState, useEffect, useState, useTransition } from "react";

const FactWidget = () => {
  const [factData, setFactData] = useState(null);
  const [savedFacts, setSavedFacts] = useState([]);
  const [isPending, startTransition] = useTransition();

  const [state, loadFactData] = useActionState(
    async () => {
      try {
        const data = await fetchFactData();
        setFactData(data);
        return { success: true, data, error: null };
      } catch (err) {
        console.error("Fact fetch error:", err);
        return { success: false, data: null, error: err };
      }
    },
    { success: null, data: null, error: null }
  );

  useEffect(() => {
    const loadInitialData = () => {
      startTransition(() => {
        loadFactData();
      });
    };

    loadInitialData();

    // Load saved facts from localStorage
    const saved = localStorage.getItem("savedFacts");
    if (saved) {
      setSavedFacts(JSON.parse(saved));
    }
  }, [loadFactData]);

  const handleRefresh = () => {
    startTransition(() => {
      loadFactData();
    });
  };

  const saveFact = () => {
    if (factData && !savedFacts.some((f) => f.text === factData.text)) {
      const newSavedFacts = [
        ...savedFacts,
        { ...factData, savedAt: new Date().toISOString() },
      ];
      setSavedFacts(newSavedFacts);
      localStorage.setItem("savedFacts", JSON.stringify(newSavedFacts));
    }
  };

  const renderFactContent = () => {
    if (isPending) {
      return <LoadingSkeleton type="fact" />;
    }

    if (!factData) return null;

    return (
      <div className="space-y-4">
        <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-amber-500">
          <div className="absolute top-2 left-2 text-4xl text-amber-500/30">
            &ldquo;
          </div>
          <p className="text-foreground/80 leading-relaxed pl-8">
            {factData.text}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-sm text-foreground/60 italic">
            Source: {factData.source}
          </p>
          <button
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            onClick={saveFact}
          >
            💾 Save Fact
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            onClick={handleRefresh}
          >
            🎲 New Fact
          </button>
          <span className="text-sm text-foreground/60">
            {savedFacts.length} facts saved
          </span>
        </div>
      </div>
    );
  };

  return (
    <Widget
      title="Fact of the Day"
      onRefresh={handleRefresh}
      isLoading={isPending}
      error={state.error}
      colorScheme="amber"
    >
      {renderFactContent()}
    </Widget>
  );
};

export default FactWidget;
