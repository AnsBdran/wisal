import { writeAsyncIterableToWritable } from '@remix-run/node';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// async function uploadImage(data: AsyncIterable<Uint8Array>) {
//   const uploadPromise = new Promise(async (resolve, reject) => {
//     const uploadStream = cloudinary.v2.uploader.upload_stream(
//       {
//         folder: 'wisal',
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//           return;
//         }
//         resolve(result);
//       }
//     );
//     await writeAsyncIterableToWritable(data, uploadStream);
//   });

//   return uploadPromise;
// }

// console.log('configs', cloudinary.v2.config());
// export { uploadImage };

export const uploadImage = async (
  imageFile: File
): Promise<{ secure_url: string; format: string; public_id: string }> => {
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image', folder: 'wisal' },
      (error, result) => {
        if (error) {
          console.error('error in uploading to cloudinary', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
