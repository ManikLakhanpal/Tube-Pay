import express from "express";

const app = express();
const port = 3000;

app.get('/', (req: any, res: any) => {
    res.json('Hi');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})