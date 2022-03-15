import express from 'express';
const app = express();
import 'dotenv/config';
import 'reflect-metadata';
import { databaseConfig } from './config/database/database';
import { PlanoOrm } from '../src/core/plano';
import { UserModel } from './UserModel';

PlanoOrm.instance(databaseConfig as any);

app.get('/', async (req, res) => {
  const user = await UserModel.query().where('id', 1);
  res.json(user);
});

app.listen(process.env.PORT, function () {
  console.log(
    `Example app listening on port http://localhost:${process.env.PORT}`,
  );
});
