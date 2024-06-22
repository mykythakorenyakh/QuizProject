import { useContext,createContext } from "react";
import { useState } from "react";


export const UserContext = createContext({});

const UserProvider = ({children}) => {

    const [user,setUser] = useState(null)
    const [persist,setPersist] = useState(localStorage.getItem('KeepLogged')||false)

  return (
    <UserContext.Provider value={{user,setUser,persist,setPersist}}> 
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider
