import axiosDashboard from "./axiosDashboard";

const URL = "/exchanges";

export async function fetchAllExchanges() {
  const response = await axiosDashboard.get(URL);
  return response.data;
}

export async function createExchange(exchange) {
  const response = await axiosDashboard.post(URL, exchange);
  return response.data;
}

export async function updateExchange(id, exchange) {
  const response = await axiosDashboard.put(URL + "/" + id, exchange);
  return response.data;
}

export async function deleteExchange(exchange) {
  const response = await axiosDashboard.delete(URL + "/" + exchange.id, exchange);
  return response.data;
}
