<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/11s0Ybge4Z3vhBe-MLGhaYmil0s0lhlsi

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Development Mode

The application includes a development mode that bypasses authentication and uses localStorage for data persistence, making development and testing much faster without requiring a Supabase connection.

### Enabling Dev Mode

Dev mode is controlled by environment variables in your `.env` file:

```env
# Dev Mode - Set to true to bypass authentication and use localStorage
VITE_DEV_MODE=true
VITE_DEV_USER_ID=dev-user-123
VITE_DEV_USER_EMAIL=dev@spem.com
VITE_DEV_USER_NAME=Dr. Dev Mode
VITE_DEV_USER_CRM=123456/SP
```

### Features in Dev Mode

When dev mode is enabled:

- **No Authentication Required**: The app automatically logs you in with a mock user
- **localStorage Persistence**: All data (patients, evaluations) is stored in browser localStorage instead of Supabase
- **Mock Data**: On first run, the app creates sample patients and evaluations for testing
- **Visual Indicator**: A "DEV MODE" badge appears in the header to indicate dev mode is active
- **No Network Calls**: All database operations happen locally without connecting to Supabase

### Disabling Dev Mode

To switch back to production mode with real Supabase authentication:

1. Set `VITE_DEV_MODE=false` in your `.env` file
2. Restart the development server

### Clearing Dev Data

Dev mode data is stored in localStorage with the prefix `dev_spem_`. To clear all dev data:

- Open browser DevTools (F12)
- Go to Application > Local Storage
- Delete all items starting with `dev_spem_`

Or use this code in the browser console:
```javascript
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('dev_spem_')) {
    localStorage.removeItem(key);
  }
});
```

### Production Builds

When building for production, make sure `VITE_DEV_MODE=false` to avoid shipping dev mode to production. The build process will display a warning if dev mode is enabled during build.
