import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const STATUS_PENDING = 0;
export const STATUS_PURCHASED = 1;
export const STATUS_SOLD_OUT = 2;

export const useTacticalStore = create(
  persist(
    (set, get) => ({
      items: [],
      booths: [],
      budget: 1000,
      currentHall: '肆',

      setBudget: (amount) => set({ budget: amount }),
      setCurrentHall: (hall) => set({ currentHall: hall }),

      importData: (newBooths, newItems) => set((state) => {
        const existingItemIds = new Set(state.items.map(i => i.item_id));
        const itemsToAdd = newItems.filter(i => !existingItemIds.has(i.item_id));
        
        const existingBoothIds = new Set(state.booths.map(b => b.booth_id));
        const boothsToAdd = newBooths.filter(b => !existingBoothIds.has(b.booth_id));

        return {
          items: [...state.items, ...itemsToAdd],
          booths: [...state.booths, ...boothsToAdd],
        };
      }),

      clearData: () => set({ items: [], booths: [] }),

      toggleItemStatus: (item_id, newStatus) => set((state) => ({
        items: state.items.map(item => 
          item.item_id === item_id ? { ...item, status: newStatus } : item
        )
      })),

      toggleSTier: (item_id) => set((state) => ({
        items: state.items.map(item =>
          item.item_id === item_id ? { ...item, is_s_tier: !item.is_s_tier } : item
        )
      })),

      deleteItem: (item_id) => set((state) => {
        const newItems = state.items.filter(i => i.item_id !== item_id);
        const activeBoothIds = new Set(newItems.map(i => i.booth_id));
        const newBooths = state.booths.filter(b => activeBoothIds.has(b.booth_id));
        return { items: newItems, booths: newBooths };
      }),

      updateItem: (item_id, updates) => set((state) => ({
        items: state.items.map(item =>
          item.item_id === item_id ? { ...item, ...updates } : item
        )
      })),

      markBoothSoldOut: (booth_id) => set((state) => ({
        items: state.items.map(item => 
          (item.booth_id === booth_id && item.status === STATUS_PENDING) 
            ? { ...item, status: STATUS_SOLD_OUT } 
            : item
        )
      })),

      getShoppingData: (mode, filterPhase = '全部', sortType = 'heat') => {
        const { items, booths, currentHall } = get();
        let pendingItems = items.filter(i => i.status === STATUS_PENDING);

        if (filterPhase !== '全部') {
          pendingItems = pendingItems.filter(i => i.phase === filterPhase || i.phase === '双日');
        }

        if (mode === 'booth') {
          const boothMap = new Map();
          booths.forEach(b => {
            boothMap.set(b.booth_id, { ...b, items: [], hasSTier: false, maxHeat: 0 });
          });

          pendingItems.forEach(i => {
            if (boothMap.has(i.booth_id)) {
              const b = boothMap.get(i.booth_id);
              b.items.push(i);
              if (i.is_s_tier) b.hasSTier = true;
              if (i.cpp_heat > b.maxHeat) b.maxHeat = i.cpp_heat;
            }
          });

          let activeBooths = Array.from(boothMap.values()).filter(b => b.items.length > 0);

          activeBooths.sort((a, b) => {
            if (sortType.includes('stier')) {
              if (a.hasSTier && !b.hasSTier) return -1;
              if (!a.hasSTier && b.hasSTier) return 1;
            }

            const hallA = String(a.hall || '');
            const hallB = String(b.hall || '');
            
            if (hallA !== hallB) return hallA.localeCompare(hallB);
            
            if (sortType.includes('heat')) {
              return b.maxHeat - a.maxHeat;
            }
            
            return 0;
          });

          return activeBooths;
        }

        let filteredItems = pendingItems;
        if (mode === 'ip') {
          filteredItems = pendingItems.filter(i => i.ip_tags && i.ip_tags.length > 0);
        } else if (mode === 'cp') {
          filteredItems = pendingItems.filter(i => i.cp_tags && i.cp_tags.length > 0);
        }

        const enrichedItems = filteredItems.map(item => {
          const booth = booths.find(b => b.booth_id === item.booth_id);
          return { ...item, booth };
        });

        enrichedItems.sort((a, b) => {
          if (sortType.includes('stier')) {
            if (a.is_s_tier && !b.is_s_tier) return -1;
            if (!a.is_s_tier && b.is_s_tier) return 1;
          }
          if (sortType.includes('heat')) {
            return b.cpp_heat - a.cpp_heat;
          }
          return 0;
        });

        return enrichedItems;
      },

      getStats: () => {
        const { items, budget } = get();
        let purchasedCount = 0;
        let spent = 0;
        let soldOutCount = 0;
        let pendingCount = 0;

        items.forEach(i => {
          if (i.status === STATUS_PURCHASED) {
            purchasedCount++;
            spent += Number(i.price) || 0;
          } else if (i.status === STATUS_SOLD_OUT) {
            soldOutCount++;
          } else {
            pendingCount++;
          }
        });

        return {
          total: items.length,
          purchasedCount,
          soldOutCount,
          pendingCount,
          spent,
          budget,
          progress: budget > 0 ? (spent / budget) * 100 : 0
        };
      }
    }),
    {
      name: 'cp32_tactical_storage_v2',
    }
  )
);
