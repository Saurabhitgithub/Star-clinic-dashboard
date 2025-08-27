import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const addBlankFormData = async(body)=>{
    return await axios.post(APIS.addBlankFormData,body)
}

export const getAllBlankFormData = async()=>{
    return await axios.get(APIS.getAllBlankFormData)
}

export const getBlankFormById= async(id)=>{
    const response = await axios.get(APIS.getBlankFormById.replace(":id",id));
    return  response.data;
 
 }
 
 
 export const updateBlankFormById= async(id,updateData)=>{
     return await axios.put(APIS.updateBlankFormById.replace(":id",id),updateData)
 
 }
 
 

//  export const updateNewsStatusById = async (id, body) => {
//   return await axios.put(APIS.updateNewsStatusById + id, body);
// };
 
 
 
  export const deleteBlankFormById = async (id) =>{
     const response = await axios.delete(APIS.deleteBlankFormById.replace(":id",id));
     return response.data;
  }