import { ref } from "vue";
import { fetchAllAvailableExchanges, fetchAllExchanges } from "../services/exchanges";

export function useExchanges() {
  const exchanges = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchExchanges() {
    isLoading.value = true;

    try {
      const response = await fetchAllExchanges();

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

export function useAvailableExchanges() {
  const availableExchanges = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchAvailableExchanges() {
    isLoading.value = true;

    try {
      const response = await fetchAllAvailableExchanges();

      availableExchanges.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
  fetchAvailableExchanges();

  return { availableExchanges, fetchAvailableExchanges };
}
