
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Home from './Pages/Home/Home'
import ProductListing from './Pages/ProductListing/ProductListing'
import Footer from './components/Footer/Footer'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import ProductDetails from './Pages/ProductDetails/ProductDetails'


function App() {
 

  return (
    <>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' exact={true} element={<Home/>} />
      <Route path='/productListing' exact={true} element={<ProductListing/>} />
      <Route path='/product/:id' exact={true} element={<ProductDetails/>} />
            <Route path='/login' exact={true} element={<Login/>} />
            <Route path='/register' exact={true} element={<Register/>} />

    </Routes>
    <Footer/>
     </BrowserRouter>

    </>
  )
}

export default App
