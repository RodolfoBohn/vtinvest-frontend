import axios from "axios";

const BASE_URL = 'https://vtinvest-backend.herokuapp.com/'

export function useAxios(headers) {
  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
}
