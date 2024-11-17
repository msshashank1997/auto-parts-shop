# Auto Parts Shop

A modern web application for browsing and purchasing automobile parts.

## Features

- Browse auto parts with pagination
- Search parts by name, description, and manufacturer
- Filter parts by price range
- View detailed product information
- Shopping cart functionality
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd auto-parts-shop
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/parts` - Get list of parts with pagination
  - Query parameters:
    - offset (default: 0)
    - limit (default: 10)
    - search (optional)
    - minPrice (optional)
    - maxPrice (optional)

- `GET /api/parts/:id` - Get part details by ID

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Bootstrap 5
  - Font Awesome

- Backend:
  - Node.js
  - Express.js

## Project Structure

```
auto-parts-shop/
├── public/
│   ├── images/         # Product images
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styles
│   └── app.js          # Frontend JavaScript
├── server.js           # Node.js server
├── package.json        # Project dependencies
└── README.md          # Project documentation
```

## License

MIT
