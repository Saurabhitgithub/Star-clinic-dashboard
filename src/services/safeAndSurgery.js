import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const addSurgeriesdata = async (body) =>{
  return await axios.post(APIS.addSurgeriesdata,body)
}

export const getAllSurgeriesData = async () => {
  return await axios.get(APIS.getAllSurgeriesData)
}

export const updateSurgeriesData = async (id, updateData) =>{
  return await axios.put(APIS.updateSurgeriesData.replace(":id", id), updateData)
}

export const getSurgeryDataById = async (id) => {
 
  try {
    const response = await axios.get(APIS.getSurgeryDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error fetching surgery data:", error);
    throw error; 
  }
};

export const deleteSurgeryDataById = async (id) => {
  if (!id) {
    throw new Error("Surgery ID is required");
  }

  try {
    const response = await axios.delete(APIS.deleteSurgeryDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error deleting surgery data:", error);
    throw error; 
  }
};


export const updateSurgeriesStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updateSurgeriesStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
};
