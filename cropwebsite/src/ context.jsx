import { useState, createContext, useContext } from "react";

const AppContext = createContext();
const AppProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData') )|| new Object());

    const handleSetToken = (token) => {
      setToken(token);
      localStorage.setItem('token', token);
    };
  
    const handleSetUserData = (data) => {
      setUserData(data);
      localStorage.setItem('userData', JSON.stringify(data));
    };
    
return (
<AppContext.Provider value={{token, handleSetUserData, userData, handleSetToken}}>
{children}
</AppContext.Provider>
);
}





// custom hook
const useMainContext = () => {
    return useContext(AppContext)
}

export { AppProvider, useMainContext }