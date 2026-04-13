import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';
import { getSanitizedFileName } from './logoStorage';

export interface UserRegistrationData {
  email: string;
  password: string;
  schoolName: string;
  city: string;
  phone: string;
  address: string;
  micName: string;
  micContact: string;
  coordinatorName: string;
  coordinatorContact: string;
  schoolLogoPath?: string;
  mediaLogoPath?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  school_id?: string;
  role?: string;
  school_name?: string;
  city?: string;
  phone?: string;
  address?: string;
  mic_name?: string;
  mic_contact?: string;
  coordinator_name?: string;
  coordinator_contact?: string;
  school_logo_path?: string;
  media_logo_path?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sign up a new user with email, password, and registration details
 * User profile is automatically created via PostgreSQL trigger
 * Custom fields are passed as metadata in options.data
 * Handles rate limiting (429) gracefully
 */
export async function signUp(data: UserRegistrationData) {
  try {
    console.log('[signUp] Starting registration for:', data.email);
    
    // Pass custom fields as metadata via options.data
    // The PostgreSQL trigger will extract these from raw_user_meta_data
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          school_name: data.schoolName,
          city: data.city,
          phone: data.phone,
          address: data.address,
          mic_name: data.micName,
          mic_contact: data.micContact,
          coordinator_name: data.coordinatorName,
          coordinator_contact: data.coordinatorContact,
          school_logo_path: data.schoolLogoPath || '',
          media_logo_path: data.mediaLogoPath || '',
        },
      },
    });

    if (authError) {
      console.error('[signUp] Auth error:', authError);
      // Handle rate limiting (429) error
      if (authError.status === 429) {
        throw new Error('Too many attempts. Please wait a few minutes before trying again.');
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    console.log('[signUp] ✓ Auth user created:', authData.user.id);
    console.log('[signUp] ✓ User profile will be created automatically via PostgreSQL trigger');
    console.log('[signUp] ℹ️ Metadata passed:', {
      school_name: data.schoolName,
      city: data.city,
      phone: data.phone,
    });

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

/**
 * Get school ID via RPC (safe from RLS violations)
 */
export async function getSchoolIdByUserId(userId: string): Promise<string> {
  try {
    console.log('[getSchoolIdByUserId] Fetching school_id for:', userId);
    
    const { data, error } = await supabase.rpc('get_school_id_by_user', {
      user_id: userId,
    });

    if (error) {
      console.error('[getSchoolIdByUserId] RPC error:', error.message);
      throw error;
    }

    if (!data) {
      throw new Error('School ID not found - profile may not be created yet');
    }

    console.log('[getSchoolIdByUserId] ✓ School ID:', data);
    return data;
  } catch (error) {
    console.error('[getSchoolIdByUserId] Error:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(error.message);
    }
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) return null;

    // Fetch user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is okay for initial load
      console.error('Error fetching user profile:', profileError);
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      ...profile,
    } as AuthUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Upload a file to the specified Supabase storage bucket
 * File path format: {userId}/{schoolName}.png
 * Returns JSON object with upload metadata
 */
export async function uploadLogoFile(
  file: File,
  bucketName: 'school-logos' | 'media-logos',
  userId: string,
  schoolName: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/png')) {
      throw new Error('Only PNG files are allowed');
    }

    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      throw new Error('File size must not exceed 1MB');
    }

    // Sanitize school name for filename using utility
    const sanitizedSchoolName = getSanitizedFileName(schoolName);

    // Generate filename with school name and userId organization
    // Format: {userId}/{schoolName}.png
    const fileName = `${userId}/${sanitizedSchoolName}.png`;

    console.log(`[uploadLogoFile] Uploading to ${bucketName} from ${file.name} as ${fileName}`);

    // Upload file to bucket with upsert to replace existing logo if needed
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Replace if exists
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Create JSON response with metadata
    const logoMetadata = {
      bucket: bucketName,
      path: data.path,
      fileName: sanitizedSchoolName,
      schoolName: schoolName,
      uploadedAt: new Date().toISOString(),
      userId: userId,
    };

    console.log(`[uploadLogoFile] ✓ Upload successful:`, logoMetadata);

    // Return the file path (which can be used to construct public URL)
    return data.path;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('File upload failed');
  }
}

/**
 * Get the public URL for a logo file
 */
export function getLogoPublicUrl(
  bucketName: 'school-logos' | 'media-logos',
  filePath: string
): string {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Get logo metadata with public URLs
 * Returns JSON object with complete logo information
 */
export function getLogoMetadata(
  schoolLogoPath?: string,
  mediaLogoPath?: string
): {
  school_logo: { path: string; url: string } | null;
  media_logo: { path: string; url: string } | null;
} {
  return {
    school_logo: schoolLogoPath
      ? {
          path: schoolLogoPath,
          url: getLogoPublicUrl('school-logos', schoolLogoPath),
        }
      : null,
    media_logo: mediaLogoPath
      ? {
          path: mediaLogoPath,
          url: getLogoPublicUrl('media-logos', mediaLogoPath),
        }
      : null,
  };
}

/**
 * Update user profile with logo file paths
 * Stores logo information as JSON in the database
 */
export async function updateUserLogos(
  userId: string,
  schoolLogoPath?: string,
  mediaLogoPath?: string,
  schoolName?: string
) {
  try {
    const updateData: Record<string, any> = {};

    // Create logo metadata JSON if paths provided
    if (schoolLogoPath) {
      updateData.school_logo_path = schoolLogoPath;
    }
    if (mediaLogoPath) {
      updateData.media_logo_path = mediaLogoPath;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No logo paths provided');
    }

    console.log('[updateUserLogos] Updating user with logo paths:', updateData);

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('[updateUserLogos] Database error:', error);
      throw error;
    }

    console.log('[updateUserLogos] ✓ User logos updated successfully');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update user logos');
  }
}
