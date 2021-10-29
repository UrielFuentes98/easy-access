import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Transfer } from "./Transfer";

@Entity()
export class File {
  @PrimaryKey()
  id!: number;

  @Property()
  uuid_name!: string;

  @Property()
  original_name!: string;

  @ManyToOne(() => Transfer)
  file_transfer!: Transfer;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
