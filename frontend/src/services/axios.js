import axios from "axios";


const api = axios.create({
  baseURL:"http://localhost:3000/"
})

api.interceptors.request.use((config)=>{
  try{
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(localStorage.getItem('user')).token:null;
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
}catch(error){
  console.log(error);
}
 return config;
})

export default api;