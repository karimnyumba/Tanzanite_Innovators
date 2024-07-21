import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Create the context with default values

// Define a type for the user state. Modify as per your user model
interface User {
    id: string;
    username: string;
    email: string;
  }
  
  // Define the shape of your context
  interface AuthContextType {
    user: User | null;
    loggedIn:boolean;
    login_user: (email: string,username:string,id:string) => void;
    logout_user: () => void;
    checkUserLoggedIn:()=>void;
    get_user_data:()=>{ 
      email:string | null,
      id:string | null,
      username:string | null,
  
    }
  }

  
const AuthContext = createContext<AuthContextType>( {
  user:null,
loggedIn:false,
  login_user: ()=>{},
  logout_user:()=>{},
  checkUserLoggedIn:()=>{},
  get_user_data:()=>{return {
    email:"",
    id:"",
    username:""

  }}

}
);

// Define props type for the provider to accept children
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn,setLoggedIn] =useState(false)

  const login_user = (email: string,username:string,id:string) => {
    // Implement login_user functionality
    console.log("Login called with:", email, username);
    // For example, setting user directly here:
    setUser({ id:id, username: username, email: email });
    setLoggedIn(true)
    localStorage.setItem('id', id);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  };

  const logout_user = () => {
    // Implement logout functionality
    console.log("Logout called");
    setUser(null);
    setLoggedIn(false)
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('email')
  };

  const get_user_data=()=>{
    if (typeof window !== "undefined") {
    if (localStorage.getItem('id') !== null) {
    return{
      id:localStorage.getItem('id'),
      email:localStorage.getItem('email'),
      username:localStorage.getItem('username')
    }}
    else{
      return{
        id:"",
        email:"",
        username:""
      }

    }
  }
  else{
    return{
      id:"",
      email:"",
      username:""
    }}
    
  }

  const checkUserLoggedIn = () => {
    // Optionally, validate token with the server
    if (localStorage.getItem('id') === null) {
      console.log("User is logged in:", user);
      // Set user state or validate token
        setLoggedIn(false)

    }
    else{
      setLoggedIn(true)
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login_user, logout_user ,checkUserLoggedIn,loggedIn,get_user_data}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext<AuthContextType>(AuthContext);
