import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Question } from "./Question";
import { Transfer } from "./Transfer";

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

  @OneToMany(() => Transfer, (transfer) => transfer.owner)
  user_transfers = new Collection<Transfer>(this);

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
