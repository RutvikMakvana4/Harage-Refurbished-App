import { badRequest, conflictError, validationError, notFound, forbidden, unAuthorized, internalServerError } from "../../../utils/response/responseCode";
import GeneralError from "./generalError";

export class Exception extends GeneralError {
    constructor(message) {
        super();
        if (this instanceof BadRequestException) {
            this.status = badRequest;
        } else if (this instanceof NotFoundException) {
            this.status = notFound;
        } else if (this instanceof ForbiddenException) {
            this.status = forbidden;
        } else if (this instanceof UnauthorizedException) {
            this.status = unAuthorized;
        } else if (this instanceof ConflictException) {
            this.status = conflictError;
        } else if (this instanceof InternalServerError) {
            this.status = internalServerError;
        } else if (this instanceof ValidationError) {
            this.status = validationError;
        } else {
            this.status = internalServerError;
        }
        this.message = message;
    }
}

export class BadRequestException extends Exception { }
export class NotFoundException extends Exception { }
export class ForbiddenException extends Exception { }
export class ConflictException extends Exception { }
export class UnauthorizedException extends Exception { }
export class InternalServerError extends Exception { }
export class ValidationError extends Exception { }
