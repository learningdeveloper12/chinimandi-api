import fs from "fs";
import { validatorConst } from "../public/constants/validators.constant.js";

const dir = "src/public/uploads";

export const uploadImage = async (files, folder) => {
  console.log("uploadImage()");
  try {
    let directory = `src/public/uploads`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    directory = `${dir}/${folder}`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    const imagesArray = [];
    for (let image in files) {
      let directory = `${dir}/${image}`;

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      if (files[image].length > 0) {
        files[image].forEach((e) => {
          let imageName = `${Date.now()}_${e?.name}`;

          imageName = imageName.replace(/\s+/g, "");
          e.mv(`${directory}/${imageName}`);
          imagesArray.push(
            `${process.env.IMAGE_URL}/uploads/${image}/${imageName}`,
          );
        });
      } else {
        let imageName = `${Date.now()}_${files.image?.name}`;
        imageName = imageName.replace(/\s+/g, "");
        files[image].mv(`${dir}/${image}/${imageName}`);
        imagesArray.push(
          `${process.env.IMAGE_URL}/uploads/${image}/${imageName}`,
        );
      }
    }
    return { error: false, images: imagesArray };
  } catch (error) {
    console.log("uploadImage() failed error :", error);
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
    console.log("removeImages() failed error :", error);
    return { error: true, message: validatorConst.removeImageFailed };
  }
};
