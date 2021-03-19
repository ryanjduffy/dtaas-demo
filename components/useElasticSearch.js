import { useCallback } from "react";

function useElasticSearch({ size = 200 } = {}) {
  // "https://0c58fde6b89c4428a26b6c5a39f52e87.us-west-1.aws.found.io:9243",
  const base = "https://74q6kqoh6b.execute-api.us-west-2.amazonaws.com";
  const searchUrl = `${base}/dt-events/_search`;
  const docUrl = `${base}/dt-events/_doc`;

  const headers = () => ({
    Authorization: `Basic ${btoa("elastic:yJVP3ctRZPgq249CWA7cf0Jm")}`,
    "Content-Type": "application/json"
  });

  const fetchData = useCallback(
    (filter) => {
      return fetch(searchUrl, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          size,
          sort: [{ ts: "desc" }],
          query: {
            bool: {
              filter
            }
          }
        })
      })
        .then((resp) => resp.json())
        .then((json) => {
          return json.hits.hits.map((d) => ({ _id: d._id, ...d._source }));
        });
    },
    [searchUrl, size]
  );

  const fetchAggregate = useCallback(
    (precision, filter) => {
      return fetch(searchUrl, {
        headers: headers(),
        method: "POST",
        body: JSON.stringify({
          size: 0,
          aggregations: {
            grid: {
              geohash_grid: {
                field: "location",
                precision: precision
              }
            }
          }
        })
      })
        .then((resp) => resp.json())
        .then((json) => {
          return json.aggregations.grid.buckets;
        });
    },
    [searchUrl]
  );

  const update = useCallback(
    ({ _id, ...doc }) => {
      return fetch(`${docUrl}/${_id}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(doc)
      });
    },
    [docUrl]
  );

  return {
    fetchAggregate,
    fetchData,
    update
  };
}

export default useElasticSearch;
export { useElasticSearch };
