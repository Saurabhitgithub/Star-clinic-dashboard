import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

// for category section Api Integration

export const  getAllCategoryData = async () => {
  return await axios.get(APIS.getAllCategoryData)
}

export const addCategoryData = async (body) =>{
  return await axios.post(APIS.addCategoryData,body)
}

export const getCategoryDataById = async (id) => {
 
  try {
    const response = await axios.get(APIS.getCategoryDataById.replace(":id",id));
    return response.data; 
  } catch (error) {
    console.error("Error fetching Team data:", error);
    throw error; 
  }
};

export const updateCategoryDataById = async (id, updateData) =>{
  return await axios.put(APIS.updateCategoryDataById.replace(":id", id), updateData)
}


export const deleteCategoryDataById = async (id) => {
  if (!id) {
    throw new Error("Surgery ID is required");
  }

  try {
    const response = await axios.delete(APIS.deleteCategoryDataById.replace(":id", id));
    return response.data; 
  } catch (error) {
    console.error("Error deleting surgery data:", error);
    throw error; 
  }
};

export const updateCategoryStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updateCategoryStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
};


// Service Section Api integration

export const getAllServiceData= async ()=>{

  return await axios.get(APIS.getAllServiceData)

}


export const addServiceData=async(Body)=>{

  return await axios.post(APIS.addServiceData,Body);
}


export const getServiceDataById=async(id)=>{
 const  response = await axios.get(APIS.getServiceDataById.replace(":id",id));
 return response.data;

}


export const updateServiceDataById= async(id,updateData)=>{
 return await axios.put(APIS.updateServiceDataById.replace(":id",id),updateData)
}


export const deleteServiceDataById = async(id)=>{
  const response = await axios.delete(APIS.deleteServiceDataById.replace(":id",id));

  return response.data;
}

export const  updateServiceStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updateServiceStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
};
 
   // package section 

export const  getAllPackageData = async () => {
  return await axios.get(APIS.getAllpackageData)
}

export const addPackageData = async (body) =>{
  return await axios.post(APIS.addPackageData,body)
}

export const getPackageDataById=async(id)=>{
  const  response = await axios.get(APIS.getPackageDataById.replace(":id",id));
  return response.data;
 
 }

 export const updatePackageDataById= async(id,updateData)=>{
  return await axios.put(APIS.updatePackageDataById.replace(":id",id),updateData)
 }

 export const deletePackageDataById = async(id)=>{
  const response = await axios.delete(APIS.deletePackageDataById.replace(":id",id));

  return response.data;
}


export const updatePackageStatus = async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updatePackageStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
}



//  bundle section api 

export const  getAllBundleData = async () => {
  return await axios.get(APIS.getAllBundleData)
}

export const addBundleData = async (body) =>{
  return await axios.post(APIS.addBundleData,body)
}

export const getBundleDataById=async(id)=>{
  const  response = await axios.get(APIS.getBundleDataById.replace(":id",id));
  return response.data;
 
 }

 export const updateBundleDataById= async(id,updateData)=>{
  return await axios.put(APIS.updateBundleDataById.replace(":id",id),updateData)
 }

 export const deleteBundleDataById = async(id)=>{
  const response = await axios.delete(APIS.deleteBundleDataById.replace(":id",id));

  return response.data;
}


export const updateBundleStatus= async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updateBundleStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
}

// for bundle item 

export const  getAllBundleItemData = async (id) => {
  return await axios.get(APIS.getAllBundleItemData.replace(":id",id))
}

export const  addBundleItemData = async (body) =>{
  return await axios.post(APIS.addBundleItemData,body)
}

export const getBundleItemDataById=async(id)=>{
  const  response = await axios.get(APIS.getBundleItemDataById.replace(":id",id));
  return response.data;
 
 }

 export const updateBundleItemDataById= async(id,updateData)=>{
  return await axios.put(APIS.updateBundleItemDataById.replace(":id",id),updateData)
 }

 export const deleteBundleItemDataById= async(id)=>{
  const response = await axios.delete(APIS.deleteBundleItemDataById.replace(":id",id));

  return response.data;
}


export const updateBundleItemStatus= async (id, newStatus) => {
  try {
    const response = await axios.put(APIS.updateBundleItemStatus.replace(":id", id), { status: newStatus });
    return response.data; 
  } catch (error) {
    console.error("Failed to update surgery status:", error);
    throw error; 
  }
}