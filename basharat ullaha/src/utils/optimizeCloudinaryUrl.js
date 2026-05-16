export const optimizeCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  if (url.includes('f_auto') && url.includes('q_auto') && url.includes('w_1200')) {
    return url;
  }

  const parts = url.split('/upload/');
  
  if (parts.length === 2) {
    return `${parts[0]}/upload/f_auto,q_auto,w_1200/${parts[1]}`;
  }

  return url;
};
