# Deployment Guide for Vercel

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB database (MongoDB Atlas recommended: https://www.mongodb.com/atlas)
- Git repository connected to Vercel

## Environment Variables

Before deploying, you need to set up the following environment variable in your Vercel project:

### Required:
- `DATABASE_URL`: Your MongoDB connection string
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import your repository to Vercel**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Select the project framework: **Next.js**

3. **Configure Environment Variables**
   - In the deployment settings, add your environment variables:
     - `DATABASE_URL`: Your MongoDB connection string

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   ```
   Enter your MongoDB connection string when prompted.

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### Database Setup
Make sure your MongoDB database is accessible:
1. Whitelist Vercel's IP addresses in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)
2. Ensure your database user has the correct permissions
3. Test the connection from Vercel

### Prisma Client
The build process automatically runs `prisma generate` as part of the `postinstall` script, so the Prisma client will be generated during deployment.

## Important Notes

1. **Build Configuration**: The project uses Turbopack for faster builds
2. **CORS Headers**: WebContainer requires specific CORS headers (already configured in `next.config.ts`)
3. **Generated Files**: Prisma client and starter templates are excluded from ESLint to speed up builds
4. **Database**: Make sure your MongoDB connection string is correct and the database is accessible

## Vercel Configuration

The `vercel.json` file includes:
- Custom build command with Prisma generation
- Environment variable configuration
- Optimized for Next.js framework

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel
- Review build logs in Vercel dashboard

### Runtime Errors
- Check that MongoDB is accessible from Vercel's servers
- Verify CORS headers are properly configured
- Review function logs in Vercel dashboard

### Performance
- The project uses Turbopack for faster builds
- Static pages are pre-rendered where possible
- WebContainer API is loaded dynamically on the client side

## Support

For more information:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

