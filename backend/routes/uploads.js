import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// POST /api/uploads/image
router.post('/image', authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file provided' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'naijascout/images', 'image');

        res.status(201).json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/uploads/video
router.post('/video', authenticate, upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No video file provided' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'naijascout/videos', 'video');

        res.status(201).json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                duration: result.duration
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
