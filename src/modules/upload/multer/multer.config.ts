import * as multer from 'multer';
let i = 0
const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${process.cwd()}/Data`);
    },
    filename: (req, file, cb) => {
      console.log("newName" , file);
    //   cb(null, file.originalname)
     cb(null, `${i++}.mp4`)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
};

export default multerConfig;
