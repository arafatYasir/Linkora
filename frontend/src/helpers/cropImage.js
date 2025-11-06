// Load the image into memory (making a copy of the real one)
const createImage = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener("load", () => {
            resolve(image);
        });
        image.addEventListener("error", (error) => {
            reject(error);
        });

        image.src = url;
    });
};

// Convert degree to radian
const getRadianAngle = (degree) => {
    return (degree * Math.PI) / 180;
};

const rotatedSize = (width, height, rotation) => {
    const rotateRadian = getRadianAngle(rotation);

    return {
        width: Math.abs(Math.cos(rotateRadian) * width) + Math.abs(Math.sin(rotateRadian) * height),
        height: Math.abs(Math.sin(rotateRadian) * width) + Math.abs(Math.cos(rotateRadian) * height)
    };
};

// Crop the image
export const getCroppedImage = async (
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = {horizontal: false, vertical: false}
) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if(!ctx) {
        throw new Error("Could not get canvas context");
    }

    const rotateRadian = getRadianAngle(rotation);
    const {width: bBoxWidth, height: bBoxHeight} = rotatedSize(image.width, image.height, rotation);

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotateRadian);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if(!blob) {
                reject(new Error("Unable to create blog!"));
                return;
            }

            resolve(blob);
        }, "image/webp", 0.9);
        ;
    });
};