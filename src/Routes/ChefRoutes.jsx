import React,{useContext} from 'react'
import { Route,Routes } from 'react-router-dom'
import ChefAuth from '../Chef/Pages/ChefAuth'
import ChefHome from '../Chef/Pages/ChefHome'
import ChefItems from '../Chef/Pages/ChefItems'
import EditChefProfile from '../Chef/Pages/EditChefProfile'
import OrdersChef from '../Chef/Pages/OrdersChef'
import { tokenContext } from '../Contextapi/TokenContext'
import Analytics from '../Chef/Pages/Analytics'

function ChefRoutes() {
  const {tokenStatus,setTokenStatus}=useContext(tokenContext)

  return (
    <>
    <Routes>
        <Route  path='/chefauth' element={<ChefAuth/>}/>
        <Route  path='/chefhome' element={tokenStatus?<ChefHome/>:<ChefAuth/>}/>
        <Route  path='/myitems' element={tokenStatus?<ChefItems/>:<ChefAuth/>}/>
        <Route  path='/editchef' element={tokenStatus?<EditChefProfile/>:<ChefAuth/>}/>
        <Route  path='/ordersforme' element={tokenStatus?<OrdersChef/>:<ChefAuth/>}/>
        <Route  path='/analytics' element={tokenStatus?<Analytics/>:<ChefAuth/>}/>

    </Routes>
    </>
  )
}

export default ChefRoutes