
import { Toaster } from 'react-hot-toast'
import Home from './Home/Home'
import { AppProvider } from './Context'
import "./index.css"
function Page() {
 

  return (
    <>
    <AppProvider>
    <Home/>
    <Toaster /> 
    </AppProvider>
    </>
  )
}

export default Page
