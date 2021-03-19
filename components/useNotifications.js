import { useEffect, useState } from "react";

import useElasticSearch from "./useElasticSearch";

function useNotifications({ onNewItems }) {
  const [recent, setRecent] = useState([]);
  const [recentTimestamp, setRecentTimestamp] = useState(Date.now());
  const { fetchData: fetchNotifications } = useElasticSearch({ size: 10 });

  useEffect(() => {
    if (!recentTimestamp) return;

    let interval = setInterval(() => {
      fetchNotifications([{ range: { ts: { gt: recentTimestamp } } }]).then(
        (data) => {
          if (data.length) {
            const lastTimestamp = data.reduce(
              (ts, v) => (v.ts > ts ? v.ts : ts),
              0
            );
            setRecentTimestamp(lastTimestamp);
            onNewItems(data);
            setRecent((current) => [...current, ...data]);
          }
        }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications, recentTimestamp, setRecent, onNewItems]);

  return [recent, setRecent];
}

export default useNotifications;
export { useNotifications };
