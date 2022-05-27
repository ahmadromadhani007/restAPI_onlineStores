const multer = require("multer");
const path = require("path");
const random_text = require("../../config/random_text");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname + "/"))
    },
    filename: function (req, file, cb) {
      cb(null, random_text.random(15) + path.extname(file.originalname))
    }
  });

const imageFilter = (req, res, cb) => {
  if (file.mimetype.startWith('image')) {
    cb(null, true);
  } else {
    cb('wajib menggunakan gambar', false);
  }
};

const upload = multer(
  { storage: storage,
  imageFilter: imageFilter,
limits: {
  fileSize : 1000000
    } 
  }
)

module.exports = upload;

