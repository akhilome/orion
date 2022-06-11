import express from 'express';
import { orion } from '../../dist';

const app = express();

orion(app)
  .then((app) => {
    app.listen(3000, () => console.log('app running on port 3000'));
  })
  .catch((error) => console.error(error));
