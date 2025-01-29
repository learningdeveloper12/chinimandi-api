import multer from "multer";
// const { max_file_size } = require("../../utils/constant");

const storage = multer.memoryStorage(); // Store files in memory buffer
const max_file_size =50
// Define file upload limits and allowed MIME types (optional)
const fileUpload = multer({
    storage: storage,
    limits: { fileSize: max_file_size * 1024 * 1024 }, // size limit
    fileFilter: (req, file, cb) => {
        if (req.files && req.files.length > max_file_size) {
            return cb(new Error(`You can upload a maximum of 5 files.`));
        }
        // const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/svg+xml','text/csv']; // Allowed file types
        // if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        // } else {
        //     cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
        // }
    },
});

// Error-handling middleware for Multer
const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        return response400(res, err.message);
    }
    else {
        next();
    }
};

export { fileUpload, multerErrorHandler }