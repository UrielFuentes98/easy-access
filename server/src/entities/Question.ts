import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Question {
  @PrimaryKey()
  id!: number;

  @Property()
  question!: string;

  @OneToMany(() => User, user => user.question_private)
  users_with_question_as_private = new Collection<User>(this);

  @OneToMany(() => User, user => user.question_public)
  users_with_question_as_public = new Collection<User>(this);
}