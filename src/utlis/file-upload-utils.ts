import { NotAcceptableException } from '@nestjs/common';

export const imageFileFilter = (req, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new NotAcceptableException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};
