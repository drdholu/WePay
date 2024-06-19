const express = require("express");
const app = express();

// cors
const cors = require("cors");
app.use(cors());

// router
const {router: rootRouter} = require("./routes/index");

// body parses
app.use(express.json());

app.use('/api/v1', rootRouter);



const PORT = 3000;
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));


