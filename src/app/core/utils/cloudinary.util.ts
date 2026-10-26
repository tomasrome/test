/** Inserta f_auto,q_auto,w_X[,c_fill,ar_Y] tras /upload/ (solo URLs de res.cloudinary.com). */
export function optimizeCloudinaryUrl(url: string, width: number, aspectRatio?: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const parts = ['f_auto', 'q_auto', `w_${width}`];
  if (aspectRatio) parts.push('c_fill', `ar_${aspectRatio}`);
  return url.replace('/upload/', `/upload/${parts.join(',')}/`);
}
