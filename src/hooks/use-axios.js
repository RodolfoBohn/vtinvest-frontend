import axios from "axios";

const BASE_URL = 'https://vtinvest-backend.herokuapp.com/'
// const BASE_URL = 'http://localhost:8100/'

export function useAxios(headers) {
  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
}
