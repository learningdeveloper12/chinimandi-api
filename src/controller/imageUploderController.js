import { uploadFile } from "../lib/file-uploder/index.js";


export const addImage = async (req, res) => {
  const data = {
    message: "Image uploaded successfully",
  };

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let url = [];
    await Promise.all(
      req.files.map(async (val) => {
        const fileurl = await uploadFile(val, ['jpeg', 'jpg', 'png']);
        url.push(fileurl);
      })
    );

    return res.status(201).json({
      ...data,
      image: url, 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
