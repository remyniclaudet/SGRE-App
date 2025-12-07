import express from 'express';
import { Request, Response } from 'express';
import { MyDataType } from './types/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Example of using a type
app.post('/data', (req: Request, res: Response) => {
    const data: MyDataType = req.body;
    // Process data here
    res.status(201).send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});