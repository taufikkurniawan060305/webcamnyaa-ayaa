# Miniphotobox Aya 🌸

A web-based photobooth application designed for both desktop and mobile. Take 4 photos, choose aesthetic pastel frame layouts designed for a calm girl aesthetic (Sakura Blossom, Matcha & Sage, Coquette Soft Ribbon, Lavender Dream, Baby Blue Serenity, Cozy Vanilla Cafe, and Strawberry Milk), customize colors, filters, text, and export in high-resolution!

---

## 🚀 Deployment Guide / Panduan Deploy

Since webcam access (`navigator.mediaDevices.getUserMedia`) requires a secure context (**HTTPS**), deploying to GitHub Pages or Vercel is the easiest way to run the app on mobile devices (HP). Both platforms provide HTTPS automatically.

### 1. Push to GitHub / Upload ke GitHub
First, create a new repository on GitHub and push the code:

```bash
# Initialize git repository
git init

# Add all files to stage
git add .

# Commit changes
git commit -m "feat: init photobooth aya"

# Rename branch to main
git branch -M main

# Link to your GitHub Repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push code to GitHub
git push -u origin main
```

---

### 2. Deploy to GitHub Pages (Automated / Otomatis)
We have added a GitHub Action workflow that builds and deploys the app automatically.

1. Go to your repository on **GitHub.com**.
2. Click **Settings** (Pengaturan) -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. That's it! Next time you push code to `main` branch, GitHub Actions will compile and deploy your site to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

---

### 3. Deploy to Vercel (Recommended / Sangat Direkomendasikan)
Vercel is the fastest way to host Vite React applications.

1. Go to [Vercel.com](https://vercel.com/) and log in (sign up using your GitHub account).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite** as the framework.
5. Leave everything default and click **Deploy**.
6. Within a few seconds, Vercel will provide a secure HTTPS link (e.g. `https://your-project.vercel.app`) that you can open on your HP!
