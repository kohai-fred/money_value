import { ref } from "vue";
import { convertCurrencies, getAllAvalaibleExchange } from "../services/home";

export function useChangeCurrency() {
  const resultChange = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function changeCurrency({ codeIso1, codeIso2, amount }) {
    isLoading.value = true;
    const response = await convertCurrencies({ codeIso1, codeIso2, amount });
    resultChange.value = response.result;
    error.value = response.error;
    isLoading.value = false;
  }

  return { resultChange, changeCurrency, isLoading, error };
}

export function useGetAllExchanges() {
  const resultExchanges = ref(null);
  const isLoading = ref(false);
  const errorExchanges = ref(null);

  async function fetchAll() {
    isLoading.value = true;
    const response = await getAllAvalaibleExchange();
    console.log("🚀 ~ file: home.js:28 ~ fetchAll ~ response:", response);
    resultExchanges.value = response.result;
    errorExchanges.value = response.error;
    isLoading.value = false;
  }

  fetchAll();

  return { resultExchanges, isLoading, errorExchanges };
}
