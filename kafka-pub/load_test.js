import { check, sleep } from "k6";
import http from "k6/http";

// Configuration
const url = "http://localhost:3000/tasks"; // Replace with your task creation endpoint
const targetRequestsPerSecond = 3000;

// Load test scenario
export const options = {
	scenarios: {
		load_test: {
			executor: "constant-arrival-rate",
			rate: targetRequestsPerSecond, // requests per second
			timeUnit: "1s", // per second
			duration: "30s", // duration of the test
			preAllocatedVUs: 100, // number of pre-allocated virtual users
			maxVUs: 200, // maximum number of virtual users
		},
	},
};

export default function () {
	// Define the task payload
	const payload = JSON.stringify({
		userId: `${Math.floor(Math.random() * 1000)}`,
		title: `Task ${Math.floor(Math.random() * 1000)}`, // Random task title
		description: "Description for the task", // Task description
	});

	// Set the headers
	const params = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	// Make the POST request to create a task
	const response = http.post(url, payload, params);

	// Check if the response status is 201 (Created)
	check(response, {
		"is status 201": (r) => r.status === 201,
	});

	// Optional: Sleep to simulate user think time (if needed)
	sleep(0);
}
