
import { Navigate, Outlet } from 'react-router'
import { Sidebar } from '../Sidebar/Sidebar'

export const SidebarLayout = () => {
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')

  if (!token || !refreshToken) {
    return <Navigate to={'/'} />
  }

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  )
}
