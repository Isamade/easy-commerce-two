import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';

import Upload from '../models/uploadModel.js';
import { fileURLToPath } from 'url';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      'pic'
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
  uploadSingleImage(req, res, async function (err) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    const upload = new Upload({
      pic: fs.readFileSync(path.resolve(__dirname, '../../uploads', 'pic')),
      contentType: `${req.file.mimetype}`
    });
    const createdUpload = await upload.save();
  
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/api/upload/${createdUpload._id}`,
    });
  });
});

router.get('/:id', async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const upload = await Upload.find({_id: req.params.id});
    if (upload.lenght !== 0) {
      const location = path.resolve(__dirname, '../../uploads');
      fs.writeFileSync(`${location}/${req.params.id}.${upload[0].contentType.split('/')[1]}`, upload[0].pic, function(err) {
        if (err) {
          return res.sendStatus(400);
        }
      })
      res.sendFile(`${location}/${req.params.id}.${upload[0].contentType.split('/')[1]}`);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

export default router;
