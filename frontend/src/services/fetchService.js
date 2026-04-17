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

 

export async function addService(formData){
 try{
  const {data} = await api.post('/api/services',formData);
  console.log(data);
  if(data.success){
    return {serviceAdded:true , error:null};
  }else{
    return {serviceAdded:false , error:`Failed to add service`};
  }
 }catch(error){
  console.log("Error while adding service in database",JSON.parse(error.response.data.details)[0]);
  return { serviceAdded:false , error : error.response.data.message}
 }
}

export async function editService(formData){
 
}

