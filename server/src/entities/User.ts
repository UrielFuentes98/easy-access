import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Question } from "./Question";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  issuer!: string;

  @Property()
  lastLogin!: number;

  @ManyToOne(() => Question, { nullable: true })
  question_private?: Question;

  @Property({ nullable: true })
  answer_private?: string;

  @ManyToOne(() => Question, { nullable: true })
  question_public?: Question;

  @Property({ nullable: true })
  answer_public?: string;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
