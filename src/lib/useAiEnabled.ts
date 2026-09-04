import { useEffect, useState } from "react";
import { fetchAiEnabled } from "./ai";

/**
 * `null` while the check is in flight, then `true`/`false`.
 *
 * Callers should render nothing until this is `true`. Treating `null` as
 * "enabled" would flash the AI controls on every page load and then remove
 * them a moment later on any deployment without a key.
 */
export function useAiEnabled(): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetchAiEnabled().then((value) => {
      if (active) setEnabled(value);
    });
    return () => {
      active = false;
    };
  }, []);

  return enabled;
}
