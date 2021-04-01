import classnames from "classnames/bind";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import typeToLabel from "../../util/eventTypes";

import PinIcon from "./PinIcon";

import css from "./Map.module.css";
const cx = classnames.bind(css);

const TooltipSingletonContext = React.createContext(null);

const TooltipProvider = ({ children }) => {
  const [current, setCurrent] = useState(null);
  const value = useMemo(() => ({ current, setCurrent }), [current, setCurrent]);

  return (
    <TooltipSingletonContext.Provider value={value}>
      {children}
    </TooltipSingletonContext.Provider>
  );
};

function useTooltipState(defaultValue = undefined, timeout = 800) {
  const ctx = useContext(TooltipSingletonContext);
  const ref = useRef({ timer: 0 });
  const [value, setValue] = useState(defaultValue);
  const show = useCallback(() => {
    if (ref.current.timer) clearTimeout(ref.current.timer);

    if (ctx) ctx.setCurrent(ref.current);
    setValue(true);
  }, [ctx, ref, setValue]);
  const hide = useCallback(() => {
    if (ref.current.timer) clearTimeout(ref.current.timer);

    ref.current.timer = setTimeout(() => setValue(false), timeout);
  }, [ref, setValue, timeout]);

  useEffect(() => {
    if (ctx && ctx.current !== ref.current) {
      setValue(false);
    }
  }, [ctx]);

  return [value, show, hide];
}

function MapPin({ onSelect, point, selected, ...rest }) {
  const ref = useRef(null);
  const [active, show, hide] = useTooltipState(false);
  const [side, setSide] = useState("bottomRight");

  // Positions the popup when near the edges (favoring bottomRight)
  useLayoutEffect(() => {
    if (!active) return;

    const { offsetHeight, offsetWidth } = ref.current.offsetParent;
    const px = ref.current.offsetLeft / offsetWidth;
    const py = ref.current.offsetTop / offsetHeight;

    setSide(`${py > 0.8 ? "top" : "bottom"}${px > 0.8 ? "Left" : "Right"}`);
  }, [active]);

  return (
    <div
      {...rest}
      className={cx({ dialog: true, active, selected }, side)}
      onClick={() => {
        hide();
        onSelect(point);
      }}
      onMouseOver={show}
      onMouseOut={hide}
      ref={ref}
    >
      <PinIcon />
      <div className={css.content}>{typeToLabel(point.eventType)}</div>
    </div>
  );
}

export default MapPin;
export { TooltipProvider, MapPin };
