const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    //Appending .jpeg jpg png

    if (file.mimetype === 'image/jpeg') {
      cb(null, Date.now() + '.jpeg');
    } else if (file.mimetype === 'image/jpg') {
      cb(null, Date.now() + '.jpg');
    } else if (file.mimetype === 'image/png') {
      cb(null, Date.now() + '.png');
    } else if (file.mimetype === 'video/mp4') {
      cb(null, Date.now() + '.mp4');
    } else {
      cb(null, false);
      return cb(new Error('This format is not allowed'));
    }
  },
  onError: function (err, next) {
    console.log('error', err);
    res.status(400).json(err);
    next();
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
