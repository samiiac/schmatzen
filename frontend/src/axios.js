import axios from 'axios';

// export async function request(method, url, headers, payload) {

//   const BASE_URL = `http://localhost:3000/${url}`;

//   const reqHeaders = {
//     "Content-Type": "application/json",
//     Authorization: "token from context if any",
//     ...headers,
//   };

//   const options = {
//     method: method,
//     headers: reqHeaders,
//   };

//   if (method == "POST") {
//     options.body = JSON.stringify(payload);
//   }

//   try {
//     const response = await fetch(BASE_URL, options);

//     const data = await response.json();
//     if (data.success == false) {
//       console.log("Error : ", data.message);
//     }
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }

const api = axios.create({
  baseURL:"http://localhost:3000"
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