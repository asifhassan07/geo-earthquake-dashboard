import { create } from "zustand";

interface SelectionState {
  selectedId: string | null;
  hoverId: string | null;
  setSelectedId: (id: string | null) => void;
  setHoverId: (id: string | null) => void;
}

const useSelectionStore = create<SelectionState>((set) => ({
  selectedId: null,
  hoverId: null,
  setSelectedId: (id: string | null) => set({ selectedId: id }),
  setHoverId: (id: string | null) => set({ hoverId: id }),
}));

export default useSelectionStore;
