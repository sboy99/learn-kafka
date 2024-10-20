import { execSync } from "node:child_process";

const ValidOperations = ["generate", "migrate", "push", "pull"] as const;

function getOperationName(): (typeof ValidOperations)[number] {
	const argV = process.argv;
	const operationName = argV?.[2] as (typeof ValidOperations)[number];

	if (!operationName) {
		throw new Error("No operation name was provided.");
	}

	if (!ValidOperations.includes(operationName)) {
		throw new Error(
			`Invalid operation name. Please use one of the following: ${ValidOperations.join(", ")}`,
		);
	}

	return operationName;
}

function getMigrationName(): string {
	const argV = process.argv;
	const migrationName = argV?.[3];

	if (!migrationName) {
		throw new Error("No migration name was provided.");
	}

	return migrationName;
}

function getConfigPath(): string {
	return "./db/drizzle.config.ts";
}

function getGenerateMigrationCommand(): string {
	const migrationName = getMigrationName();
	const configPath = getConfigPath();

	return `npx drizzle-kit generate --config=${configPath} --name=${migrationName}`;
}

function getMigrateMigrationCommand(): string {
	const configPath = getConfigPath();

	return `npx drizzle-kit migrate --config=${configPath}`;
}

function getPushMigrationCommand(): string {
	const configPath = getConfigPath();

	return `npx drizzle-kit push --config=${configPath}`;
}

function getPullMigrationCommand(): string {
	const configPath = getConfigPath();

	return `npx drizzle-kit pull --config=${configPath}`;
}

function main(): void {
	try {
		const operationName = getOperationName();
		let command = "";

		switch (operationName) {
			case "generate":
				command = getGenerateMigrationCommand();
				break;
			case "migrate":
				command = getMigrateMigrationCommand();
				break;
			case "push":
				command = getPushMigrationCommand();
				break;
			case "pull":
				command = getPullMigrationCommand();
				break;
			default:
				throw new Error(`Invalid operation name. ${command}`);
		}

		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error("Error running migration:", error.message);
		process.exit(1);
	}
}

main();
