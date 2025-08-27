import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const addFormTemplateData = async(body)=>{
    return await axios.post(APIS.addFormTemplateData,body)
}

export const getAllFormTemplateData = async()=>{
    return await axios.get(APIS.getAllFormTemplateData)
}

export const getFormTemplateById = async(id)=>{
    const response = await axios.get(APIS.getFormTemplateById.replace(":id",id));
    return  response.data;
 
 }
 
 
 export const updateFormTemplateById= async(id,updateData)=>{
     return await axios.put(APIS.updateFormTemplateById.replace(":id",id),updateData)
 
 }
 
 
  export const deleteFormTemplateById = async (id) =>{
     const response = await axios.delete(APIS.deleteFormTemplateById.replace(":id",id));
     return response.data;
  }