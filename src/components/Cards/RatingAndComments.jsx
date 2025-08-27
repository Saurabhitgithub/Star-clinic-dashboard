import React from 'react'
import style from './cards.module.css'
import { RatingStars } from '../common/RatingStars'

export const RatingAndComments = ({
  name,
  rating,
  comment,
  img,
  className,
  ...props
}) => {
  

  return (
    <div
      className={`${style.ratingAndComments_main_con} ${className}`}
      {...props}
    >
      <div>
        <div className='flex items-center gap-4'>
          <img className={style.ratingAndComment_user_image} src={img} />
          <div className={style.ratingAndComment_username}>
            {name}
            <div>
              <RatingStars length={5} rating={rating} />
            </div>
          </div>
        </div>

        <div className={style.ratingAndComment_text}>{comment}</div>
      </div>
    </div>
  )
}
