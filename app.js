const express = require("express");
const mongoose = require("mongoose");


const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/book");
};

const authorSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
}, {
    versionKey: false,
    timestamps: true,
});


const author = mongoose.model("authors", authorSchema);



// Post Mongoose
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authors",
        required: true,
    },
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections",
        required: true,
    },
    checked: {
        type: Boolean,
        required: false
    },
    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "users",
    //     required: false,
    // },
}, {
    versionKey: false,
    timestamps: true,
});

const book = mongoose.model("books", bookSchema); // posts collection

// Comment Mongoose => Post and comment are one to many relationship
// const commentSchema = new mongoose.Schema({
//     body: {
//         type: String,
//         required: true
//     },
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required: true,
//     },
//     post_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "post",
//         required: true,
//     },
// }, {
//     versionKey: false,
//     timestamps: true,
// });

// const Comment = mongoose.model("comment", commentSchema); // comments collection

// Tags Mongoose => Post and Tags are in a many to many relationship

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type:String,
        required: true
}
}, {
    versionKey: false,
    timestamps: true,
});

const section = mongoose.model("sections", sectionSchema);
// tags collection

const app = express();

app.use(express.json());

/*
  users
  post = /users
  get all = /users
  get one = /users/:id
  update one = /users/:id
  delete one = /users/:id
*/

// USERS CRUD
app.post("/authors", async (req, res) => {
    try {
        const user = await author.create(req.body);

        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/authors", async (req, res) => {
    try {
        const users = await author.find().lean().exec();

        return res.send({
            users
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/authors/:id", async (req, res) => {
    try {
        const user = await author.findById(req.params.id).lean().exec();

        return res.send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.patch("/authors/:id", async (req, res) => {
    try {
        const user = await author.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            .lean()
            .exec();

        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.delete("/authors/:id", async (req, res) => {
    try {
        const user = await author.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(200).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

// ------------ TAGS CRUD -----------------
app.post("/sections", async (req, res) => {
    try {
        const tag = await section.create(req.body);

        return res.status(201).send(tag);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/sections", async (req, res) => {
    try {
        const tags = await section.find().lean().exec();

        return res.send(tags);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/sections/:id", async (req, res) => {
    try {
        const tag = await section.findById(req.params.id).lean().exec();

        return res.send(tag);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.patch("/sections/:id", async (req, res) => {
    try {
        const tag = await section.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            .lean()
            .exec();

        return res.status(200).send(tag);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.delete("/sections/:id", async (req, res) => {
    try {
        const tag = await section.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(200).send(tag);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});



// ------------ POSTS CRUD -----------------
app.post("/books", async (req, res) => {
    try {
        const post = await book.create(req.body);

        return res.status(201).send(post);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/books", async (req, res) => {
    try {
         let data = await book
             .find({})
             .populate("author_id")
             .populate("section_id")
             .lean()
             .exec();
         return res.send(data);
        
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

app.get("/books/:id", async (req, res) => {
    try {
        const post = await book.findById(req.params.id).lean().exec();

        return res.send(post);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});


app.delete("/books/:id", async (req, res) => {
    try {
        const post = await book.findByIdAndDelete(req.params.id).lean().exec();

        return res.send(post);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});
// Get all books by section
app.get("/books/sectionId/:sectionId", async (req, res) => {
    let data = await book
        .find({
            section_id: req.params.sectionId
        })
        .populate("author_id")
        
        .lean()
        .exec();
    res.send(data);
});


// Get all books by Author and Section
app.get(
    "/books/sectionId/:sectionId/authorId/:authorId",
    async (req, res) => {
        let data = await book
            .find({
                $and: [{
                        author_id: req.params.authorId
                    },
                    {
                        section_id: req.params.sectionId
                    },
                ],
            })
            .populate("author_id")
            .populate("section_id")
            .lean()
            .exec();
        res.send(data);
    }
);
app.patch("/books/:id", async (req, res) => {
    try {
        const post = await book.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            .lean()
            .exec();

        return res.send(post);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});

// Check a book
app.patch("/books/bookId/:bookId", async (req, res) => {
    try{
    let data = await book.findByIdAndUpdate(
        req.params.bookId, req.body, {
         
            new:true,
         
        })
        .lean()
        .exec();
    return  res.send(data);
    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        });
    }
});
// Get all books by Author
app.get("/books/authorId/:authorId", async (req, res) => {
    let data = await book
        .find({
            author_id: req.params.authorId
        })
        .populate("author_id")
        .populate("section_id")
        .lean()
        .exec();
    res.send(data);
});
// Get all checked books
app.get("/books/checked", async (req, res) => {
    let data = await book
        .find({
            checked: req.params.checked
        })
        .populate("author_id")
        .populate("section_id")
        .lean()
        .exec();
    res.send(data);
});

// ------------ COMMENTS CRUD -----------------
// app.post("/comments", async (req, res) => {
//     try {
//         const comment = await Comment.create(req.body);

//         return res.status(201).send(comment);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//             status: "Failed"
//         });
//     }
// });

// app.get("/comments", async (req, res) => {
//     try {
//         const comments = await Comment.find().lean().exec();

//         return res.send(comments);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//             status: "Failed"
//         });
//     }
// });

// app.get("/comments/:id", async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.id).lean().exec();

//         return res.send(comment);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//             status: "Failed"
//         });
//     }
// });

// app.patch("/comments/:id", async (req, res) => {
//     try {
//         const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
//                 new: true,
//             })
//             .lean()
//             .exec();

//         return res.send(comment);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//             status: "Failed"
//         });
//     }
// });

// app.delete("/comments/:id", async (req, res) => {
//     try {
//         const comment = await Comment.findByIdAndDelete(req.params.id)
//             .lean()
//             .exec();

//         return res.send(comment);
//     } catch (e) {
//         return res.status(500).json({
//             message: e.message,
//             status: "Failed"
//         });
//     }
// });

app.listen(2349, async function () {
    await connect();
    console.log("listening on port 2349");
});