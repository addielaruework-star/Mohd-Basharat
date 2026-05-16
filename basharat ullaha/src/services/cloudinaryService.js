export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dummy';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'dummy';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Note: Unsigned deletion from frontend is generally not supported by Cloudinary for security reasons.
// Usually, you'd need a backend or a signed request to delete.
// For now, we will just remove the reference from Firestore.
export const deleteImageFromCloudinary = async (imageUrl) => {
  console.log('Frontend deletion for Cloudinary is typically restricted without a backend. Removing reference from database only.', imageUrl);
  // In a full production app, you would call a serverless function or backend to delete the asset from Cloudinary via API.
  return true;
};
