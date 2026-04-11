import { createContext,useMemo,useState } from "react";


export const UserAuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('user'))|| '');
  
  

  const login = (user)=>{
    localStorage.setItem('user',JSON.stringify(user));
    setUser(user);
  }

  const logout = ()=>{
    localStorage.removeItem('user');
    setUser(null);
  }

  const authValue = useMemo(()=>({
     user:user,
     login,
     logout
  }),[user])

  return (
    <UserAuthContext.Provider value={authValue }>
      {children}
    </UserAuthContext.Provider>
  );
}
