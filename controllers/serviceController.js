//create a service 
const createService = async (req, res) => {  //admin 
  const {
    name,
    price,
    details,
    serviceType,
    availability,
    images,
    deliveryType,
  } = req.body;
  res.status(201).json({ message: "createService API working" });
};

//retrieve all services
const getAllServices = async (req, res) => {
  res.status(200).json({ message: "getAllServices API working" });
};

//retrieve a specific service
const getService = async (req, res) => {
  res.status(200).json({ message: "getService API working" });
};

//update a specific service
const updateService = async (req, res) => {  //admin
  res.status(200).json({ message: "updateService API working" });
};

//delete a specific service
const deleteService = async (req, res) => {  //admin
  res.status(204).json({ message: "deleteService API working" });
};

export {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
};
