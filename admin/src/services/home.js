import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export async function getAllAvalaibleExchange() {
  let result = null;
  let error = null;

  await axios
    .get(`${BASE_URL}/pairs`)
    .then((res) => {
      const { data } = res;
      result = data;
    })
    .catch((err) => {
      error = err.response.data.message ?? err.message ?? err;
    });

  return { result, error };
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
