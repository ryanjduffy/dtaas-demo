import { useEffect, useRef, useState } from "react";

function useChartResize(initialAspectRatio, factor = 1) {
  const wrapperRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio);
  useEffect(() => {
    if (!wrapperRef.current) return;

    let id;
    const handler = () => {
      const bounds = wrapperRef.current.getBoundingClientRect();
      setAspectRatio((factor * bounds.width) / bounds.height);
    };

    const debounce = () => {
      clearTimeout(id);
      id = setTimeout(handler, 200);
    };

    window.addEventListener("resize", debounce);

    return () => window.removeEventListener("resize", debounce);
  }, [setAspectRatio, wrapperRef]);

  return { aspectRatio, ref: wrapperRef };
}

export default useChartResize;
export { useChartResize };
