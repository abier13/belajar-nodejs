const express = require('express');

const app = express()
const port = 3000

//untuk menangani request json
app.use(express.json());

// import router
const userRouter = require('./src/routes/user.routes');
app.use('/api', userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
