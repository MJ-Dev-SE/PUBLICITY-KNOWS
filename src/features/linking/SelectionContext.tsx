import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Selection =
  | { type: "project"; id: string }
  | { type: "entity"; id: string }
  | null;

interface SelectionApi {
  selection: Selection;
  openProject: (id: string) => void;
  openEntity: (id: string) => void;
  close: () => void;
}

const SelectionCtx = createContext<SelectionApi | null>(null);

export function SelectionProvider({
  children,
  initialSelection = null,
}: {
  children: ReactNode;
  initialSelection?: Selection;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);

  const api = useMemo<SelectionApi>(
    () => ({
      selection,
      openProject: (id: string) => setSelection({ type: "project", id }),
      openEntity: (id: string) => setSelection({ type: "entity", id }),
      close: () => setSelection(null),
    }),
    [selection],
  );

  return (
    <SelectionCtx.Provider value={api}>{children}</SelectionCtx.Provider>
  );
}

export function useSelection(): SelectionApi {
  const ctx = useContext(SelectionCtx);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
