import {Router} from 'express';
import { validateServiceBody } from '../middleware/validation.js';
import zod from 'zod';
import { createService, deleteService, getAllServices, getService, updateService } from '../controllers/serviceController.js';


// const serviceSchema = zod.object({
//     name:
//     price:
//     details:
//     serviceType:
//     availability:
//     images:
//     deliveryType:
// })

const router = Router();

router.get('/',getAllServices);

router.get('/:id',getService);

router.post('/',createService);

router.patch('/:id',updateService);

router.delete('/:id',deleteService);

export default router;