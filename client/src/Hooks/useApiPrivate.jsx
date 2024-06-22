import useUser from "./useUser"
import useRefresh from "./useRefresh"
import { apiPrivate } from "../Axios/axios"
import { useEffect } from "react"


const useApiPrivate = () => {
    const refresh = useRefresh()
    const {user} = useUser()

    useEffect(()=>{

        const req = apiPrivate.interceptors.request.use((config)=>{
            config.headers.Authorization = `Bearer ${user}`
            return config
        },(error)=>{
            return Promise.reject(error)
        });

        const res = apiPrivate.interceptors.response.use(response=>response,
            async (error)=>{
                const prevRequest = error?.config;
                if(error?.response?.status === 401 || !prevRequest?.sent)
                {
                    prevRequest.sent = true;
                    const newAccess = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccess}`;
                    return apiPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return ()=>{
            apiPrivate.interceptors.response.eject(res)
            apiPrivate.interceptors.request.eject(req)
        }

    },[user,refresh])

  return apiPrivate;
}

export default useApiPrivate
