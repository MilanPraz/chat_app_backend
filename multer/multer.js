const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("hahahahahaah");
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb({ status: 400, message: "Unsupported File Format" }, false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
