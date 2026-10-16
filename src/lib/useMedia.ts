import { useEffect, useState } from "react";

export function useMedia(query: string) {
  const [coincide, setCoincide] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const f = () => setCoincide(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [query]);
  return coincide;
}
