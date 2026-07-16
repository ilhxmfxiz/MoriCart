import { Request, Response } from 'express';
import Service from '../models/Service';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    // build filter based on what user sends
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      // search by title - case insensitive
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      services,
      total,
      page,
      hasMore: skip + services.length < total
    });

  } catch (err: any) {
    return res.status(500).json({ statusCode: 500, message: err.message || 'Something went wrong' });
  }
};

export const getSingleService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundService = await Service.findById(id);

    if (!foundService) {
      return res.status(404).json({ statusCode: 404, message: 'Service not found' });
    }

    return res.status(200).json(foundService);

  } catch (err: any) {
    return res.status(500).json({ statusCode: 500, message: err.message || 'Something went wrong' });
  }
};