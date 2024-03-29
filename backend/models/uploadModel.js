import mongoose from 'mongoose';

const uploadSchema = mongoose.Schema(
  {
    pic: Buffer,
    contentType: String,
    productId: String
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;