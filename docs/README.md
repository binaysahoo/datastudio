# DataStudioz Website - GitHub Pages Deployment Guide

## 🌐 Your Website Files
Your website is now in the `docs/` folder with:
- `index.html` - Main HTML page
- `styles.css` - Styling and responsive design
- `script.js` - Interactive features

## 🚀 Deploy to GitHub Pages

### Step 1: Add and Commit Files
```bash
git add docs/
git commit -m "Add DataStudioz website"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository: https://github.com/binaysahoo/datastudio
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
5. Click **Save**

### Step 3: Access Your Website
After 1-2 minutes, your site will be live at:
**https://binaysahoo.github.io/datastudio/**

## ✨ Features Included
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth scrolling navigation
- ✅ Animated sections
- ✅ Modern gradient hero section
- ✅ Project showcase cards
- ✅ Mobile hamburger menu

## 🎨 Customize Your Website
- Edit `docs/index.html` to change content, add projects, or update links
- Modify `docs/styles.css` to change colors, fonts, or layout
- Update `docs/script.js` to add new interactions

## 📝 Quick Customizations
1. **Change Colors**: Edit CSS variables in `styles.css`:
   ```css
   :root {
       --primary-color: #2563eb;  /* Change this */
       --secondary-color: #1e40af;
   }
   ```

2. **Add More Projects**: Copy a project card in `index.html` and update the content

3. **Update Links**: Change the GitHub link in the Contact section

## 🔄 Update Your Website
After making changes:
```bash
git add docs/
git commit -m "Update website"
git push origin main
```
Changes go live automatically in 1-2 minutes!

## 🆘 Troubleshooting
- **404 Error**: Make sure you selected `/docs` folder in GitHub Pages settings
- **Changes not showing**: Wait 2-3 minutes, then clear browser cache
- **Styles broken**: Check that all files are in the same `docs/` folder

Enjoy your new website! 🎉
