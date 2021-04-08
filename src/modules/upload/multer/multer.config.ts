import * as multer from 'multer';

function randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const multerConfig = {
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
}




export default multerConfig