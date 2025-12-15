# 🔐 Admin-Only Analytics Guide

## Overview

The analytics system now tracks **all users** but only allows **admin access** to view the analytics dashboard. Regular users won't see the analytics link or be able to access the data.

## How It Works

### For Regular Users
- ✅ Their usage is tracked (tool views, searches)
- ✅ They see trending tools on the homepage
- ❌ They cannot access the analytics dashboard
- ❌ They don't see the "Analytics" link in navigation

### For Admin (You)
- ✅ Access the analytics dashboard at `/analytics`
- ✅ View all aggregated user data
- ✅ See trending tools, popular searches, and statistics
- ✅ Export and manage analytics data

## Accessing Analytics Dashboard

### Method 1: Direct URL
Navigate to: **`http://localhost:3001/analytics`**

### Method 2: Bookmark
Save the analytics URL as a bookmark for quick access.

## Login Credentials

**Default Password**: `admin123`

⚠️ **IMPORTANT FOR PRODUCTION**: Change the password in `lib/admin-auth.ts`:

```typescript
const ADMIN_PASSWORD = 'your-secure-password-here';
```

## Security Features

### Session Management
- **Session Duration**: 1 hour
- **Storage**: Browser sessionStorage (not localStorage)
- **Auto-logout**: Session expires after 1 hour of inactivity
- **Manual Logout**: Click "Logout" button in dashboard

### Password Protection
- Password is hashed before storage
- Simple hash function (suitable for single-admin use)
- Session-based authentication (no cookies)

### Hidden Access
- No visible link in the navigation for regular users
- Dashboard URL is not discoverable through UI
- Login page clearly indicates admin-only access

## What Data is Collected?

### Tracked Globally (All Users)
1. **Tool Views**: When any user visits a tool page
2. **Search Queries**: When any user searches for tools
3. **Search Matches**: Which tools matched each search
4. **Usage Timestamps**: When each interaction occurred

### Not Collected
- ❌ User identities
- ❌ IP addresses
- ❌ Personal information
- ❌ Browser fingerprints
- ❌ Location data

## Analytics Dashboard Features

### 1. Statistics Overview
- Total number of tools
- Total views across all tools
- Total searches performed
- Number of actively used tools

### 2. Trending Tools
- Ranked list of most popular tools
- View counts for each tool
- Search counts for each tool
- Trending scores
- Tool details and icons

### 3. Popular Searches
- Most frequently searched terms
- Search frequency for each term
- Helps understand user needs

### 4. Data Management
- **Export**: Download analytics as JSON file
- **Clear**: Reset all analytics data
- **Raw Data**: View complete analytics object

## How Users See Trending Tools

Even though users can't access the admin dashboard, they still benefit from the analytics:

### Homepage Trending Section
- Shows top trending tools based on **aggregate data from all users**
- Updates automatically as usage patterns change
- Displays view counts (optional: you can hide these)
- Shows ranking badges (#1 HOT, #2 HOT, etc.)

## Customization Options

### Hide View Counts from Users

If you don't want users to see view counts on the homepage, edit `app/page.tsx`:

**Find this section** (around line 230):
```typescript
{stats && stats.views > 0 && (
  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
    👁️ {stats.views} views
  </span>
)}
```

**Remove or comment it out:**
```typescript
{/* View counts hidden from users */}
```

### Change Admin Password

Edit `lib/admin-auth.ts`:
```typescript
const ADMIN_PASSWORD = 'your-new-secure-password';
```

### Adjust Session Duration

Edit `lib/admin-auth.ts`:
```typescript
const oneHour = 60 * 60 * 1000; // Change to desired duration in milliseconds
```

Examples:
- 30 minutes: `30 * 60 * 1000`
- 2 hours: `2 * 60 * 60 * 1000`
- 24 hours: `24 * 60 * 60 * 1000`

## Production Deployment

### Before Deploying

1. **Change the admin password** in `lib/admin-auth.ts`
2. **Remove the hint** from the login page (optional)
3. **Consider adding**: Environment variable for password
4. **Test**: Make sure analytics tracking works
5. **Verify**: Users cannot access `/analytics` without password

### Recommended: Environment Variable Approach

Create `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

Update `lib/admin-auth.ts`:
```typescript
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
```

### Security Best Practices

1. ✅ Use a strong password (12+ characters, mixed case, numbers, symbols)
2. ✅ Don't share the analytics URL publicly
3. ✅ Log out when done viewing analytics
4. ✅ Use HTTPS in production
5. ✅ Consider IP restrictions for extra security (server-side)

## Troubleshooting

### Can't Login?
- Check password spelling (case-sensitive)
- Default password: `admin123`
- Clear sessionStorage and try again
- Check browser console for errors

### Session Expired?
- Sessions expire after 1 hour
- Simply login again
- Consider increasing session duration if needed

### Analytics Not Tracking?
- Check browser localStorage is enabled
- Open browser console to check for errors
- Verify `trackToolView` is called in tool pages
- Verify `trackSearch` is called on homepage

### Users Can See Analytics?
- Verify analytics link is removed from header
- Check `/analytics` URL requires password
- Clear browser cache and test in incognito

## Quick Reference

| Action | URL/Method |
|--------|-----------|
| Access Analytics | `http://localhost:3001/analytics` |
| Login | Default: `admin123` |
| Change Password | Edit `lib/admin-auth.ts` |
| Logout | Click "Logout" in dashboard |
| Export Data | Click "Export Data" button |
| Clear Data | Click "Clear Analytics" button |

## Support

If you need to:
- Add more admin users → Modify authentication logic
- Track additional metrics → Update `lib/analytics.ts`
- Add server-side analytics → Consider database integration
- Enhanced security → Implement JWT or OAuth

---

**Remember**: The analytics system is privacy-friendly and tracks aggregate usage patterns, not individual users. All data remains in users' browsers until you view the aggregated statistics.
