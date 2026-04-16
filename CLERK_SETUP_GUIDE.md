# Clerk Authentication Setup Guide

## Overview
Your project has been configured to use **Clerk Authentication** with email and password signin/signup. All hardcoded authentication has been replaced with Clerk's managed authentication system.

## What Was Changed

### Files Modified:
1. **`src/App.tsx`** - Added ClerkProvider wrapper and updated routing with protected routes
2. **`src/pages/User/MainRender.tsx`** - Integrated Clerk's signOut instead of local logout
3. **`src/index.css`** - Added Clerk UI shadcn theme CSS

### Files Created:
1. **`src/pages/Auth/SignInPage.tsx`** - Clerk sign-in page with email/password
2. **`src/pages/Auth/SignUpPage.tsx`** - Clerk sign-up page with email/password
3. **`.env`** - Environment variables template
4. **`.env.local`** - Local environment variables template

### Old Auth System (Removed):
- Custom login/register forms
- Hardcoded authentication logic
- Manual session management

---

## Installation & Setup

### Step 1: Install Required Packages

Run the following command in your project root:

```bash
npm install @clerk/react @clerk/ui
```

### Step 2: Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign up or log in with your account
3. Create a new application (choose "React" as your framework)
4. Select "Email" as your authentication method (username/password)
5. Disable all social login features and third-party providers

### Step 3: Get Your API Keys

1. In Clerk Dashboard, go to **API Keys** section
2. Copy your:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### Step 4: Configure Environment Variables

Update your `.env.local` file with your Clerk keys:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_your_publishable_key_here
CLERK_SECRET_KEY=sk_your_secret_key_here
```

⚠️ **Important**: 
- Never commit your `.env.local` file
- Never expose `CLERK_SECRET_KEY` in client-side code
- The `VITE_` prefix is required for Vite to expose the variable to the browser

### Step 5: Run Your Application

```bash
npm run dev
```

Your app will start at `http://localhost:5173`

---

## User Flow

### Sign Up (New Users)
1. Users visit `/sign-up`
2. Enter email and password
3. Clerk creates the account
4. Redirected to `/dashboard`

### Sign In (Existing Users)
1. Users visit `/sign-in`
2. Enter email and password
3. Clerk verifies credentials
4. Redirected to `/dashboard`

### Protected Routes
All dashboard routes require authentication:
- `/dashboard` - Main dashboard
- `/rules` - Rules & Regulations
- `/categories` - Categories
- `/submissions` - Submissions
- `/settings` - Settings
- `/add-contestant` - Add Contestant

Unauthenticated users are automatically redirected to `/sign-in`

### Sign Out
1. Click the user menu in the dashboard header
2. Select "Sign out"
3. Redirected to `/sign-in`

---

## Configuration Details

### Authentication Method
✅ Email & Password only (Third-party disabled)

### Features Configured
- Email/password sign in
- Email/password sign up
- Session management
- Automatic redirects
- Protected routes

### Appearance
- Shadcn/ui theme applied
- Matches your existing UI design
- Responsive design

---

## Testing the Setup

1. **Test Sign Up**:
   - Go to `http://localhost:5173`
   - Redirected to `/sign-in`
   - Click "Create account"
   - Enter email and password
   - New account created
   - Redirected to dashboard

2. **Test Sign In**:
   - Sign out (click user menu)
   - Go to `/sign-in`
   - Enter credentials
   - Redirected to dashboard

3. **Test Protected Routes**:
   - Sign out
   - Try to access `/dashboard` directly
   - Redirected to `/sign-in`

4. **Test User Session**:
   - Sign in
   - Check dashboard loads correctly
   - Refresh page - session persists

---

## Troubleshooting

### Missing Publishable Key Error
**Problem**: "Missing Publishable Key" error on startup
**Solution**: 
- Ensure `.env.local` file exists in project root
- Check `VITE_CLERK_PUBLISHABLE_KEY` is set with correct value
- Restart dev server after adding env vars

### Sign In/Sign Up Not Loading
**Problem**: Blank page or components not rendering
**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
- Verify Clerk application is active in dashboard

### Session Not Persisting
**Problem**: Users logged out after page refresh
**Solution**:
- Check browser cookies are enabled
- Verify session is created in Clerk Dashboard
- Check for CORS issues in browser console

### Environment Variables Not Loading
**Problem**: Env vars undefined in code
**Solution**:
- Restart dev server after adding `.env.local`
- Use `import.meta.env.VITE_*` syntax (not `process.env`)
- Check file is in project root, not src folder

---

## API Reference

### Clerk Hooks Used

```typescript
import { useClerk, useUser, useAuth } from "@clerk/react";

// useClerk - Access signOut and other Clerk methods
const { signOut } = useClerk();

// useUser - Get current user data
const { user } = useUser();

// useAuth - Get auth state and session tokens
const { isSignedIn } = useAuth();
```

### Components Used

```typescript
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/react";

// ClerkProvider - Wraps your app (in App.tsx)
<ClerkProvider publishableKey={key}>
  {/* your app */}
</ClerkProvider>

// SignedIn - Shows content to authenticated users
<SignedIn>Protected content</SignedIn>

// SignedOut - Shows content to unauthenticated users
<SignedOut>Public content</SignedOut>
```

---

## Next Steps

### Optional Enhancements
1. **Add user profile page**: Display user info from `useUser()`
2. **Add email verification**: Configure in Clerk Dashboard
3. **Add password reset**: Enable "Forgot Password" in Clerk Dashboard
4. **Add SSO**: Later connect Google/GitHub if needed
5. **Add organizations**: For team features

### Production Deployment
1. Get production Clerk keys from Clerk Dashboard
2. Add to your production environment variables
3. Update `CLERK_SECRET_KEY` on backend (if applicable)
4. Test sign in/sign up on production domain
5. Configure allowed redirect URLs in Clerk Dashboard

---

## Support

- **Clerk Docs**: https://clerk.com/docs/react
- **Clerk React Router Guide**: https://clerk.com/docs/react-router
- **Clerk Dashboard**: https://dashboard.clerk.com

---

## ✅ Setup Checklist

- [ ] Installed `@clerk/react` and `@clerk/ui` packages
- [ ] Created Clerk application
- [ ] Got Publishable Key and Secret Key
- [ ] Updated `.env.local` with Clerk keys
- [ ] Started dev server (`npm run dev`)
- [ ] Tested sign up flow
- [ ] Tested sign in flow
- [ ] Tested sign out flow
- [ ] Tested protected routes
- [ ] Session persists on refresh
