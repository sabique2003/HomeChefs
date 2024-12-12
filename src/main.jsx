import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '../styles.css'
import './index.css'
import '../scripts.js'
import { Toaster } from 'react-hot-toast'
import ContextApi from './Contextapi/ContextApi.jsx'
import TokenContext from './Contextapi/TokenContext.jsx'
import ChefContextApi from './Contextapi/ChefContextApi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <TokenContext>
    <ContextApi>
      <ChefContextApi>
    <App />
    </ChefContextApi>
    </ContextApi>
    </TokenContext>
    </BrowserRouter>
    <Toaster/>
  </StrictMode>,
)
