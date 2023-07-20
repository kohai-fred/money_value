import { ref } from "vue";
import { fetchAllCurrencies } from "../services/currencies";
import { userStore } from "../store/user.store";

export function useCurrencies() {
  const currencies = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchCurrencies() {
    isLoading.value = true;

    try {
      const response = await fetchAllCurrencies();

      currencies.value = response;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }
  fetchCurrencies();

  return { currencies, isLoading, error };
}
