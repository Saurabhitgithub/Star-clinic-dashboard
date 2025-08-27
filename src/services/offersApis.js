
import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const updateBestOffer=async(id,body)=>{
    return await axios.put(APIS.updateBestOffer+id,body)
}
export const getBestOffer=async(body)=>{
    return await axios.get(APIS.getBestOffer,body)
}
export const addBestOffer = async (data) => {
    return axios.post(APIS.addBestOffer, data); 
  };
  export const getBestOfferDataById= async(id)=>{
    const response = await axios.get(APIS.getBestOfferDataById.replace(":id",id));
    return  response.data;
 
 }
  
export const deleteBestOffer=async(id)=>{
    return await axios.delete(APIS.deleteBestOffer+id)
}
export const addAllergy = async (data) => {
  return axios.post(APIS.addAllergy, data);
};
export const getAllAllergy = async (id) => {
  return await axios.get(APIS.getAllAllergy+id)
};
export const getAllergyById = async (id) => {
  return await axios.get(APIS.getAllergyById+id)
};
export const updateAllergyById = async (id,data) =>{
  return await axios.put(APIS.updateAllergyById+id,data)
};
export const deleteAllergy=async(id)=>{
return await axios.delete(APIS.deleteAllergy+id)
}
export const addclientProblem = async (data) => {
    return axios.post(APIS.addclientProblem, data); 
  };
  export const getAllClientProblem = async (id) => {
    return axios.get(APIS.getAllClientProblem+id); 
  };
  export const getClientProblemById = async (id) => {
    return await axios.get(APIS.getClientProblemById+id);
};
export const deleteClientProblem = async (id) =>{
    return await axios.delete(APIS.deleteClientProblem+id)
};
export const updateClientProblemById = async (id,data) =>{
    return await axios.put(APIS.updateClientProblemById+id,data)
};
export const addCategory = async (data) => {
    return axios.post(APIS.Addcategory, data); 
  };
  export const getAllCategory = async (data) => {
    return await axios.get(APIS.getAllCategory,data);
};
export const addEducation = async (data) => {
    return axios.post(APIS.addEducation, data); 
  };
  export const getAllEducation = async () => {
    return axios.get(APIS.getAllEducation); 
  };
  export const addEducationCategory = async (data) => {
    return axios.post(APIS.addEducationCategory, data); 
  };
  export const getAllEducationCategory = async (data) => {
    return await axios.get(APIS.getAllEducationCategory,data);
};
  export const deleteEducationDataById = async (id) =>{
     const response = await axios.delete(APIS.deleteEducationDataById.replace(":id",id));
     return response.data;
  }



export const addDrug = async (data) => {
  return axios.post(APIS.addDrug, data); 
}
export const getAllDrug = async () => {
  return await axios.get(APIS.getAllDrug)
};
export const updateDrugById = async (id,data) =>{
  return await axios.put(APIS.updateDrugById + id,data)
};
export const getDrugById = async (id) => {
  return await axios.get(APIS.getDrugById + id)
};
  
export const deleteDrug=async(id)=>{
  return await axios.delete(APIS.deleteDrug + id)
}

export const addPhotos = async data => {
  return axios.post (APIS.addPhotos, data);
};
 
export const getAllAlbums = async (id) => {
  return await axios.get (APIS.getAllAlbums + id);
};
 
export const updatePhotosById = async (id, data) => {
  console.log (id, 'id');
  return await axios.put (APIS.updatePhotosById + id, data);
};
 
export const getPhotosById = async (id) => {
  return await axios.get (APIS.getPhotosById + id);
};

export const addBeforeAfter = async data => {
  return axios.post (APIS.addBeforeAfter, data);
};

export const addPatchTest = async (data) => {
  return axios.post(APIS.addPatchTest, data); 
}
export const getAllPatchTest = async (id) => {
  return await axios.get(APIS.getAllPatchTest + id)
};
export const getPatchTestById = async (id) => {
  return await axios.get(APIS.getPatchTestById + id)
};
export const updatePatchTestById = async (id,data) =>{
  return await axios.put(APIS.updatePatchTestById + id,data)
};
export const deletePatchTest=async(id)=>{
  return await axios.delete(APIS.deletePatchTest + id)
}

export const getAllPaymentData = async () => {
  return await axios.get (APIS.getAllPaymentData );
};
export const updateOrderStatus = async (id,data) =>{
  return await axios.put(APIS.updateOrderStatus + id,data)
};
export const addCoupon = async (data) => {
  return axios.post(APIS.addCoupon, data);
}
export const getAllCoupont = async () => {
  return await axios.get(APIS.getAllCoupon)
};
export const deleteCoupon=async(id)=>{
  return await axios.delete(APIS.deleteCoupon + id)
}
 
 
export const getUserCardData = async (id) => {
  return await axios.get(APIS.getUserCardData +id)
};