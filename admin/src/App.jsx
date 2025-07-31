import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import { createContext } from 'react'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUP/SignUp'
import Products from './Pages/Products/Products'



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

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const [isOpenFullScreenPanel,setIsOpenFullScreenPanel] = useState({
    open:false,
    model:''
  }
  );


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
  ])


  

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
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
      </Dialog>

    </MyContext.Provider>
    </>
  )
}

export default App
export const MyContext = createContext();


