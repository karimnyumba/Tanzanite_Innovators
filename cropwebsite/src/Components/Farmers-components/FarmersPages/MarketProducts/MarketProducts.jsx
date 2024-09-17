import { Toaster } from 'react-hot-toast'
import MarketProducts from './page'
import { AppProvider } from './Context'

function Page() {
 

  return (
    <>
    <AppProvider>
  <MarketProducts/>
    <Toaster /> 
    </AppProvider>
    </>
  )
}

export default Page
