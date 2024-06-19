const express = require("express");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const mongoose = require("mongoose");

router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await Account.findOne({
            userId: userId
        })

        return res.status(200).json({
            balance: user.balance
        })
    } catch (error) {
        return res.status(411).json({
            msg: `balance catch: ${error}`
        })
    }
    
})

router.post('/transfer', authMiddleware, async (req, res) => {
    
    
    const session = await mongoose.startSession();
    
    const toUser = req.body.to;
    const amount = req.body.amount;
    
    session.startTransaction();

    // senders account
    const account = await Account.findOne({userId: req.userId}).session(session);
    // cant find account or account has less balance
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // receivers account
    const toAccount = await Account.findOne({userId: toUser}).session(session);
    // invalid reciever account
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // update balances for both accounts

    await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
    await Account.updateOne({userId: toUser}, {$inc: {balance: amount}}).session(session);

    // commit the transaction
    await session.commitTransaction();

    res.json({
        msg: 'Transfer successful'
    })

})

module.exports = {
    router
}