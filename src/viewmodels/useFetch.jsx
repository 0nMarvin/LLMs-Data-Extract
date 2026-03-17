import { useState, useCallback } from "react";
import { fetchApi } from "../services/api.service";

const useFetch = () => {
  const [data, setData]       = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (url, options) => {
    setError(null);
    setLoading(true);
    try {
      const result = await fetchApi(url, options);
      setData(result.json);
      return result;
    } catch (err) {
      setError(err.message);
      setData(null);
      return { response: null, json: null };
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
};

export default useFetch;