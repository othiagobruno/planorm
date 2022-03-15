import { column } from './decorators/model';
import BaseModel from './model/mode';

export class UserModel extends BaseModel {
  @column()
  name: string;

  @column({ isPrimary: true })
  id: number;
}
