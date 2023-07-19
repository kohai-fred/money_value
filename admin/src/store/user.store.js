import create from "vue-zustand";
import { getTokenStorage, removeTokenStorage, setTokenStorage } from "../utils/storage";

export const userStore = create((set) => ({
  token: getTokenStorage(),
  setToken: (token) =>
    set(() => {
      setTokenStorage(token);
      return { token };
    }),
  removeToken: () =>
    set(() => {
      removeTokenStorage();
      return { token: null };
    }),
}));
