const cloudinary = require("cloudinary");
const fs = require("fs");
const { resolve } = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadImage = async (req, res) => {
    try {
        const { path } = req.body;
        const files = Object.values(req.files).flat();
        const images = [];

        for (const file of files) {
            const url = await uploadToCloudinary(file, path);
            images.push(url);

            removeFile(file.tempFilePath);
        }

        res.send({
            images
        })

    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

const listImages = async (req, res) => {
    try {
        const {path, sorting, maxLimit} = req.query;

        const images = await cloudinary.v2.search
        .expression(`folder:${path}/*`)
        .sort_by("public_id", sorting)
        .max_results(maxLimit)
        .execute()

        res.send(images);
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

const uploadToCloudinary = async (file, path) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: path
        },
        (err, res) => {
            if (err) {
                removeFile(file.tempFilePath);
                return reject(err);
            }

            resolve({
                url: res.secure_url
            })
        })
    })
}

const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if(err) {
            throw err;
        }
    })
}

module.exports = { uploadImage, listImages }