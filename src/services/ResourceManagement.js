import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const addRoomData = async (body)=>{
    return await axios.post(APIS.addRoomData,body)
}

export const getAllRoomData=async()=>{
    return await axios.get(APIS.getAllRoomData)
}

export const getRoomDataById = async(id)=>{
   const response = await axios.get(APIS.getRoomDataById.replace(":id",id));
   return  response.data;

}


export const updateRoomDataById = async(id,updateData)=>{
    return await axios.put(APIS.updateRoomDataById.replace(":id",id),updateData)

}



export const updateRoomStatusById = async (id, newStatus) =>{
  const  response =  await axios.put(APIS.updateRoomStatusById.replace(":id",id),{status: newStatus});
  return response.data;
}



 export const deleteRoomDataById = async (id) =>{
    const response = await axios.delete(APIS.deleteRoomDataById.replace(":id",id));
    return response.data;
 }

 // Room service details

 export const addRoomServiceData = async(body)=>{
    return await axios.post(APIS.addRoomServiceData,body)
 }
 

 export const getAllRoomServiceData = async (id) => {
   return await axios.get(APIS.getAllRoomServiceData.replace(":id",id))
 }


 export const getRoomServiceDataById = async(id)=>{
    const response = await axios.get(APIS.getRoomServiceDataById.replace(":id",id));
    return response.data;
 }

 export const updateRoomServiceDataById = async(id,updateData)=>{
    return await axios.put(APIS. updateRoomServiceDataById.replace(":id",id),updateData);

 }


export const updateRoomServiceStatusById = async(id,newStatus)=>{
    const response = await axios.put(APIS. updateRoomServiceStatusById.replace(":id",id),{status: newStatus});
     return response.data   
}


export const deleteRoomServiceDataById = async(id)=>{

    const response = await axios.delete(APIS.deleteRoomServiceDataById.replace(":id",id));
     return response.data;
}

// resource Equipment 

export const addResourceEquipment = async(body)=>{
   return await axios.post(APIS.addResourceEquipment,body)
}


export const getAllResourceEquipment= async () => {
  return await axios.get(APIS.getAllResourceEquipment)
}


export const getResourceEquipmentById= async(id)=>{
   const response = await axios.get(APIS.getResourceEquipmentById.replace(":id",id));
   return response.data;
}

export const updateResourceEquipmentById= async(id,updateData)=>{
   return await axios.put(APIS.updateResourceEquipmentById.replace(":id",id),updateData);

}


export const updateResourceEquipmentStatusById= async(id,newStatus)=>{
   const response = await axios.put(APIS.updateResourceEquipmentStatusById.replace(":id",id),{status: newStatus});
    return response.data   
}


export const deleteResourceEquipmentById= async(id)=>{

   const response = await axios.delete(APIS.deleteResourceEquipmentById.replace(":id",id));
    return response.data;
}


// equipment service listing


export const addEquipmentService = async(body)=>{
   return await axios.post(APIS.addEquipmentService,body)
}

export const getAllEquipmentService = async(id)=>{
   return await axios.get(APIS.getAllEquipmentService.replace(":id",id) );
   
}


export const getEquipmentServiceById = async(id)=>{
   const response= await axios.get(APIS.getEquipmentServiceById.replace(":id",id));
   return response.data;
}

export const updateEquipmentServiceById=async(id,updateData)=>{
   return await axios.put(APIS.updateEquipmentServiceById.replace(":id",id),updateData)

}


export const updateEquipmentServiceStatusById = async(id,newStatus)=>{
   const response = await axios.put(APIS.updateEquipmentServiceStatusById.replace(":id",id),{status : newStatus})
    return response.data;
}



export const deleteEquipmentServiceById = async(id)=>{
   const response =await axios.delete(APIS.deleteEquipmentServiceById.replace(":id",id));
   return response.data;
}