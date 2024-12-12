import React,{useContext} from 'react'
import { Route,Routes } from 'react-router-dom'
import Landing from '../User/Pages/Landing'
import UserAuth from '../User/Pages/UserAuth'
import UserHome from '../User/Pages/UserHome'
import ItemView from '../User/Pages/ItemView'
import MyOrders from '../User/Pages/MyOrders'
import Cart from '../User/Pages/Cart'
import UserAccount from '../User/Pages/UserAccount'
import CheckOut from '../User/Pages/CheckOut'
import CategoryPage from '../User/Components/Home/CategoryPage'
import { tokenContext } from '../Contextapi/TokenContext'

function UserRoutes() {
  const {tokenStatus,setTokenStatus}=useContext(tokenContext)

  return (
    <>
    <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/userauth' element={tokenStatus?<UserHome/>:<UserAuth/>}/>
        <Route path='/home' element={tokenStatus?<UserHome/>:<UserAuth/>}/>
        <Route path="/item/:id" element={tokenStatus?<ItemView/>:<UserAuth/>} />
        <Route path="/category/:category" element={tokenStatus?<CategoryPage />:<UserAuth/>} />
        <Route path="/cart" element={tokenStatus?<Cart/>:<UserAuth/>} />
        <Route path="/userorder" element={tokenStatus?<MyOrders/>:<UserAuth/>} />
        <Route path="/useracc" element={tokenStatus?<UserAccount/>:<UserAuth/>} />
        <Route path="/checkout" element={tokenStatus?<CheckOut/>:<UserAuth/>} />
    </Routes>
    </>
  )
}

export default UserRoutes