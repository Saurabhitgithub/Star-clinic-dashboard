import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const getAllLabTestData= async () => {
      return await axios.get(APIS.getAllLabTestData);

}

export const addLabTestData = async (body) =>{
  return await axios.post(APIS.addLabTestData,body)
}

 export const editLabData= async(id,updateData)=>{
     return await axios.put(APIS.editLabData.replace(":id",id),updateData)
 
 }
 

 export const getLabManagementDataById= async(id)=>{
     const response = await axios.get(APIS.getLabManagementDataById.replace(":id",id));
     return  response.data;
  
  }




  // medical condition management

  export const addMedicalConditionData = async (body) =>{
  return await axios.post(APIS.addMedicalConditionData,body)
}

export const getAllMedicalConditionData= async (id) => {
    const response = await axios.get(APIS.getAllMedicalConditionData.replace(":id", id));
    return response.data;
}

 export const getMedicalConditionById = async(id)=>{
     const response = await axios.get(APIS.getMedicalConditionById.replace(":id",id));
     return  response.data;
  
  }


   export const updateMedicalConditionById= async(id,updateData)=>{
     return await axios.put(APIS.updateMedicalConditionById.replace(":id",id),updateData)
 
 }

  export const deleteMedicalConditionById = async(id)=>{
     const response = await axios.delete(APIS.deleteMedicalConditionById.replace(":id",id));
     return  response.data;
  
  }

   export const updateMedicalConditionStatusById = async (id, body) => {
    return await axios.put(APIS.updateMedicalConditionStatusById + id, body);
  };