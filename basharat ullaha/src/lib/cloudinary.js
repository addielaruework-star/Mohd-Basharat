const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Compresses an image using Canvas before upload.
 */
const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height);
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to WebP at 85% quality
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { 
              type: 'image/webp', 
              lastModified: Date.now() 
            }));
          } else {
            resolve(file); // fallback to original if compression fails
          }
        }, 'image/webp', 0.85);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Uploads an image to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise<{url: string, publicId: string}>} - Resolves with the secure URL and public ID.
 */
export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, and WEBP are supported.");
  }

  // Validate file size (max 10MB before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds the 10MB limit.");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env");
  }

  // Compress image
  const compressedFile = await compressImage(file);

  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
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
    
    // Optimize Cloudinary URL delivery (f_auto, q_auto)
    let optimizedUrl = data.secure_url;
    if (optimizedUrl.includes('/upload/')) {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return {
      url: optimizedUrl,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
