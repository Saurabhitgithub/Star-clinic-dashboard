import axios from "../../services/axiosInterceptor";

import { APIS, BASE_URL } from "../../services/endpoints";

export const getAllLeads = async (body) => {
  return await axios.get(APIS.getAllLeads, body);
};
export const addLeadData = async (data) => {
  return axios.post(APIS.addLeadData, data); 
};
export const updateLeadData = async (id, body) => {
  return await axios.put(APIS.updateLeadData + id, body);
};
export const deleteLeadData = async (id) => {
  return await axios.delete(APIS.deleteLeadData + id);
};
export const getAllSpecialitiesData = async (body) => {
  return await axios.post(APIS.getAllSpecialitiesData, body);
};
export const getLeadById = async (id) => {
  return await axios.get(`${APIS.getLeadById}/${id}`);
};
export const addNewPipeline = async (data) => {
  return axios.post(APIS.addNewPipeline, data); 
};
export const getAllPipeline = async (body) => {
    return await axios.get(APIS.getAllPipeline, body);
  };
  export const getAllPipelineById = async (id) => {
    return await axios.get(`${APIS.getAllPipelineById}/${id}`);
  };
  export const updatePipelineData = async (id , body) => {
    return await axios.put(APIS.updatePipelineData + id, body)
  };
  export const getLeadsByPipeline = async (id) => {
    return await axios.get(`${APIS.getLeadsByPipeline}/${id}`);
  };
  export const addLeadNote = async (data) => {
    return axios.post(APIS.addLeadNote, data); 
  };
