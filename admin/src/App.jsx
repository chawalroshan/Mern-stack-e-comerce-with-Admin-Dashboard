import React, { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import { createContext } from 'react'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Products from './Pages/Products/Products'
import toast, { Toaster } from 'react-hot-toast';



import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IoMdClose } from "react-icons/io";
import Slide from '@mui/material/Slide';
// import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import AddProduct from './Pages/Products/AddProduct'
import HomeSliderBanners from './Pages/HomeSliderBanners/HomeSliderBanners'
import AddHomeSlide from './Pages/HomeSliderBanners/addHomeSlide'
import Category from './Pages/Category/Category'
import AddCategory from './Pages/Category/AddCategory'
import AddSubCategory from './Pages/SubCategory/AddSubCategory'
import SubCategoryList from './Pages/SubCategory/SubCategoryList'
import Users from './Pages/Users/Users'
import Orders from './Pages/Orders/Orders'
import Forgetpassword from './Pages/ForgetPassword/Forgetpassword'
import VerifyAccount from './Pages/VerifyAccount/VerifyAccount'
import ResetPassword from './Pages/ResetPassword/ResetPassword'
import { fetchDataFromApi } from './utils/api'
import Profile from './Pages/Profile/Profile'
import AddAddress from './Pages/Address/addAddress'
import EditCategory from './Pages/Category/editCategory'
import EditSubCategory from './Pages/SubCategory/EditSubCategory'

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  const [isOpenFullScreenPanel,setIsOpenFullScreenPanel] = useState({
    open:false,
    model:''
  }
  );


  const openAlertBox = ({ type, msg }) => {
    if(type === 'success') {
      toast.success(msg);
    }
    if(type === 'error') {
      toast.error(msg);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
  
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi('/api/user/user-details').then((response)=>{
        console.log(response);
        setUserData(response.data);

        
      })
    } else {
      window.location.href = '/login';
      setIsLogin(false);
    }
  }, []); // run only once on mount

  const router = createBrowserRouter([
    {
      path: '/',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Dashboard/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/login',
      exact:true,
      element: (
        <>
        <Login/>
        </>
      )
    },
    {
      path: '/signup',
      exact:true,
      element: (
        <>
        <SignUp/>
        </>
      )
    },
    {
      path: '/products',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Products/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/homeSlider/list',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <HomeSliderBanners/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/category/list',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Category/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
  path: '/category/edit/:id',
  element: (
    <section className='main'>
      <Header/>
      <div className="containerMain flex">
        <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
          <Sidebar/>
        </div>
        <div className={`contentRight py-4 px-5 ${!isSidebarOpen ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
          <EditCategory />
        </div>
      </div>
    </section>
  )
},

    {
      path: '/subCategory/list',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <SubCategoryList/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/sub-category/edit/:id',
      element: (
        <section className='main'>
          <Header/>
          <div className="containerMain flex">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen ? 'w-[18%]' : 'w-[0px] opacity-0'} transition-all`}>
              <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${!isSidebarOpen ? 'w-[100%]' : 'w-[82%]'} transition-all`}>
              <EditSubCategory />
            </div>
          </div>
        </section>
      )
    },
    {
      path: '/users',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Users/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/orders',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Orders/>
            </div>
          </div>
        </section>
        </>
      )
    },
    {
      path: '/forgot-password',
      exact:true,
      element: (
        <>
        <Forgetpassword/>
        </>
      )
    },
    {
      path: '/verify-account',
      exact:true,
      element: (
        <>
        <VerifyAccount/>
        </>
      )
    },
    {
      path: '/reset-password',
      exact:true,
      element: (
        <>
        <ResetPassword/>
        </>
      )
    },
    {
      path: '/profile',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen===true ? 'w-[18%]' : 'w-[0px] opacity-0 '}  transition-all` } >
            <Sidebar/>
            </div>
            <div className={`contentRight py-4 px-5 ${isSidebarOpen=== false ? 'w-[100%]' : 'w-[82%]'} transition-all `}>
              <Profile/>
            </div>
          </div>
        </section>
        </>
      )
    },
  ])


  

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    openAlertBox,
    userData,
    setUserData,
  }

  return (
    <>
    <MyContext.Provider value={values}>
    <RouterProvider router={router} />

    <Dialog
        fullScreen
        open={isOpenFullScreenPanel.open}
        onClose={()=>setIsOpenFullScreenPanel({
          open:false
        })}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>setIsOpenFullScreenPanel(
                {
                  open:false
                }
              )}
              aria-label="close"
            >
              <IoMdClose />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {isOpenFullScreenPanel?.model}
            </Typography>
          </Toolbar>
        </AppBar>
       {
        isOpenFullScreenPanel?.model ==='Add Product' && <AddProduct/>
       }
       {
        isOpenFullScreenPanel?.model ==='Add Home Slide' && <AddHomeSlide/>
       }
        {
        isOpenFullScreenPanel?.model ==='Add New Category' && <AddCategory/>
       }
       {
        isOpenFullScreenPanel?.model ==='Add New Sub Category' && <AddSubCategory/>
       }
       {
        isOpenFullScreenPanel?.model ==='Add New Address' && <AddAddress/>
       }
       {/* {
        isOpenFullScreenPanel?.model ==='Edit Category' && <EditCategory/>
       } */}
      </Dialog>
      <Toaster/>

    </MyContext.Provider>
    </>
  )
}

export default App
export const MyContext = createContext();


