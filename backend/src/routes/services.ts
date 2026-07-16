import { Router } from 'express';
import { getAllServices, getSingleService } from '../controllers/serviceController';

const servicesRouter = Router();

// public routes - anyone can browse services
servicesRouter.get('/', getAllServices);
servicesRouter.get('/:id', getSingleService);

export default servicesRouter;