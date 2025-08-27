import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const getAllDocumentData= async (id) => {
    const response = await axios.get(APIS.getAllDocumentData.replace(":id", id));
    return response.data;
}

export const AddDocumentData = async (body) =>{
  return await axios.post(APIS.AddDocumentData,body)
}

export const getDocumentDataById = async (id) => {
 
  try {
    const response = await axios.get(APIS.getDocumentDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error fetching Team data:", error);
    throw error; 
  }
};

export const updateDocumentData = async (id, updateData) =>{
  return await axios.put(APIS.updateDocumentData.replace(":id", id), updateData)
}


export const DeleteDocumentDataById = async (id) => {
  if (!id) {
    throw new Error("Document ID is required");
  }

  try {
    const response = await axios.delete(APIS.DeleteDocumentDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error deleting surgery data:", error);
    throw error; 
  }
};

// export const updateDocumentStatus = async (id, newStatus) => {
//   try {
//     const response = await axios.put(APIS.updateDocumentStatus.replace(":id", id), { status: newStatus });
//     return response.data; 
//   } catch (error) {
//     console.error("Failed to update Document status:", error);
//     throw error; 
//   }
// };
export const updateDocumentStatus = async (id, body) => {
  return await axios.put(APIS.updateDocumentStatus + id, body);
};

export const getAllPatientCertificateData= async (id) => {
  const response = await axios.get(APIS.getAllPatientCertificateDataById + id)
  return response.data;
}
export const getAllFinancialsData = async (id) => {
    const response = await axios.get(APIS.getAllFinancialsData.replace(":id", id));
    return response.data;
}
