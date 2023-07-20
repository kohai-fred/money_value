import { ref } from "vue";
import { fetchAllExchanges } from "../services/exchanges";

export function useExchanges() {
  const exchanges = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchExchanges() {
    isLoading.value = true;

    try {
      const response = await fetchAllExchanges();
      console.log("🚀 ~ file: exchanges.js:14 ~ fetchExchanges ~ response:", response);

      exchanges.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
  fetchExchanges();

  return { exchanges, isLoading, error };
}
