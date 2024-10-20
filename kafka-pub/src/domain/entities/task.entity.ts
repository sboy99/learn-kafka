import { AuditableEntity } from "./common/auditable.entity";

export class Task extends AuditableEntity<Task> {
	public title: string;
	public description: string | null;
	public status: string;
}
