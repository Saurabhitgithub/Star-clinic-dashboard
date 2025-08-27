import { Backdrop } from '@mui/material'

import { useSelector } from 'react-redux'
import gif from '../../assets/images/loader.gif'

export const Loader = () => {
  let loader = useSelector(e => e.loader)

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 99999 }} open={loader}>
      <img src={gif} className='w-[60px]' />
    </Backdrop>
  )
}
