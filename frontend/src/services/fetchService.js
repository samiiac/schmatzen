import api from "./axios"

export async function retrieveAllServices(){
 try{
 const {data} = await api.get('/api/services');
 if(data.success){
   return {services : data , error :null};
 }
 }catch(error){
  console.log(error.response.data);
  return {services:null,error:error.response.data};
 }
}


export async function retrieveServiceDetails(serviceId){
try{
 const {data} = await api.get(`/api/services/${serviceId}`);
 if(data.success){
   return {services : data , error :null};
 }
 }catch(error){
  console.log(error.response.data);
  return {services:null,error:error.response.data};
 }
}

