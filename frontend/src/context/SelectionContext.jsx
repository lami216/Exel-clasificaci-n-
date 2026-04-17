import { createContext, useContext, useMemo, useState } from 'react';

const SelectionContext = createContext(null);

export const SelectionProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const setQuantity = (product, quantity) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.product._id === product._id);
      if (quantity <= 0) return prev.filter((p) => p.product._id !== product._id);
      if (existing) {
        return prev.map((p) => (p.product._id === product._id ? { ...p, quantity } : p));
      }
      return [...prev, { product, quantity }];
    });
  };

  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, setQuantity, clear }), [items]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => useContext(SelectionContext);
