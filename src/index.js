const express = require("express");
const userRouter = require('./routers/userRouters');
const taskRouter = require('./routers/taskRouter');
require('./db/connectdb');
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(3000, () => {
    console.log("Server On !...")
})



