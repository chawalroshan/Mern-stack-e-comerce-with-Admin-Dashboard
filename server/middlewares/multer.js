// middlewares/multer.js - Update this file
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Use the main uploads directory, not uploads/sliders
const uploadPath = path.join(process.cwd(), 'uploads');

// Create folder if missing
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // ✅ Save to main uploads folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, unique);
    }
});

const upload = multer({ storage });

export default upload;