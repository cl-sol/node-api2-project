require("dotenv").config();

const express = require("express")
const postsRouter = require("./posts/posts-router")

const server = express()

const port = process.env.PORT || 3000;
server.use(express.json())
server.use(postsRouter)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

server.get("/", (req, res) => {
    res.send(`
        <h2>Posts API<h2>
        <p>Welcome</p>
    `)
})

