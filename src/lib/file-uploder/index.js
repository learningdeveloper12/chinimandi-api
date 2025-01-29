import { v2 as cloudinary }  from "cloudinary";
import { extractPublicId } from 'cloudinary-build-url';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadFile = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path,{
            folder: 'eventPortal',
            resource_type: 'auto'
        });
        return result.secure_url;

    } catch (error) {
        console.log("uploadFile ~ error:", error)
        return { status: 500, message: error.message };
    }
};

const uploadFileBuffer = async (file) => {
    try {
        const base64String = file.buffer.toString('base64');

        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64String}`, {
            folder: 'eventPortal',
            resource_type: 'auto'
        });
        return result.secure_url;

    } catch (error) {
        console.log("uploadFile ~ error:", error)
        return { status: 500, message: error.message };
    }
};

const deleteImage = async (cloudinaryUrl) => {
    try {

        const publicId = extractPublicId(cloudinaryUrl)
        await cloudinary.uploader.destroy(publicId);

        return { status: 200, message: 'Image deleted successfully' };
    } catch (error) {
        console.log("deleteImage ~ error:", error);
        return { status: 500, message: error.message };
    }
};

export { uploadFile, uploadFileBuffer,deleteImage };