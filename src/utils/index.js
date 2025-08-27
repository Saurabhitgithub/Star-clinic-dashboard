import moment from 'moment'
import { startLoader, stopLoader } from '../store/slices/loaderSlice'
import { stopToast, toastaction } from '../store/slices/toastSlice'
import { store } from '../store/store'
import { uploadMultipleDocs } from '../services/authApis'

export const loader = {
  start: () => store.dispatch(startLoader()),
  stop: () => store.dispatch(stopLoader())
}

export const toast = {
  success: msg => store.dispatch(toastaction({ type: 'success', msg })),
  error: msg => store.dispatch(toastaction({ type: 'error', msg })),
  warning: msg => store.dispatch(toastaction({ type: 'warning', msg })),
  info: msg => store.dispatch(toastaction({ type: 'info', msg })),
  stop: () => store.dispatch(stopToast())
}

export const getUserData = () => {
  let userData = {}
  let data = localStorage.getItem('userData')
  if (data) {
    userData = JSON.parse(data)
  }
  return userData
}

export const searchDataWithMultipleKeys = (keyArr, allData, searchString) => {
  return allData.filter(e =>
    keyArr?.some(d =>
      e[d]?.trim()?.toLowerCase().includes(searchString?.toLowerCase()?.trim())
    )
  )
}
export const convertDateIntoSimpleDate = date => {
  return moment(date).format('DD-MM-YYYY')
}
export const findFormDirtyFields = (dirtyFields, data) => {
  return Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = data[key]
    return acc
  }, {})
}

export const convertDateIntoDateAndTimeSeprate = date => {
  return moment(date).format('YYYY-MM-DD, h:mmA')
}

export const getFullMonthNameByNumber = (monthNum, type = 'small') => {
  let isSmallType = type === 'small'

  const monthMap = {
    1: isSmallType ? 'Jan' : 'January',
    2: isSmallType ? 'Feb' : 'February',
    3: isSmallType ? 'Mar' : 'March',
    4: isSmallType ? 'Apr' : 'April',
    5: 'May',
    6: isSmallType ? 'Jun' : 'June',
    7: isSmallType ? 'Jul' : 'July',
    8: isSmallType ? 'Aug' : 'August',
    9: isSmallType ? 'Sept' : 'September',
    10: isSmallType ? 'Oct' : 'October',
    11: isSmallType ? 'Nov' : 'November',
    12: isSmallType ? 'Dec' : 'December'
  }
  return monthMap[monthNum]
}

export const uploadMultipleFilesPromise = async fileArr => {
  let promiseArr = fileArr.map(async fileData => {
    if (fileData.file) {
      let uploadedResponse = await uploadMultipleDocs([fileData.file])
      return uploadedResponse?.data?.data?.[0] || null
    }
    return fileData // Already has the required format
  })

  return await Promise.all(promiseArr)
}
