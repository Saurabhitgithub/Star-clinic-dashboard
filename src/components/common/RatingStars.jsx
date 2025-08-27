import React from 'react'
import { StarIcon } from '../Icons/SvgIcons'

export const RatingStars = ({ length = 5, rating }) => {
  const arr = [...new Array(length)]
  return (
    <div className='flex'>
      {arr.map((res, key) => {
        return (
          <StarIcon
            key={key}
            backgroundColor={rating > key ? 'orange' : null}
            fill={'orange'}
          />
        )
      })}
    </div>
  )
}
