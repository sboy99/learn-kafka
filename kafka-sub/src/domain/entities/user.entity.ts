import { AuditableEntity } from "./common/auditable.entity";

export class User extends AuditableEntity<User> {
	public name: string;
	public email: string;
}
