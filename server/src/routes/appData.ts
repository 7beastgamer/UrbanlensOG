import express from 'express';
import type { Response } from 'express';
import AppData from '../models/AppData';
import { protect } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const data = await AppData.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { title, content } = req.body;
    const newData = await AppData.create({
      user: req.user._id,
      title,
      content,
    });
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const data = await AppData.findById(req.params.id);

    if (!data) {
      res.status(404).json({ message: 'Data not found' });
      return;
    }

    if (data.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const updatedData = await AppData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const data = await AppData.findById(req.params.id);

    if (!data) {
      res.status(404).json({ message: 'Data not found' });
      return;
    }

    if (data.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await data.deleteOne();
    res.json({ message: 'Data removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
