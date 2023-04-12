import multer from "multer";

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "images");
	},
	filename(req, file, cb) {
		cb(
			null,
			new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
		);
	},
});

const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];

const fileFilter = (req, file, cb) => {
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

export default multer({
	storage: storage,
	fileFilter: fileFilter,
});
