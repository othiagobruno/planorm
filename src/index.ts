import express from 'express';
const app = express();
import 'dotenv/config';
import { UserModel } from './model';
import { databaseConfig } from './config/database/database';
import { PlanoOrm } from './core/plano';
import 'reflect-metadata';

app.get('/', async (req, res) => {
  const user = await UserModel.count();
  console.log(user);
  res.send(user);
});

app.listen(process.env.PORT, function () {
  console.log(
    `Example app listening on port http://localhost:${process.env.PORT}`,
  );
});

new PlanoOrm().create(databaseConfig as any);
