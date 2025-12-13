# Med-Find Salone

A clean, modern, offline-capable Sierra Leone medical directory showing hospitals, availability (beds/oxygen/ambulance), specialists, ratings, emergency capacity, queues, and a map interface.

## Features

- Real-time hospital directory with availability
- Interactive Mapbox map with clustering
- **Find nearest hospitals** - Locate yourself and see the 5 nearest hospitals with distances
- User location tracking with visual markers
- Offline PWA support
- Light/Dark mode
- Emergency hotline access
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Mapbox account (for map features) - [Sign up for free](https://account.mapbox.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Mapbox (Required for map features):**

   - Create a free account at [Mapbox](https://account.mapbox.com/)
   - Go to [Access Tokens](https://account.mapbox.com/access-tokens/)
   - Copy your default public token
   - Create a `.env` file in the root directory:
   \`\`\`bash

   # Create .env file

   echo VITE_MAPBOX_ACCESS_TOKEN=your_token_here > .env
   \`\`\`

   - Replace `your_token_here` with your actual Mapbox token

   **Note:** Without the Mapbox token, the map will not work and you'll see an error message.

### Development

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Backend Requirements

The app expects the following API endpoints:

- `GET /health` - Health check
- `GET /hospitals` - List all hospitals
- `GET /hospitals/{id}` - Get hospital details
- `POST /reports` - Submit inaccurate info report

### Admin Endpoints (require X-ADMIN-TOKEN header)

- `POST /admin/hospitals` - Create hospital
- `PUT /admin/hospitals/{id}` - Update hospital
- `DELETE /admin/hospitals/{id}` - Delete hospital
- `POST /admin/hospitals/{id}/availability` - Update availability

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Mapbox Access Token (Required for map features)
VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here

# Backend API URL (Optional, defaults to http://localhost:8000)
VITE_API_URL=http://localhost:8000

# Admin Secret Token (Optional, defaults to "admin123")
VITE_ADMIN_SECRET=your_admin_secret_here
```

**Note**: This is a Vite project, so environment variables use the `VITE_` prefix (not `NEXT_PUBLIC_`).

## Tech Stack

- React 19
- Vite
- React Router
- Mapbox GL JS
- Tailwind CSS v4
- Vite PWA Plugin
