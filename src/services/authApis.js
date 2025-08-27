import axios from 'axios'
import { APIS, BASE_URL } from './endpoints'

export const login = async body => {
  return await axios.post(BASE_URL + APIS.login, body)
}
export const forgotPassword = async body => {
  return await axios.post(BASE_URL + APIS.forgotPassword, body)
}
export const passwordReset = async body => {
  return await axios.post(BASE_URL + APIS.passwordReset, body)
}
export const uploadMultipleDocs = async filesArr => {
  const formData = new FormData()
  for (let i = 0; i < filesArr.length; i++) {
    formData.append('files', filesArr[i])
  }
  return await axios.post(BASE_URL + APIS.uploadMultipleDocsData, formData)
}
