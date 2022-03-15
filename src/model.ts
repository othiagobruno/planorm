import { Column, Table } from './decorators/model';
import BaseModel from './model/mode';

@Table('users')
export class UserModel extends BaseModel {
  @Column()
  name: string;

  @Column({ isPrimary: true })
  id: number;
}
