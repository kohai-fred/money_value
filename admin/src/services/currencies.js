import axiosDashboard from "./axiosDashboard";

const URL = "/currencies";

export async function fetchAllCurrencies() {
  const response = await axiosDashboard.get(URL);
  return response.data;
}

export async function createCurrency(currency) {
  const response = await axiosDashboard.post(URL, currency);
  return response.data;
}

export async function updateCurrency(id, currency) {
  const response = await axiosDashboard.put(URL + "/" + id, currency);
  return response.data;
}

export async function deleteCurrency(currency) {
  const response = await axiosDashboard.delete(URL + "/" + currency.id, currency);
  return response.data;
}
