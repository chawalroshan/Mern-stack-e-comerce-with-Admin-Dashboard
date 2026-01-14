import { Router } from 'express';
import upload from '../middlewares/multer.js';
import {
  createSlider,
  getSliders,
  getActiveSliders,
  updateSlider,
  deleteSlider
} from '../controllers/homeSlider.controller.js';
import auth from '../middlewares/auth.js'; // if you have auth middleware

const homeSliderRouter = Router();

// POST /api/sliders/  (create with image)
homeSliderRouter.post('/', auth, upload.single('image'), createSlider);

// GET /api/sliders/  (admin)
homeSliderRouter.get('/', auth, getSliders);

// GET /api/sliders/active  (client)
homeSliderRouter.get('/active', getActiveSliders);

// PUT /api/sliders/:id  (update, optional new image)
homeSliderRouter.put('/:id', auth, upload.single('image'), updateSlider);

// DELETE /api/sliders/:id
homeSliderRouter.delete('/:id', auth, deleteSlider);

export default homeSliderRouter;
