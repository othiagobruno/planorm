import express from 'express';
const app = express();
import 'dotenv/config';
import { UserModel } from './model';
import knex from 'knex';
import { databaseConfig } from './config/database/database';

knex(databaseConfig);

app.get('/', function (req, res) {
  const user = new UserModel();
  user.name = 'Thiago';

  res.json({ a: 'show World!', user });
});

app.listen(process.env.PORT, function () {
  console.log(
    `Example app listening on port http://localhost:${process.env.PORT}!`,
  );
});
