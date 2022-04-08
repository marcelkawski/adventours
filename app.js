const fs = require('fs');
const express = require('express');

const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server.');
//   res
//     .status(200) // default
//     .json({ message: 'Hello from the server.', app: 'Adventours' }); // Without express we had to define that the response is a json type (Content-Type) but here express takes this work away from us.
// });

// app.post('/', (req, res) => {
//   res.send('Posting from the "/" endpoint');
// });
