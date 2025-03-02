const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes.js");

const PORT = process.env.PORT || 5000;

const server = express();

//Add middlewares
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser());
server.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));


server.use('/tasks', routes);

server.listen(PORT, async () => {
    console.log(`Server running on Port ${PORT}...`);
});
