const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios")

const app = express();
const port = 3002;

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
    origin: "https://angular-e-commerce-project-frontend.vercel.app",
    optionsSuccessStatus: 204,
    methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

// Use express.json() middleware to parse JSON bodies of requests
app.use(express.json());

const BASE_URL = "https://fakestoreapi.com"

// GET route - Allows to get all the items with pagination
app.get("/clothes", async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;

    try {
        const { data } = await axios.get(`${BASE_URL}/products`, {
            params: {
                sort: 'asc'
            }
        })

        const startIndex = (page) * perPage;
        const paginatedItems = data.slice(startIndex, startIndex + perPage);

        paginatedItems.forEach(item => {
            // Add a new property called rating and assign a random number from 1 to 5
            item.rating = Math.floor(Math.random() * 5) + 1
        })

        res.status(200).json({
            items: paginatedItems,
            total: data.length,
            page,
            perPage,
            totalPages: Math.ceil(data.length / perPage)
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// POST route - Allows to add a new item
app.post("/clothes", async (req, res) => {
    try {
        const { image, name, price, rating } = req.body
        const { data } = await axios.post(`${BASE_URL}/products`, {
            image,
            title: name,
            price,
            description: 'lorem ipsum set',
            category: 'None'
        })
        res.status(201).json(data)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
})

// PUT route - Allows to update an item
// example: localhost:3000/clothes/1
/*
  body: {
    "image": "https://your-image-url.com/image.png",
    "name": "T-shirt",
    "price": "10",
    "rating": 4
  }
*/
app.put("/clothes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { image, name, price, rating } = req.body;

    fs.readFile("db.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        const jsonData = JSON.parse(data);

        const index = jsonData.items.findIndex((item) => item.id === id);

        if (index === -1) {
            res.status(404).send("Not Found");
            return;
        }

        jsonData.items[index] = {
            id,
            image,
            name,
            price,
            rating,
        };

        fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.status(200).json(jsonData.items[index]);
        });
    });
});

// DELETE route - Allows to delete an item
// example: localhost:3000/clothes/1
app.delete("/clothes/:id", (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile("db.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        const jsonData = JSON.parse(data);

        const index = jsonData.items.findIndex((item) => item.id === id);

        if (index === -1) {
            res.status(404).send("Not Found");
            return;
        }

        jsonData.items.splice(index, 1);

        fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.status(204).send();
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});