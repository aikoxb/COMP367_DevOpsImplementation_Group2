// server/test.js
// Simple server-side test script for Jenkins pipeline (for demonstration purposes)
// This test checks a basic condition and exits with success or failure

// Store statuses to compare
const expectedStatus = "connected";
const actualStatus = "connected";

console.log("Running server test...");

// Check if the values match
if (actualStatus === expectedStatus) {
    console.log("Server test passed: expected status matches actual status.");
    process.exit(0);
}
else {
    console.log("Server test failed: expected status does not match actual status.");
    process.exit(1);
}