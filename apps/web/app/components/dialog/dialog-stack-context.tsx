import { createContext, useCallback, useMemo, useState } from 'react';

type DialogStackItem = {
  id: string;
  Component: any;
  props: any;
};

type DialogStackContextValue = {
  dialogs: DialogStackItem[];
  addDialog: (card: DialogStackItem) => void;
  removeDialog: (id: string) => void;
  clear: () => void;
};

export type DialogPassThroughProps = {
  onClose: () => void;
};

export const DialogStackContext = createContext<DialogStackContextValue>({
  dialogs: [],
  addDialog: () => {},
  removeDialog: () => {},
  clear: () => {},
});

export function DialogStackProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogStackItem[]>([]);

  const clear = useCallback(() => setDialogs([]), []);
  const addDialog = useCallback(
    (dialog: DialogStackItem) => setDialogs((state) => [...state, dialog]),
    [],
  );
  const removeDialog = useCallback(
    (id: string) => setDialogs((state) => state.filter((card) => card.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({ dialogs, addDialog, removeDialog, clear }),
    [addDialog, dialogs, clear, removeDialog],
  );
  return <DialogStackContext.Provider value={value}>{children}</DialogStackContext.Provider>;
}
