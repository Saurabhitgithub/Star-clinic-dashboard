import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const getAllTeamData = async () => {
  return await axios.get(APIS.getAllTeamData)
}

export const addTeamData = async (body) =>{
  return await axios.post(APIS.addTeamData,body)
}

export const getTeamDataById = async (id) => {
 
  try {
    const response = await axios.get(APIS.getTeamDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error fetching Team data:", error);
    throw error; 
  }
};

export const updateTeamData = async (id, updateData) =>{
  return await axios.put(APIS.updateTeamData.replace(":id", id), updateData)
}


export const deleteTeamDataById = async (id) => {
  if (!id) {
    throw new Error("Surgery ID is required");
  }

  try {
    const response = await axios.delete(APIS.deleteTeamDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error deleting surgery data:", error);
    throw error; 
  }
};

// export const updateTeamStatus = async (id, newStatus) => {
//   try {
//     const response = await axios.put(APIS.updateTeamStatus.replace(":id", id), { status: newStatus });
//     return response.data; 
//   } catch (error) {
//     console.error("Failed to update surgery status:", error);
//     throw error; 
//   }
// };
export const updateTeamStatus = async (id, body) => {
  return await axios.put(APIS.updateTeamStatus + id, body);
};
