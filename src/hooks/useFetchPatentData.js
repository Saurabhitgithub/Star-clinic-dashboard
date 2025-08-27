import { useEffect, useState } from 'react'

export const useFetchPatientAppointmentData = () => {
  const [formattedData, setFormattedData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({
    error: false,
    errorMsg: ''
  })
  const [allData, setAllData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('/api/patients')
        
        setData(response.data)
      } catch (err) {
        setError({
          error: true,
          errorMsg: err
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return { formattedData, isLoading, error }
}
