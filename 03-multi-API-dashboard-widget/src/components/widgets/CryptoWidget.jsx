import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import Widget from "@/components/common/Widget";
import { fetchCryptoData } from "@/utils/api";
import { DEFAULT_SETTINGS } from "@/utils/constants";
import { useActionState, useEffect, useState, useTransition } from "react";

const CryptoWidget = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isPending, startTransition] = useTransition();

  const [state, loadCryptoData] = useActionState(
    async () => {
      try {
        const data = await fetchCryptoData();
        setCryptoData(data);
        return { success: true, data, error: null };
      } catch (err) {
        console.error("Crypto fetch error:", err);
        return { success: false, data: null, error: err };
      }
    },
    { success: null, data: null, error: null }
  );

  useEffect(() => {
    const loadInitialData = () => {
      startTransition(() => {
        loadCryptoData();
      });
    };

    loadInitialData();

    const interval = setInterval(() => {
      startTransition(() => {
        loadCryptoData();
      });
    }, DEFAULT_SETTINGS.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadCryptoData]);

  const handleRefresh = () => {
    startTransition(() => {
      loadCryptoData();
    });
  };

  const formatPrice = (price) => {
    return price > 1 ? price.toFixed(2) : price.toFixed(6);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const renderCryptoContent = () => {
    if (isPending) {
      return <LoadingSkeleton type="crypto" />;
    }

    if (!cryptoData.length) return null;

    return (
      <div className="space-y-3">
        {cryptoData.map((coin) => (
          <div
            key={coin.id}
            className="flex justify-between items-center p-4 bg-foreground/5 rounded-lg border border-border hover:translate-x-1 transition-transform duration-200"
          >
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">{coin.name}</h4>
              <p className="text-sm text-foreground/60">
                {formatMarketCap(coin.marketCap)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-lg font-bold text-foreground">
                ${formatPrice(coin.price)}
              </div>
              <div
                className={`
                text-sm font-semibold px-2 py-1 rounded-full
                ${
                  coin.change24h >= 0
                    ? "text-emerald-800 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"
                    : "text-red-800 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                }
              `}
              >
                {coin.change24h >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(coin.change24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Widget
      title="Cryptocurrency"
      onRefresh={handleRefresh}
      isLoading={isPending}
      error={state.error}
      colorScheme="emerald"
    >
      {renderCryptoContent()}
    </Widget>
  );
};

export default CryptoWidget;
