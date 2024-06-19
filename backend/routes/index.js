const express = require("express");
const { router: userRouter } = require("./user");
const { router: accountRouter } = require("./account");

const router = express.Router();

router.use('/user', userRouter);
router.use('/account', accountRouter);

module.exports = {
    router,
};
