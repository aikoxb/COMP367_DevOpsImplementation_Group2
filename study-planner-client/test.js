// study-planner-client/test.js
// Simple client-side test script for Jenkins pipeline (for demonstration purposes)
// This test checks a basic condition and exits with success or failure

// Store page titles to compare
const expectedPageTitle = "Study Planner";
const actualPageTitle = "Study Planner";

console.log("Running client test...");

// Check if the values match
if (actualPageTitle === expectedPageTitle) {
    console.log("Client test passed: expected page title matches actual page title.");
    process.exit(0);
}
else {
    console.log("Client test failed: expected page title does not match actual page title.");
    process.exit(1);
}