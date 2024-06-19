# Backend

1. Define schema and model in db.js
2. Create routes in a new subfolder `backend/routes/`
    - Create a root router `routes/index.js` -> export -> import in `../paytm/backend/index.js`
    - Create a user router `routes/user.js` -> export -> import in `routes/index.js`
3. Add cors, body parser and jsonwebtokens
    1. CORS
    ```javascript
        const cors = require("cors");
        app.use(cors());
    ```

    2. Body parses
    ```javascript
        app.use(express.json());
    ```

    3. Install JWT and make a `./backend/config.js` file which stores your secrets (make sure to add this file to gitignore)


4. Backend user auth routes.
    1. Signup
        - get input from body
        - ZOD validation 
        - Check db if user alr exists
        - method: post
        - hash password using bcrypt -> **create a hashing method in UserSchema** 
        - User.create method to save user in model
        - create a jwt token
        - return success msg and token
        - use try catch for error handling
    2. Sign in
        - check if user exists
        - check if password & email are correct
        - create a jwt token
        - return success msg and token
        - use try catch for error handling
    4. update -> create middleware first

5. Middleware
    1. Get token from header file
    2. auth token structure is -> "Bearer {token}"
    3. Get the token part
    4. verify it using jwt.verify
    5. next() if it passes

6. Update user route
    1. use the above auth middleware before allowing user to update
    2. create new route in user.js
    3. method: put

7. User filter route
    1. use the User.find query
    ```javascript
    const filter = req.query.filter || "";
    const users = User.find({
        $or:[
            {firstName: {
                "$regex": filter
            }},
            {lastName: {
                "$regex": filter
            }}

        ]
    })
    ```
    2. use the map function to iterate the users and return them.

8. Create a bank schema
    1. id -> should reference user schema
    2. balance
    ```javascript
        const BankSchema = mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        }
        })
    ```

9. Make sure to connect mongodb using mongoose.connect(uri) -> store uri in config.js for security and export it.