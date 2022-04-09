const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // middleware to add the body data to the request object ("req") in POST method

const dataFilePath = `${__dirname}/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(dataFilePath));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(dataFilePath, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// app.post('/api/v1/tours', (req, res) => {
//     console.log(req.body); // We can use it thanks to the middleware ("app.use(express.json());"").
//     res.send('Done.'); // We cannot send two responses now when we have res.json() up in this function.
// });

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server.');
//   res
//     .status(200) // default
//     .json({ message: 'Hello from the server.', app: 'Adventours' }); // Without express we had to define that the response is a json type (Content-Type) but here express takes this work away from us.
// });

// app.post('/', (req, res) => {
//   res.send('Posting from the "/" endpoint');
// });
