# Backend Deployment to Render

This guide will help you deploy your Node.js backend to Render.

## 🚀 Quick Deployment

### Option 1: Using Render Dashboard (Recommended)

1. **Connect your GitHub repository:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub account and select this repository

2. **Configure the service:**
   - **Name:** `test-backend` (or your preferred name)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter for better performance)

3. **Environment Variables:**
   Add these environment variables in the Render dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here-change-this
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your API will be available at: `https://your-service-name.onrender.com`

### Option 2: Using render.yaml (Blueprint)

If you prefer using the blueprint approach:

1. **Push your code to GitHub** with the `render.yaml` file included
2. **Go to Render Dashboard**
3. **Click "New" → "Blueprint"**
4. **Connect your repository**
5. **Render will automatically detect and configure your services**

## 🔧 Configuration Files Created

- `render.yaml` - Render blueprint configuration
- `.env.example` - Environment variables template
- Updated `package.json` - Added Node.js engine specification
- Updated `server.js` - Uses environment variables for JWT secret

## 🌐 API Endpoints

Once deployed, your API will be available at:
- **Sign In:** `POST https://your-service-name.onrender.com/api/signin`
- **Sign Up:** `POST https://your-service-name.onrender.com/api/signup`

## 🔒 Security Notes

- **JWT_SECRET:** Make sure to set a strong, unique secret in production
- **HTTPS:** Render automatically provides SSL certificates
- **Environment Variables:** Never commit sensitive data to version control

## 🐛 Troubleshooting

- **Port Issues:** The app automatically uses Render's provided PORT
- **Build Failures:** Check the build logs in Render dashboard
- **CORS Issues:** Update your frontend to use the production API URL

## 📝 Next Steps

1. Deploy your backend to Render
2. Update your frontend to use the production API URL
3. Test the authentication flow
4. Consider adding a database for persistent user storage

## 📞 Support

If you encounter any issues:
- Check Render's [documentation](https://docs.render.com/)
- Review the build logs in your Render dashboard
- Ensure all environment variables are properly set