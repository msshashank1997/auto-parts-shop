const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample data - in a real application, this would come from a database
const autoParts = [
    {
        id: 1,
        name: "Bosch Brake Pad Set",
        description: "Premium ceramic brake pads for optimal stopping power and reduced brake dust. Compatible with most modern vehicles.",
        manufacturer: "Bosch",
        price: 89.99,
        image: "https://m.media-amazon.com/images/I/61n9QDu9NeL._SL1500_.jpg"
    },
    {
        id: 2,
        name: "FRAM Ultra Oil Filter",
        description: "Premium synthetic oil filter with 99% filtration efficiency. Extended life up to 20,000 miles.",
        manufacturer: "FRAM",
        price: 12.99,
        image: "https://m.media-amazon.com/images/I/81UGiLYnBeL._SL1500_.jpg"
    },
    {
        id: 3,
        name: "K&N High-Flow Air Filter",
        description: "Washable and reusable high-flow air filter. Increases horsepower and acceleration.",
        manufacturer: "K&N",
        price: 54.99,
        image: "https://lrlmotors.com/cdn/shop/products/polo-gt-tsi-polo-dslvento-dsl-kn-replacement-air-filter-702645_1440x1440.webp?v=1649215575"
    },
    {
        id: 4,
        name: "NGK Laser Iridium Spark Plugs",
        description: "Fine-wire iridium center electrode for better ignition and fuel efficiency. Set of 4.",
        manufacturer: "NGK",
        price: 45.99,
        image: "https://lrlmotors.com/cdn/shop/files/NGK_SIMR8A9_Laser_1440x1440.jpg?v=1728645080"
    },
    {
        id: 5,
        name: "Optima RedTop Battery",
        description: "High-performance AGM battery with superior starting power and longer life.",
        manufacturer: "Optima",
        price: 229.99,
        image: "https://d2lum58i3w4swj.cloudfront.net/clarios/imgs/opticat/5373698.jpg"
    },
    {
        id: 6,
        name: "Mobil 1 Extended Performance Oil Filter",
        description: "Advanced synthetic fiber filter media for outstanding engine protection up to 20,000 miles.",
        manufacturer: "Mobil 1",
        price: 14.99,
        image: "https://www.getuscart.com/images/thumbs/0587029_mobil-1-m1-110a-extended-performance-oil-filter_550.jpeg"
    },
    {
        id: 7,
        name: "ACDelco Professional Alternator",
        description: "100% new alternator with premium brushes and bearings for longer service life.",
        manufacturer: "ACDelco",
        price: 159.99,
        image: "https://m.media-amazon.com/images/I/71Y0G4PMf0L._AC_SL1500_.jpg"
    },
    {
        id: 8,
        name: "Monroe Quick-Strut Assembly",
        description: "Complete strut assembly with premium components for improved handling and comfort.",
        manufacturer: "Monroe",
        price: 129.99,
        image: "https://m.media-amazon.com/images/I/61dR9E531QL._AC_SL1500_.jpg"
    },
    {
        id: 9,
        name: "Gates Timing Belt Kit",
        description: "Complete timing belt kit with water pump and installation components.",
        manufacturer: "Gates",
        price: 189.99,
        image: "https://m.media-amazon.com/images/I/41AXnYAdXoL._SY300_SX300_QL70_FMwebp_.jpg"
    },
    {
        id: 10,
        name: "Denso Oxygen Sensor",
        description: "OEM-quality oxygen sensor for precise fuel management and optimal performance.",
        manufacturer: "Denso",
        price: 49.99,
        image: "https://m.media-amazon.com/images/I/61cjmHKtcAL._AC_SL1500_.jpg"
    },
    {
        id: 11,
        name: "Moog Ball Joint",
        description: "Premium ball joint with powdered-metal gusher bearing design for superior strength.",
        manufacturer: "Moog",
        price: 39.99,
        image: "https://m.media-amazon.com/images/I/61HZj9JL3KL._SX522_.jpg"
    },
    {
        id: 12,
        name: "Walker Catalytic Converter",
        description: "EPA-compliant catalytic converter with premium substrate material for efficient emissions control.",
        manufacturer: "Walker",
        price: 299.99,
        image: "https://m.media-amazon.com/images/I/3122HWQBVaL._SX300_SY300_QL70_FMwebp_.jpg"
    },
    {
        id: 13,
        name: "Timken Wheel Bearing",
        description: "Premium wheel bearing with precision-engineered rollers for smooth operation.",
        manufacturer: "Timken",
        price: 79.99,
        image: "https://m.media-amazon.com/images/I/3122HWQBVaL._SX300_SY300_QL70_FMwebp_.jpg"
    },
    {
        id: 14,
        name: "Dayco Serpentine Belt",
        description: "EPDM construction for longer belt life and quiet operation.",
        manufacturer: "Dayco",
        price: 24.99,
        image: "https://m.media-amazon.com/images/I/81ncSjWO6HL._SY879_.jpg"
    },
    {
        id: 15,
        name: "Motorcraft Fuel Filter",
        description: "OEM-quality fuel filter with high filtration efficiency for Ford vehicles.",
        manufacturer: "Motorcraft",
        price: 19.99,
        image: "https://m.media-amazon.com/images/I/418ejUfy8lL._SY300_SX300_QL70_FMwebp_.jpg"
    }
];

// API Endpoints
app.get('/api/parts', (req, res) => {
    const { offset = 0, limit = 10, search = '', minPrice = 0, maxPrice = Infinity } = req.query;
    
    let filteredParts = autoParts.filter(part => {
        const matchesSearch = search.toLowerCase() === '' || 
            part.name.toLowerCase().includes(search.toLowerCase()) ||
            part.description.toLowerCase().includes(search.toLowerCase()) ||
            part.manufacturer.toLowerCase().includes(search.toLowerCase());
        
        const matchesPrice = part.price >= minPrice && part.price <= maxPrice;
        
        return matchesSearch && matchesPrice;
    });

    const paginatedParts = filteredParts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    res.json({
        parts: paginatedParts,
        total: filteredParts.length
    });
});

app.get('/api/parts/:id', (req, res) => {
    const part = autoParts.find(p => p.id === parseInt(req.params.id));
    if (part) {
        res.json(part);
    } else {
        res.status(404).json({ error: 'Part not found' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});
