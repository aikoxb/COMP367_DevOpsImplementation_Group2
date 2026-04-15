// server/app/utils/error.js
// Send standardized JSON error responses (status codes and error messages) from controllers to the client(React)

export const errorResponse = (res, status = 400, message = 'Server error') =>
    res.status(status).json({ error: message }); // Send the HTTP status code and return a JSON object with an error message