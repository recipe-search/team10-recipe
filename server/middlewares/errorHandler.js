const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = 500;
    let errorCode = err.name || 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'Internal server error!';

    switch (err.name) {
        case 'SequelizeValidationError':
            statusCode = 400;
            errorCode = 'VALIDATION_ERROR';
            errorMessage = err.errors.map((el) => el.message);
            break;
        case 'LOGIN_FAIL':
            statusCode = 401;
            errorMessage = 'Email and password combination not found!';
            break;
        case 'INVALID_USER':
            statusCode = 401;
            errorMessage = 'Invalid user!';
            break;
        case 'MISSING_TOKEN':
            statusCode = 401;
            errorMessage = 'Access token missing!';
            break;
        case 'FORBIDDEN':
            statusCode = 403;
            errorMessage = 'User has no rights to access this resource!';
            break;
        case 'RESOURCE_NOT_FOUND':
            statusCode = 404;
            errorMessage = 'Resource not found!';
            break;
        case 'SequelizeUniqueConstraintError':
            statusCode = 409;
            errorCode = 'CONFLICT';
            errorMessage = 'Email already exists!';
            break;
        case 'INVALID_ACCESS_TOKEN':
            statusCode = 500;
            errorMessage = 'Invalid access token!';
            break;
        default:
            statusCode = 500;
            errorMessage = 'Internal server error!';
    }

    res.status(statusCode).json({ error_code: errorCode, message: errorMessage });
};

module.exports = errorHandler;
