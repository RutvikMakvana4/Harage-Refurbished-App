import { validationError } from '../../../utils/response/responseCode';
import GeneralError from '../../common/exceptions/generalError';

const error = (error, req, res, next) => {
    if (error instanceof GeneralError) {
        return res.status(error.status).json({ message: error.message })
    }

    if (error && error.error && error.error.isJoi) {
        return res.status(validationError).json({
            status: "error",
            message: error.error.details[0].message,
        })
    }

      if (error.statusCode) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
}

module.exports = error