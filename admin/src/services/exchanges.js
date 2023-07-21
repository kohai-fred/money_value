import axios from "axios";
import axiosDashboard from "./axiosDashboard";

const URL = "/exchanges";

export async function fetchAllExchanges() {
  const response = await axiosDashboard.get(URL);
  return response.data;
}

export async function createExchange(exchange1, exchange2) {
  const data = await axios
    .all([axiosDashboard.post(URL, exchange1), axiosDashboard.post(URL, exchange2)])
    .then(axios.spread((response1, response2) => [response1.data, response2.data]))
    .catch((err) => {
      console.error("📛 Error create", err);
      return err;
    });
  return data;
}

export async function updateExchange({ id1, id2, exchange1, exchange2 }) {
  const data = await axios
    .all([axiosDashboard.put(`${URL}/${id1}`, exchange1), axiosDashboard.put(`${URL}/${id2}`, exchange2)])
    .then(axios.spread((response1, response2) => [response1.data, response2.data]))
    .catch((err) => {
      console.error("📛 Error create", err);
      return err;
    });
  return data;
}

export async function deleteExchange(exchange) {
  const response = await axiosDashboard.delete(URL + "/" + exchange.id, exchange);
  return response.data;
}

export async function fetchAllAvailableExchanges() {
  const response = await axiosDashboard.get(`${URL}/available_pairs`);
  return response.data;
}
