const express = require("express")
const posts = require("../data/db")

const router = express.Router()

router.post("/", (req, res) => {
    const post = req.body
    if(!post.title || !post.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    db.insert(post).then (post => {
      return res.status(201).json(post)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    })
})

router.post("/:id/comments", (req, res) => {
    const id = req.params.id
    const comment = req.params.body

    if(!comment.text) {
        res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    } else {
        posts.findById(req.params.id)
            .then((posts) => {
                if(posts) {
                    posts.insertComment(comment)
                    .then((commentres) => {
                        return res.status(201).json(commentres)
                    }
                    )
                } else {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    error: "There was an error while saving the comment to the database"
                })
            })
    }
})

router.get("/", (req, res) => {
    posts.find(req.query)
        .then((posts) => {
            res.status(200).json(posts)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

router.get("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: "The post information could not be retrieved."
            })
        })
})

router.get("/:id/comments", (req, res) => {
    posts.findPostComments(req.params.id)
        .then((comments) => {
            if(comments) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                error: "The comments information could not be retrieved."
            })
        })
})

router.delete("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then((post) => {
            posts.remove(req.params.id)
                .then((post) => {
                    if(post === 0) {
                        res.status(404).json({
                            message: "The post with the specified ID does not exist."
                        })
                    } else {
                        res.status(200).json(post)
                    }
                })
        })
        .catch((err) => {
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
})

router.put("/:id", (req, res) => {
    const update = req.body
    const id = req.params.id

    posts.findById(req.params.id)
        .then(() => {
            if(!update.title || !update.contents) {
                res.status(400).json({
                    errorMessage: "Please provide title and contents for the post."
                })
            } else {
                posts.update(req.params.id, update)
                    .then(() => {
                        res.status(200).json(update)
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(500).json({
                            error: "The post information could not be modified."
                        })
                    })
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        })
})

module.exports = router