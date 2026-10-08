export function imageUploadConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
  );
}

export function contactNotificationsConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFICATION_FROM && process.env.CONTACT_NOTIFICATION_TO,
  );
}
