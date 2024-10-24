import type { Task, User } from "@/domain/entities";

export type TRecords = "TASKS" | "USERS";

export type TDBSchemaMap<T extends TRecords> = {
	TASKS: Task;
	USERS: User;
}[T];

export interface DbPort<T extends TRecords, TEntity = TDBSchemaMap<T>> {
	// mutation //
	insert(table: T, entity: TEntity): Promise<void>;
	insertMany(table: T, entities: TEntity[]): Promise<void>;
	upsert(table: T, entity: TEntity): Promise<void>;
	update(table: T, id: string, entity: TEntity): Promise<void>;
	delete(table: T, id: string): Promise<void>;
	// query //
	findOne(table: T, id: string): Promise<TEntity | null>;
	list(table: T): Promise<TEntity[]>;
}
