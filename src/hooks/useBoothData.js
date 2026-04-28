import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'cp32_tactical_data';

export function useBoothData() {
  const [booths, setBooths] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBooths(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse local storage data');
      }
    }
  }, []);

  useEffect(() => {
    if (booths.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booths));
    }
  }, [booths]);

  const loadData = (newBooths) => {
    setBooths(newBooths);
  };

  const clearData = () => {
    setBooths([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleBoothSoldOut = (boothId) => {
    setBooths(prev => prev.map(b => 
      b.id === boothId ? { ...b, isSoldOut: !b.isSoldOut } : b
    ));
  };

  const toggleItemPurchased = (boothId, itemId) => {
    setBooths(prev => prev.map(b => {
      if (b.id === boothId) {
        return {
          ...b,
          items: b.items.map(i => 
            i.id === itemId ? { ...i, isPurchased: !i.isPurchased } : i
          )
        };
      }
      return b;
    }));
  };

  const displayBooths = useMemo(() => {
    let filtered = booths;
    
    if (hideCompleted) {
      filtered = filtered.filter(b => {
        if (b.isSoldOut) return false;
        const allPurchased = b.items.length > 0 && b.items.every(i => i.isPurchased);
        if (allPurchased) return false;
        return true;
      });
    }

    return filtered.sort((a, b) => {
      const streetCompare = a.street.localeCompare(b.street);
      if (streetCompare !== 0) return streetCompare;
      return b.heat - a.heat;
    });
  }, [booths, hideCompleted]);

  const stats = useMemo(() => {
    let totalItems = 0;
    let purchasedCount = 0;
    let soldOutBooths = 0;

    booths.forEach(b => {
      if (b.isSoldOut) soldOutBooths++;
      b.items.forEach(i => {
        totalItems++;
        if (i.isPurchased) purchasedCount++;
      });
    });

    return { totalItems, purchasedCount, soldOutBooths };
  }, [booths]);

  return {
    booths: displayBooths,
    rawBooths: booths,
    stats,
    hideCompleted,
    setHideCompleted,
    loadData,
    clearData,
    toggleBoothSoldOut,
    toggleItemPurchased
  };
}
