export class AuditableEntity<T> {
	public id: string;
	public createdBy: string;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(partial: Partial<T>) {
		const parsedPartial = this._resolveUndefinedToNull(partial);
		Object.assign(this, parsedPartial);
	}

	// -------------------------------PRIVATE--------------------------------- //

	private _resolveUndefinedToNull<T>(partial: Partial<T>): Partial<T> {
		return Object.keys(partial).reduce(
			(acc, key) => {
				acc[key] = partial[key] === undefined ? null : partial[key];
				return acc;
			},
			{} as Partial<T>,
		);
	}
}
