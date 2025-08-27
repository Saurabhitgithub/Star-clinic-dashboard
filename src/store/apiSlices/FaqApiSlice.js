import axios from "../../services/axiosInterceptor";

import { APIS, BASE_URL } from "../../services/endpoints";

export const getAllFaq = async (body) => {
  return await axios.get(APIS.getAllFaq, body);
};
export const createFaq = async (data) => {
  return axios.post(APIS.createFaq, data); 
};
export const updateFaq = async (id, body) => {
  return await axios.put(APIS.updateFaq + id, body);
};
export const deleteFaq = async (id) => {
  return await axios.delete(APIS.deleteFaq + id);
};

export const getFaqById = async (id) => {
  return await axios.get(`${APIS.getFaqById}/${id}`);
};


