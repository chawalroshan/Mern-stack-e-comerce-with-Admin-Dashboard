import React from 'react'
import { Link } from 'react-router-dom';

const BannerBox = (props) => {
  return (
    <div className='box bannerBox overflow-hidden rounded-lg group '>
        <Link to='/'>
                <img src={props.img} className='w-full transition-all group-hover:scale-110 rotate-[0.5]' alt='banner'/>
                </Link>
                 </div>
  )
}

export default BannerBox
