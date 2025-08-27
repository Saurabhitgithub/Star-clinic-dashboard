import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const addBusinessDetails = async(body)=>{
    return await axios.post(APIS.addBusinessDetails,body)
}

export const getAllBusinessDetails = async()=>{
    return await axios.get(APIS.getAllBusinessDetails)
}

export const getBusinessDetailsById = async(id)=>{
    const response = await axios.get(APIS.getBusinessDetailsById.replace(":id",id));
    return  response.data;
 
 }
 
 
 export const updateBusinessDetails = async(id,updateData)=>{
     return await axios.put(APIS.updateBusinessDetails.replace(":id",id),updateData)
 
 }
 
 

 
  export const deleteBusinessDetailsById = async (id) =>{
     const response = await axios.delete(APIS.deleteBusinessDetailsById.replace(":id",id));
     return response.data;
  }