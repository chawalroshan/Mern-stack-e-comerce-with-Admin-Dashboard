import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import { createContext } from 'react'

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    }
  ])

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
  }

  return (
    <>
    <MyContext.Provider value={values}>
    <RouterProvider router={router} />
    </MyContext.Provider>
    </>
  )
}

export default App
export const MyContext = createContext();


