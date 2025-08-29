import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Home from './Pages/Home/Home'
import ProductListing from './Pages/ProductListing/ProductListing'
import Footer from './components/Footer/Footer'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import ProductDetails from './Pages/ProductDetails/ProductDetails'

import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

import ProductZoom from './components/ProductZoom/ProductZoom'
import { IoClose } from "react-icons/io5"
import ProductDetailsComponent from './components/ProductDetails/ProductDetails'
import Cart from './Pages/Cart/Cart'
import Verify from './Pages/Verify/Verify'
import toast, { Toaster } from 'react-hot-toast';
import ForgetPassword from './Pages/ForgetPassword/Forgetpassword'
import Checkout from './Pages/Checkout/Checkout'
import MyAccount from './Pages/MyAccount/MyAccount'
import MyList from './Pages/MyList/MyList'
import Orders from './Pages/Orders/Orders'
import { fetchDataFromApi } from './utils/api'


const MyContext = createContext();

function App() {


  const [openCartPanel, setOpenCartPanel] = useState(false);

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };


  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [fullWidth, setFullWidth] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
  
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi('/api/user/user-details').then((response)=>{
        console.log(response);
        setUserData(response.data);
      })
    } else {
      setIsLogin(false);
    }
  }, []); // run only once on mount
  

  const openAlertBox = ({ type, msg }) => {
    if(type === 'success') {
      toast.success(msg);
    }
    if(type === 'error') {
      toast.error(msg);
    }
  }
  

  // ✅ Now this line is safe
  const values = {
    setOpenProductDetailsModal,
    openProductDetailsModal,
    setOpenCartPanel,
    openCartPanel,
    toggleCartPanel,
    openAlertBox,
    isLogin,
    setIsLogin,
    userData,
    setUserData,

  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/productListing' element={<ProductListing />} />
            <Route path='/product/:id' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/forgot-password' element={<ForgetPassword/>} />
            <Route path='/checkout' element={<Checkout/>} />
            <Route path='/my-account' element={<MyAccount/>} />
            <Route path='/my-list' element={<MyList/>} />
            <Route path='/orders' element={<Orders/>} />
           

          </Routes>
          <Footer />

          <Toaster/>

          <Dialog
            open={openProductDetailsModal}
            onClose={handleCloseProductDetailsModal}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            className='productDetailsModal'
          >
            <DialogContent>
              <div className='flex items-center w-full productDetailsModalContainer relative'>
                <Button
                  className='!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[black] !absolute top-[0px] right-[0px] !bg-[#f1f1f1]'
                  onClick={handleCloseProductDetailsModal}
                >
                  <IoClose className='text-[22px]' />
                </Button>
                <div className="col1 w-[40%]">
                  <ProductZoom />
                </div>
                <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
                  <ProductDetailsComponent />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </MyContext.Provider>
      </BrowserRouter>


      

    </>
  );
}

export default App;
export { MyContext };
