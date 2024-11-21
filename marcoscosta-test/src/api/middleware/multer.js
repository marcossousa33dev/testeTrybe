const multer = require('multer');
const path = require('path');

const multerConfig = {
  dest: path.resolve('./src/uploads'),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve('./src/uploads'));
    },
    filename: (req, file, cb) => {
      const filename = `${req.params.id}.jpeg`;
      cb(null, filename);
    },
  }),  
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg'];

    if(allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File format invalid'));
    }
  }
}

module.exports = multerConfig;