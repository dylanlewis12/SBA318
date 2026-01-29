# MovieFinder

A full-stack web application that helps you discover, track, and rate TV shows.

## Features

- **Browse Shows** - Explore thousands of TV shows from the TVMaze API
- **Search & Filter** - Find shows by genre
- **Personal Watchlist** - Create and manage your own curated watchlist
- **Track Progress** - Mark shows as watched
- **Rate Shows** - Add personal ratings to shows you've watched
- **View Details** - See show information including genres, ratings, and summaries

## Tech Stack

**Frontend:**
- HTML
- CSS
- JavaScript
- Axios

**Backend:**
- Node.js
- Express.js
- Custom View Engine
- REST API

**Data:**
- TVMaze API
- In-Memory Database

## Installation

1. Clone the repository
```bash
git clone https://github.com/dylanlewis12/SBA318.git
cd SBA318
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Browsing the Catalog
- Visit the **Catalog** page to explore TV shows
- Filter shows by genre
- View show details including ratings and summaries

### Creating a Watchlist
1. Click **"Add to Watchlist"** on any show
2. Go to the **Watch List** page to see your saved shows
3. Mark shows as watched using the checkbox
4. Rate shows using the star rating system
5. Remove shows from your watchlist with the Remove button

## Project Structure

```
SBA318/
├── server.js                 # Express server
├── public/
│   ├── views/               # HTML files
│   ├── styles/              # CSS files
│   ├── scripts/             # JavaScript files
│   └── data/                # Frontend data
├── routes/
│   └── movieRoutes.js       # API routes
├── middleware/
│   └── middlewares.js       # Custom middleware
├── database/
│   └── database.js          # Watchlist data
└── package.json
```

## API Endpoints

- `GET /` - Home page
- `GET /catalog` - Catalog page
- `GET /watchlist` - Watchlist page (server-rendered)
- `GET /about` - About page
- `GET /api/watchlist` - Get all watchlist items
- `POST /api/watchlist` - Add movie to watchlist
- `PUT /api/watchlist/:id` - Update movie (watched status, rating)
- `DELETE /api/watchlist/:id` - Remove movie from watchlist
- `GET /api/watchlist/:genre` - Filter movies by genre

## Author

Created by [Dylan Lewis]

Connect with me:
- [GitHub](https://github.com/dylanlewis12)
- [LinkedIn](https://www.linkedin.com/in/the-dylanlewis/)
