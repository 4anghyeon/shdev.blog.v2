import { create } from "zustand";

interface PostState {
  title: string;
  setTitle: (title: string) => void;
}

export const usePostStore = create<PostState>()((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
}));
