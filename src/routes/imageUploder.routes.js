import { Router } from "express";
import multer from "multer"; // Import multer
import { addImage } from "../controller/imageUploderController.js";

const routes = new Router();

const storage = multer.diskStorage({

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

// Set file size limit and filter to only allow image files
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only png, jpg, jpeg files are allowed"));
    }
  },
}).array("image", 10);

const PATH = {
  DETAILS: "/",
};

// routes.route(PATH.DETAILS).post(upload, addImage);
routes.route(PATH.DETAILS).post((req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: `Multer error: ${err.message}` });
      }
      return res.status(400).json({ message: err.message });
    }
    await addImage(req, res)
  });
});

export default routes;
