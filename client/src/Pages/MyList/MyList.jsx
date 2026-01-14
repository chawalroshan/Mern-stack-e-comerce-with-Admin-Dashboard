import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import { BsFillBagCheckFill } from "react-icons/bs";
import MyListItems from './MyListItems';
import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';

const MyList = () => {
  const { myList, myListLoading, removeFromMyList, isLogin, openAlertBox } = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLogin) {
      openAlertBox({ type: 'error', msg: 'Please login to view your wishlist' });
    }
    setLoading(false);
  }, [isLogin]);

  const handleRemoveItem = async (itemId, productId) => {
    await removeFromMyList(itemId, productId);
  };

  if (!isLogin) {
    return (
      <section className='py-10 w-full'>
        <div className='container'>
          <div className='bg-white p-8 rounded-lg shadow-md text-center'>
            <h2 className='text-2xl font-bold mb-4'>Login Required</h2>
            <p className='mb-6'>Please login to view your wishlist</p>
            <Link to="/login">
              <Button variant="contained" className='btn-org'>
                Login Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (myListLoading || loading) {
    return (
      <section className='py-10 w-full'>
        <div className='container'>
          <div className='text-center'>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-10 w-full'>
      <div className='container flex gap-5'>
        <div className='col1 w-[20%]'>
          <AccountSidebar />
        </div>

        <div className="col2 w-[70%]">
          <div className='shadow-md rounded-md p-1 bg-white mt-3'>
            <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)]'>
              <h2 className='text-xl font-bold'>Your Wishlist</h2>
              <p className='mt-2'>
                There are <span className='font-bold text-primary'>{myList.length}</span> 
                {myList.length === 1 ? ' product' : ' products'} in your wishlist.
              </p>
            </div>

            {myList.length === 0 ? (
              <div className='py-10 text-center'>
                <BsFillBagCheckFill className='text-6xl text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>Your wishlist is empty</h3>
                <p className='text-gray-600 mb-4'>Save items you like to your wishlist</p>
                <Link to="/productListing">
                  <Button variant="contained" className='btn-org'>
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              myList.map((item) => (
                <MyListItems
                  key={item._id}
                  item={item}
                  onRemove={() => handleRemoveItem(item._id, item.productId?._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;