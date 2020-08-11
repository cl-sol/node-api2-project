const express = require("express")
const postsRouter = require("./posts/posts-router")

const server = express()
server.use(express.json())
server.use(postsRouter)

server.listen(3000, () => {
    console.log("server running on port 3000")
})

server.get("/", (req, res) => {
    res.send(`
        <h2>Posts API<h2>
        <p>Welcome</p>
    `)
})

