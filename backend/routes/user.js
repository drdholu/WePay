const express = require("express");
const router = express.Router();
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require('jsonwebtoken'); // Ensure JWT is imported
const zod = require("zod");
const { authMiddleware } = require("../middleware");


const userSchemaVal = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

// SIGNUP route
router.post('/signup', async (req, res) => {
    const { username, firstName, lastName, password } = req.body;

    try {
        // Input validation
        userSchemaVal.parse({ username, password, firstName, lastName });

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(411).json({
                message: "user already exists"
            });
        }

        // Hashing
        const hashedPassword = await User.createHash(password);

        // Create new user in User model
        const newUser = await User.create({ username, password: hashedPassword, firstName, lastName });
        const userId = newUser._id;

        // New bank account for user -> balance between 1 to 10000
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({ userId }, JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token
        });

    } catch (error) {
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            msg: `signup catch: ${error.message}`
        });
    }
});

// SIGNIN route
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(411).json({
                message: "Incorrect username or password"
            });
        }

        // Check if password is valid
        const isPasswordValid = await User.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(411).json({
                message: "Incorrect username or password"
            });
        }

        // Generate a token
        const userId = user._id;
        const token = jwt.sign({ userId }, JWT_SECRET);

        // Send response
        return res.status(200).json({
            message: "Signin successful",
            token: token,
        });

    } catch (error) {
        return res.status(500).json({
            msg: `signin catch: ${error.message}`
        });
    }
});

// ZOD validation for update
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Update user route
router.put('/', authMiddleware, async (req, res) => {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: "Error while updating information"
        });
    }

    try {
        await User.updateOne({ _id: req.userId }, req.body);

        res.json({
            message: "Updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: `update catch: ${error.message}`
        });
    }
});

// Get users route -> Filter
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [
                { firstName: { "$regex": filter, "$options": "i" } },
                { lastName: { "$regex": filter, "$options": "i" } }
            ]
        });

        res.json({
            result: users.map((u) => ({
                username: u.username,
                firstName: u.firstName,
                lastName: u.lastName,
                _id: u._id,
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: `bulk fetch catch: ${error.message}`
        });
    }
});

module.exports = {
    router,
};
