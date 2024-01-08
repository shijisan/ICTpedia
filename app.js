const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a router
const router = express.Router();

// Define a route using the router
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Use the router in your application
app.use('/', router);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
