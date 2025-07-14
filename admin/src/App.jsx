import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard/Dashboard'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      exact:true,
      element: (
        <>
        <section className='main'>
          <Header/>
          <div className="containerMain flex ">
            <div className="sidebarWrapper w-[25%]">
            <Sidebar/>
            </div>
          </div>
        </section>
        </>
      )
    }
  ])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
