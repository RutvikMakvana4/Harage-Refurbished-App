import fs from "fs";
import multer from "multer";

const storeFiles = (destination, filename, single = 'single') => async (req, res, next) => {
    return new Promise((resolve, reject) => {

        const multerStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                fs.mkdirSync(destination, { recursive: true });
                cb(null, destination);
            },
            filename: (req, file, cb) => {
                const ext = file.mimetype.split("/")[1];
                cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
            },
        });
        if (single === 'single') {
            multer({ storage: multerStorage }).single(filename)(
                req,
                res,
                next
            )
        } else {
            multer({ storage: multerStorage }).array(filename)(
                req,
                res,
                next
            )
        }
    })
        .then(() => next())
        .catch((err) => {
            console.log(err);
        });

};

export default storeFiles;
