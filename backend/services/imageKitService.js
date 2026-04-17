import ImageKit from 'imagekit';

let imagekit = null;

const getClient = () => {
  if (imagekit) return imagekit;
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) return null;
  imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });
  return imagekit;
};

export const uploadToImageKit = async ({ file, fileName, folder = '/products' }) => {
  const client = getClient();
  if (!client) throw new Error('ImageKit is not configured');
  const uploaded = await client.upload({ file, fileName, folder });
  return {
    url: uploaded.url,
    fileId: uploaded.fileId,
    name: uploaded.name,
  };
};
