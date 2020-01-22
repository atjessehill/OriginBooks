const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { Shelf, Book, Note, User } = require('./db/models');

const jwt = require('jsonwebtoken');

/**
 * MIDDLEWARE */
app.use(bodyParser.json());

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });

}


// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {

    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user){
            //user couldn't be found

            return Promise.reject({ 
                'error': 'User Not found. Make sure the refresh token and user id are correct'
            });
        }
        

            // if the code reaches here - the user was found
            // therefore the refresh token exists in the db but have to check if it expired.

            req.user_id = user._id;
            req.userObject = user;
            req.refreshToken = refreshToken;

            let isSessionValid = false;

            user.sessions.forEach((session) => {
                if (session.token === refreshToken) {
                    // check if the session has expired
                    if (User.hasRefreshTokenExpired(session.expiresAt) === false){
                        // refresh token has not expired
                        isSessionValid = true;
                    }
                }
            });

            if (isSessionValid) {
                // session is Valid - call next() to continue with processing this web request
                next();
            } else{
                // the session is not valid

                return Promise.reject({
                    'error': 'Refresh TOken has expired or the session is invalid'
                })
            }
    }).catch((e) => {
        res.status(401).send(e);
    })
}


// CORS HEADERS FROM https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, user-id");

    res.header(
        'ACCESS-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    )

    next();
});

// END MIDDLEWARE


/* ROUTE HANDLERS */

/**
 * 
 * GET /books
 * Purpose: Get all books
 */
app.get('/bookshelf', authenticate, (req, res) =>{
    /* We want to return an array of all the books in the database */
    Shelf.find({
        // _userId: req.user_id
    }).then((bookshelves) => {
        res.send(bookshelves);
    }).catch((e) => {
        res.send(e);
    });
});

/**
 * POST /books
 * Purpose: Create a Book Item
 */
app.post('/bookshelf', (req, res) => {
    // We want to create a new book and return the new book doc back to the user which includes the ID
    // Book info will be passed via JSON body
    let name = req.body.name;
    
    let newShelf = new Shelf({
        name
    });
    newShelf.save().then((shelfDoc) =>{
        // the full shelf doc is returned (incl. id)
        res.send(shelfDoc);
    });
});

/** 
 * PATCH /books/:id
 * Purpose: Update a specified bok
 */
app.patch('/bookshelf/:id', (req, res) =>{
    // We want to update the specified book with new values specified in the JSON body of the request

    Shelf.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/** 
 * DELETE /books/:id
 * Purpose: Update a specified bok
 */
app.delete('/bookshelf/:id', (req, res) =>{
    // We want to delete the specifid list

    Shelf.findOneAndRemove({
        _id: req.params.id
    }).then((removeShelfDoc) => {
        res.send(removeShelfDoc);

        // delete all the book in the deleted 
    })

});

/** 
 * GET /bookshelf/:shelfid/books
 * Purpose: Get all books in a specific shelf
 */
app.get('/books', authenticate, (req, res) =>{
    // We want to return all books that belong to a specific user (specified by id)
    let id = req.header('user-id');
    Book.find({
        _userId: id
    }).then((books) => {
        res.send(books);
    })
});

app.get('/books/:bookId', authenticate, (req, res) => {
    Book.findOne({
        _id: req.params.bookId,
    }).then((book) => {
        res.send(book);
    })

})

/** 
 * POST /bookshelf/:shelfId/books
 * Purpose: Create a new book in a specific bookshelf
 */

app.post('/books', authenticate, (req, res) => {
    //We want to create a new book specified by a shelfId

    let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        _userId: req.body.userId
    });
    newBook.save().then((newBookDoc) => {
        res.send(newBookDoc);
    })
});

/**
 * PATCH /bookshelf/:shelfId/books/:bookId
 * Purpose: Update an existing book
 */
app.patch('/books/:bookId', (req, res) => {
    // We want to pudate an existing book (specified by bookId)
    Book.findOneAndUpdate({
        _id: req.params.bookId,
    }, {
        $set: req.body
        }
    ).then(() =>{
        res.sendStatus(200);
    })
});

app.delete('/books/:bookId', authenticate, (req, res) => {
    Book.findOneAndRemove({
        _id: req.params.bookId,
        _userId: req.user_id
    }).then((removedBookDoc) => {
        res.send(removedBookDoc);

        // delete all the tasks that are in the deleted list
        deleteNotesFromBook(removedBookDoc._bookId);
    })
});

// ROUTES FOR NOTES 

/**
 * 
 * GET /Notes
 * Purpose: Get all Notes that correspond to a book and shelf
 */
app.get('/books/:bookId/notes', authenticate, (req, res) =>{
    // We want to return all books that belong to a specific book shelf (specified by id)
    let bookId = req.params.bookId;
    Note.find({
        _bookId: bookId
    }).then((notes) => {

        res.send(notes);

    })
});


/**
 * 
 * POST /Notes
 * Purpose: POST a note corresponding to a book on a shelf
 */
app.post('/books/:bookId/notes', (req, res) => {
    //We want to create a new book specified by a shelfId

    let newNote = new Note({
        note: req.body.note,
        page: req.body.page,
        _bookId: req.params.bookId,
    });
    newNote.save().then((newNoteDoc) => {
        res.send(newNoteDoc);
    })
});

/**
 * 
 * DELETE /Notes
 * Purpose: Delete a note corresponding to a book on a shelf
 */

app.delete('/books/:bookId/note/:noteId', authenticate, (req, res) => {

    Book.findOne({
        _id: req.params.bookId,
        _userId: req.user_id
    }).then((book) => {
        if (book) {

            return true;
        }

        return false;
    }).then((canDeleteNote) => {
        
        if (canDeleteNote) {
            Note.findOneAndRemove({
                _id: req.params.noteId,
                _bookId: req.params.bookId
            }).then((removedNoteDoc) => {
                res.send(removedNoteDoc);
            })
        }else{
            res.sendStatus(404);
        }
    })

});

/**
 * USER ROUTES 
 * 
 */

 /**
  * POST /users
  * PURPUSE: Sign Up
  * 
  */

app.post('/users', (req, res) => {
    // User sign up
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {

        return newUser.generateAccessAuthToken().then((accessToken) => {
            //access auth token generated successfully, nw we return an object containing the auth tokens
            return {accessToken, refreshToken}
        });
    }).then((authTokens) => {
        // Construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(newUser)
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: Login
 */

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfuly - refresh token returned
            // now we generate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                //access auth token generated successfully,. now we return an object containing the auth token
                return {accessToken, refreshToken}
            });
        }).then((authTokens) => {
            res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(user)
        })
        }).catch((e) => {
            res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {

        res.status(400).send(e);
    });
})

app.get('/users', (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    User.find({
        // _userId: id
    }).then((user) => {
        res.send(user);
    })
})


// Helper Methods 
let deleteNotesFromBook = (_bookId) => {
    Note.deleteMany({
        _bookId
    }).then(() => {
        console.log("Notes from " + _bookId + " were deleted");
    });
}

app.listen(3000, () =>{

    console.log("Server is listening on Port 3000");
});