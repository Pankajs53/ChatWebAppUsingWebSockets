import multer from "multer";

// to access/parse form+json data
export const multerUpload = multer({
  limits: {
    fileSize: 2024 * 2024 * 5,
  },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentMulter = multerUpload.array("files",10);
export {singleAvatar,attachmentMulter};
