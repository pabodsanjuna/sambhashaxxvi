# Logo Upload System Documentation

## Overview
The logo upload system manages school and media unit logo uploads to Supabase storage buckets during user registration. Logos are organized by school name and user ID.

## File Structure

### Storage Buckets
- **school-logos**: Stores school logos
- **media-logos**: Stores media unit logos

### File Naming Convention
Logos are stored using the following path structure:
```
{bucketName}/{userId}/{sanitized-school-name}.png
```

**Example:**
```
school-logos/550e8400-e29b-41d4-a716-446655440000/my-school-name.png
media-logos/550e8400-e29b-41d4-a716-446655440000/my-school-name.png
```

### Sanitization Rules
- School name is converted to lowercase
- All special characters and spaces are replaced with hyphens
- Leading/trailing hyphens are removed
- Final format: lowercase alphanumeric characters and hyphens only

**Example:**
- "St. Mary's School" → "st-marys-school"
- "CBSE School @2024" → "cbse-school-2024"
- "School---Name" → "school-name"

## Implementation Details

### 1. Logo Upload (uploadLogoFile)
**Location:** `src/lib/auth.ts`

**Function Signature:**
```typescript
export async function uploadLogoFile(
  file: File,
  bucketName: 'school-logos' | 'media-logos',
  userId: string,
  schoolName: string
): Promise<string>
```

**Validation:**
- File must be PNG format
- Max file size: 1MB (1,048,576 bytes)
- File is uploaded with `upsert: true` (replaces existing logo if present)

**Returns:** File path in Supabase storage (e.g., `550e8400.../my-school-name.png`)

### 2. User Profile Update (updateUserLogos)
**Location:** `src/lib/auth.ts`

**Function Signature:**
```typescript
export async function updateUserLogos(
  userId: string,
  schoolLogoPath?: string,
  mediaLogoPath?: string,
  schoolName?: string
): Promise<void>
```

**Stores:** Logo paths in the `users` table columns:
- `school_logo_path`: Path to school logo in storage
- `media_logo_path`: Path to media logo in storage

### 3. Registration Flow
**Location:** `src/pages/Auth/Subcomponents/RegisterForm.tsx`

**Step 4: Logo Upload**
- User selects school logo (optional)
- User selects media unit logo (optional)
- At least one logo must be provided
- Validation occurs before submission

**Process:**
1. User signs up with email/password
2. PostgreSQL trigger creates user profile
3. School ID is fetched via RPC
4. Logos are uploaded to respective buckets with school name
5. User profile is updated with logo paths
6. Verification modal is shown

## JSON Data Structure

### Logo Storage Metadata
```typescript
interface LogoMetadata {
  bucket: 'school-logos' | 'media-logos';
  path: string;                    // Path in storage
  fileName: string;                // Sanitized filename
  schoolName: string;              // Original school name
  uploadedAt: string;              // ISO timestamp
  userId: string;                  // User UUID
  url?: string;                    // Public URL (optional)
}

interface LogoStorageData {
  school_logo: LogoMetadata | null;
  media_logo: LogoMetadata | null;
  lastUpdated: string;             // ISO timestamp
}
```

### Example JSON
```json
{
  "school_logo": {
    "bucket": "school-logos",
    "path": "550e8400-e29b-41d4-a716-446655440000/my-school.png",
    "fileName": "my-school.png",
    "schoolName": "My School Name",
    "uploadedAt": "2024-04-14T10:30:00.000Z",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "media_logo": {
    "bucket": "media-logos",
    "path": "550e8400-e29b-41d4-a716-446655440000/my-school.png",
    "fileName": "my-school.png",
    "schoolName": "My School Name",
    "uploadedAt": "2024-04-14T10:30:00.000Z",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "lastUpdated": "2024-04-14T10:30:00.000Z"
}
```

## Logo Utilities
**Location:** `src/lib/logoStorage.ts`

Provides helper functions for:
- Creating logo storage data structures
- Parsing logo metadata from JSON
- Sanitizing filenames
- Formatting logo URLs
- Serializing/deserializing logo data

## Public URL Generation

### Getting Public URLs
```typescript
import { getLogoPublicUrl } from '@/lib/auth';

const schoolLogoUrl = getLogoPublicUrl('school-logos', schoolLogoPath);
const mediaLogoUrl = getLogoPublicUrl('media-logos', mediaLogoPath);
```

### Getting Complete Metadata
```typescript
import { getLogoMetadata } from '@/lib/auth';

const metadata = getLogoMetadata(schoolLogoPath, mediaLogoPath);
// Returns:
// {
//   school_logo: { path: "...", url: "..." } | null,
//   media_logo: { path: "...", url: "..." } | null
// }
```

## Database Schema

The `users` table stores logo information in these columns:
```sql
school_logo_path TEXT NOT NULL DEFAULT '',
media_logo_path TEXT NOT NULL DEFAULT ''
```

## RLS Policies for Storage

### School Logos Bucket
```sql
-- Allow users to upload their own school logo
CREATE POLICY "Users can upload their own school logo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'school-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read their own school logo
CREATE POLICY "Users can read their own school logo"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'school-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own school logo
CREATE POLICY "Users can update their own school logo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'school-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own school logo
CREATE POLICY "Users can delete their own school logo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'school-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Media Logos Bucket
Similar policies exist for the `media-logos` bucket.

## Error Handling

### Validation Errors
- No file provided - "No file provided"
- Wrong file type - "Only PNG files are allowed"
- File too large - "File size must not exceed 1MB"

### Upload Errors
- Network issues - "Upload failed: {error message}"
- Storage permissions - "Upload failed: Permission denied"
- Database update failure - "Failed to update user logos"

## Environment Variables

Ensure these are set in your `.env.local`:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

## Testing

### Manual Testing
1. Navigate to registration page
2. Fill out all 4 steps
3. On Step 4, upload school logo only, media logo only, or both
4. Click "Register"
5. Verify console logs show successful uploads
6. Check Supabase storage buckets for uploaded files
7. Verify database entries show logo paths

### Expected Console Output
```
[handleRegister] Uploading school logo...
[uploadLogoFile] Uploading to school-logos from [filename] as {userId}/sanitized-name.png
[uploadLogoFile] ✓ Upload successful: {...}
[handleRegister] ✓ School logo uploaded: {userId}/sanitized-name.png
[handleRegister] Uploading media logo...
[uploadLogoFile] Uploading to media-logos from [filename] as {userId}/sanitized-name.png
[uploadLogoFile] ✓ Upload successful: {...}
[handleRegister] ✓ Media logo uploaded: {userId}/sanitized-name.png
[handleRegister] Updating user profile with logo paths...
[updateUserLogos] Updating user with logo paths: {...}
[updateUserLogos] ✓ User logos updated successfully
```

## Future Enhancements
1. Add logo preview before upload
2. Add drag-and-drop upload support
3. Add image compression
4. Add logo cropping tool
5. Add batch logo upload for media competitions
6. Add logo deletion functionality
7. Add logo update after registration
