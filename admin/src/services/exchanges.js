import axios from "axios";
import axiosDashboard from "./axiosDashboard";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;
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

export async function deleteExchange({ exchange1, exchange2 }) {
  const data = await axios
    .all([
      axiosDashboard.delete(`${URL}/${exchange1.id}`, exchange1),
      axiosDashboard.delete(`${URL}/${exchange2.id}`, exchange2),
    ])
    .then(axios.spread((response1, response2) => [response1.data, response2.data]))
    .catch((err) => {
      console.error("📛 Error create", err);
      return err;
    });
  return data;
}

export async function fetchAllAvailableExchanges() {
  const response = await axiosDashboard.get(`${URL}/available_pairs`);
  return response.data;
}

export async function convertCurrencies({ codeIso1, codeIso2, amount }) {
  let result = null;
  let error = null;
  await axios
    .get(`${BASE_URL}/${codeIso1}/${codeIso2}/${amount}`)
    .then((res) => {
      const { data } = res;
      result = data;
    })
    .catch((err) => {
      error = err.response.data.message ?? err.message ?? err;
    });

  return { result, error };
}
