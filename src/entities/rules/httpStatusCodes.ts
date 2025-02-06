enum httpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY =  422,
    INTERNAL_SERVER_ERROR = 500,
    NO_CONTENT = 204,
    NOT_MODIFIED = 304
}

export default httpStatus