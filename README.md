# DataStudioz - Modern Analytics Dashboard

A beautiful, modern data analytics dashboard built with Next.js 14, React 18, Tailwind CSS, and Recharts.

## 🚀 Features

- **Interactive Charts**: Line, Bar, Pie, Radar charts with real-time data
- **Dark/Light Mode**: Toggle between themes seamlessly
- **Responsive Design**: Looks great on all devices
- **Glassmorphic UI**: Modern, elegant design with blur effects
- **Smooth Animations**: Powered by Framer Motion
- **Performance Optimized**: Built with Next.js for optimal performance

## 📊 Technologies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `out/` directory.

## 🌐 Deployment to GitHub Pages

### Option 1: Automatic Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Steps:**
1. Go to your GitHub repository settings
2. Navigate to **Pages** → **Source**
3. Select **GitHub Actions** as the source
4. Push to `main` branch - the workflow will automatically build and deploy

### Option 2: Manual Deployment

```bash
# Build the static site
npm run build

# The output is in the 'out' folder
# Push this to your gh-pages branch
```

## 📁 Project Structure

```
datastudio/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main dashboard page
│   └── globals.css       # Global styles
├── components/
│   ├── StatsCard.tsx     # KPI card component
│   ├── RevenueChart.tsx  # Revenue area chart
│   ├── UserGrowthChart.tsx # User bar chart
│   ├── CategoryChart.tsx  # Pie chart
│   └── PerformanceChart.tsx # Radar chart
├── public/               # Static assets
├── docs/                # Original GitHub Pages files
└── package.json         # Dependencies
```

## 🎨 Customization

### Update Chart Data

Edit the data arrays in each chart component:
- `components/RevenueChart.tsx`
- `components/UserGrowthChart.tsx`
- `components/CategoryChart.tsx`
- `components/PerformanceChart.tsx`

### Modify Stats Cards

Update the stats array in `app/page.tsx`:

```typescript
const stats = [
  {
    title: 'Your Title',
    value: 'Your Value',
    change: '+XX%',
    // ... more fields
  },
]
```

### Change Colors

Edit `tailwind.config.js` to customize the color scheme.

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Live Site**: [https://raglab.site/](https://raglab.site/)
- **GitHub**: [https://github.com/binaysahoo/datastudio](https://github.com/binaysahoo/datastudio)

---

Built with ❤️ using Next.js & React