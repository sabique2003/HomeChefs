import './App.css'
import ChefRoutes from './Routes/ChefRoutes';
import UserRoutes from './Routes/UserRoutes'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import Header from '../src/User/Components/Header'
import Footer from '../src/User/Components/Footer'


function App() {

  return (
    <>
    <Header/>
       <ChefRoutes/>
       <UserRoutes/>
      <Footer/>
    </>
  )
}

export default App
