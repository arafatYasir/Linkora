const fs = require("fs");

const uploadMiddleware = async (req, res, next) => {
    console.log(req);
    try {
        if(!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                error: "No file selected!"
            });
        }

        const files = Object.values(req.files).flat();

        files.forEach(file => {
            if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/svg" && file.mimetype !== "image/webp" && file.mimetype !== "image/gif") {
                removeFile(file.tempFilePath);
                return res.status(400).json({
                    error: "The file type is not supported!"
                });
            }

            if(file.size > 1024 * 1024 * 10) {
                return res.status(400).json({
                    error: "Your file is more than 10 MB"
                });
            }
        })

        next();

    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if(err) {
            throw err;
        }
    })
}

module.exports = uploadMiddleware