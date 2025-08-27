import axios from './axiosInterceptor'
// import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const getAllSpecialitiesData = async () => {
  return await axios.post(APIS.getAllSpecialitiesData)
}
