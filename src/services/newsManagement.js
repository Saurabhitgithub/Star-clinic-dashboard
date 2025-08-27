import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'


export const addNewsData = async(body)=>{
    return await axios.post(APIS.addNewsData,body)
}

export const getAllNewsData = async()=>{
    return await axios.get(APIS.getAllNewsData)
}

export const getNewsDataById= async(id)=>{
    const response = await axios.get(APIS.getNewsDataById.replace(":id",id));
    return  response.data;
 
 }
 
 
 export const updateNewsDataById= async(id,updateData)=>{
     return await axios.put(APIS.updateNewsDataById.replace(":id",id),updateData)
 
 }
 
 
 
//  export const updateNewsStatusById= async (id, newStatus) =>{
//    const  response =  await axios.put(APIS.updateNewsStatusById.replace(":id",id),{status: newStatus});
//    return response.data;
//  }
 export const updateNewsStatusById = async (id, body) => {
  return await axios.put(APIS.updateNewsStatusById + id, body);
};
 
 
 
  export const deleteNewsDataById = async (id) =>{
     const response = await axios.delete(APIS.deleteNewsDataById.replace(":id",id));
     return response.data;
  }