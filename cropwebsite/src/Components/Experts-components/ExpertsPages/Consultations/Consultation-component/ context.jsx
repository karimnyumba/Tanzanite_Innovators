import { useState, createContext, useContext } from "react";
const AppContext = createContext();
const AppProvider = ({ children }) => {
    const [newPostAlert, setNewPostAlert] = useState(false)
return (
<AppContext.Provider value={{newPostAlert, setNewPostAlert}}>
{children}
</AppContext.Provider>
);
}





// custom hook
const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppProvider, useGlobalContext }