import axios from "axios";


const api = axios.create({
    baseURL:'http://localhost:8888/',
    withCredentials:true,
    headers:{
        'Content-Type': "application/json",
    },
})


export const apiPrivate = axios.create({
    baseURL:'http://localhost:8888/',
    withCredentials:true,
    headers:{
        'Content-Type': "application/json",
    },
})


export default api;