import { AfterSave, BeforeSave, Column, Table } from '../src/decorators/model';
import BaseModel from '../src/model/model';

@Table('posts')
export class PostModel extends BaseModel {
  @Column({ isPrimary: true })
  id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @BeforeSave()
  getPostTitle({ title }) {
    console.log(title);
  }

  @AfterSave()
  getPostId({ id }) {
    console.log(id);
  }
}
