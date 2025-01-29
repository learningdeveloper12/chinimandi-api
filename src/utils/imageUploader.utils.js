import fs from "fs";

const dir = "src/public/uploads";

export const uploadImage = async (files, folder) => {
  console.log("uploadImage()");
  try {
    let directory = `${dir}/${folder}`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const imagesArray = [];

    // Check if files is an array or a single file
    if (Array.isArray(files)) {
      files.forEach((file) => {
        let imageName = `${Date.now()}_${file.originalname}`;
        imageName = imageName.replace(/\s+/g, "");

        const filePath = `${directory}/${imageName}`;

        // Move file to the destination
        fs.renameSync(file.path, filePath);

        imagesArray.push(
          `https://chinimandy-event-portal-backend.onrender.com/uploads/${folder}/${imageName}`,
        );
      });
    } else {
      let imageName = `${Date.now()}_${files.originalname}`;
      imageName = imageName.replace(/\s+/g, "");

      const filePath = `${directory}/${imageName}`;

      // Move file to the destination
      fs.renameSync(files.path, filePath);

      imagesArray.push(
        `${process.env.IMAGE_URL}/uploads/${folder}/${imageName}`,
      );
    }

    return { error: false, images: imagesArray };
  } catch (error) {
    console.log("uploadImage() failed error", error);
    return { error: true, message: "Failed To Upload Image" };
  }
};

export const removeImages = (files, path) => {
  try {
    const imageName = files.map((e) => {
      const parts = e.split("/");
      const filename = parts[parts.length - 1];
      return filename;
    });
    if (imageName) {
      imageName.map((e) => {
        try {
          fs.unlinkSync(`${path}${e}`);
        } catch (error) {
          console.log(error);
        }
      });
    }
    return;
  } catch (error) {
    // logger.error(`removeImages() failed error : ${error}`);
    console.log("removeImages() failed error", error);
    return { error: true, message: "Failed To Remove Image" };
  }
};
