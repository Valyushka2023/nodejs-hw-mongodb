
import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const SMTP = {
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'user@example.com',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'password',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@example.com',
};


export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'cloud_name',
  API_KEY: process.env.CLOUDINARY_API_KEY || 'api_key',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || 'api_secret',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
