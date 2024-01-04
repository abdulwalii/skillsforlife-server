import multer from "multer";

// storage destination for station photos
let stationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/stationImages");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/");
    cb(null, `${new Date().getTime()}.${extension[1]}`);
  },
});

// storage destination for insurance photos
let insuranceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/insuranceImages");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/");
    cb(null, `${new Date().getTime()}.${extension[1]}`);
  },
});

// function to upload station photos
export const uploadStationImage = multer({
  storage: stationStorage,
  fileFilter: (req, file, cb) => {
    if (!file) cb(null, false);
    else cb(null, true);
  },
});

// function to upload insurance photos
export const uploadInsuranceImage = multer({
  storage: insuranceStorage,
  fileFilter: (req, file, cb) => {
    if (!file) cb(null, false);
    else cb(null, true);
  },
});
