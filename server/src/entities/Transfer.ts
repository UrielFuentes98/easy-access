import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User";

@Entity()
export class Transfer {
  @PrimaryKey()
  id!: number;

  @Property()
  phrase!: string;

  @Property()
  duration!: number;

  @ManyToOne(() => User)
  owner!: User;

  @Property()
  is_public!: boolean;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
