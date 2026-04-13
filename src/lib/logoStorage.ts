/**
 * Logo Storage Utilities
 * Handles JSON serialization and retrieval of logo metadata
 */

export interface LogoMetadata {
  bucket: 'school-logos' | 'media-logos';
  path: string;
  fileName: string;
  schoolName: string;
  uploadedAt: string;
  userId: string;
  url?: string;
}

export interface LogoStorageData {
  school_logo: LogoMetadata | null;
  media_logo: LogoMetadata | null;
  lastUpdated: string;
}

/**
 * Create logo storage JSON structure
 */
export function createLogoStorageData(
  schoolLogoMetadata?: LogoMetadata,
  mediaLogoMetadata?: LogoMetadata
): LogoStorageData {
  return {
    school_logo: schoolLogoMetadata || null,
    media_logo: mediaLogoMetadata || null,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Parse logo metadata from JSON string
 */
export function parseLogoMetadata(jsonString: string): LogoStorageData {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse logo metadata:', error);
    return {
      school_logo: null,
      media_logo: null,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Convert logo paths to full metadata with URLs
 */
export function createLogoMetadataFromPaths(
  schoolLogoPath?: string,
  mediaLogoPath?: string,
  schoolName: string = '',
  userId: string = ''
): LogoStorageData {
  const schoolLogo = schoolLogoPath
    ? {
        bucket: 'school-logos' as const,
        path: schoolLogoPath,
        fileName: schoolLogoPath.split('/').pop() || 'school-logo',
        schoolName: schoolName,
        uploadedAt: new Date().toISOString(),
        userId: userId,
      }
    : null;

  const mediaLogo = mediaLogoPath
    ? {
        bucket: 'media-logos' as const,
        path: mediaLogoPath,
        fileName: mediaLogoPath.split('/').pop() || 'media-logo',
        schoolName: schoolName,
        uploadedAt: new Date().toISOString(),
        userId: userId,
      }
    : null;

  return {
    school_logo: schoolLogo,
    media_logo: mediaLogo,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Serialize logo storage data to JSON
 */
export function serializeLogoData(data: LogoStorageData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get sanitized filename from school name
 */
export function getSanitizedFileName(schoolName: string): string {
  return schoolName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format logo URL for display
 */
export function formatLogoUrl(path: string, bucket: 'school-logos' | 'media-logos'): string {
  // This constructs a Supabase storage URL
  // In production, you'd want to get the actual public URL from Supabase
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
