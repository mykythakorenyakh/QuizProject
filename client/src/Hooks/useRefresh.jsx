import useUser from "./useUser"
import api from "../Axios/axios"

const useRefresh = () => {
    const {setUser} = useUser()

    async function refresh(){
        try {
            const data = (await api.get('auth/refresh')).data
            setUser(data);
            return data;
            
        } catch (error) {
            return null;   
        }
    }

  return refresh;
}

export default useRefresh
