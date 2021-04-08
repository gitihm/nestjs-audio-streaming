import * as multer from 'multer';

function randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const multerConfig = {
    // storage: multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, `${__dirname}/../../../../Data`)
    //     },
    //     filename: (req, file, cb) => {
    //         const newName = randomString();
    //         cb(null, newName + '-' + Date.now() + '.mp3')
    //     },

    // }),
    limits: { fileSize: 10 * 1024 * 1024 },
}




export default multerConfig