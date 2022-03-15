import {
  AfterSave,
  BeforeSave,
  Column,
  ManyToOne,
  Table,
} from '../src/decorators/model';
import BaseModel from '../src/model/model';
import { PostModel } from './PostsModel';

@Table('users')
export class UserModel extends BaseModel {
  @Column()
  name: string;

  @Column()
  group: string;

  @Column({ isPrimary: true })
  id: number;

  @ManyToOne(PostModel, { foreignKey: 'post_id' })
  posts: PostModel[];

  @BeforeSave()
  getUserName({ name }) {
    console.log(name);
  }

  @AfterSave()
  getUserId({ id }) {
    console.log(id);
  }
}
