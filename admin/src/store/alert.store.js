import create from "vue-zustand";

const defaultAlert = {
  alert: {
    color: "", // error, success, info, warning
    title: "",
    isOpen: false,
  },
};
export const alertStore = create((set) => ({
  ...defaultAlert,
  showAlert: ({ color, title }) =>
    set((state) => {
      setTimeout(state.closeAlert, 3000);
      return (state.alert = { color, title, isOpen: true });
    }),
  closeAlert: () => set({ ...defaultAlert }),
}));
