// // class ErrorHandler extends Error {
// //   constructor(message, statusCode) {
// //     super(message);
// //     this.statusCode = statusCode;
// //   }
// // }

// // export const errorMiddleware = (err, req, res, next) => {
// //   err.message = err.message || "Internal Server Error";
// //   err.statusCode = err.statusCode || 500;

// //   if (err.name === "CastError") {
// //     const message = `Resource not found. Invalid ${err.path}`,
// //       err = new ErrorHandler(message, 400);
// //   }
// //   if (err.code === 11000) {
// //     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
// //       err = new ErrorHandler(message, 400);
// //   }
// //   if (err.name === "JsonWebTokenError") {
// //     const message = `Json Web Token is invalid, Try again!`;
// //     err = new ErrorHandler(message, 400);
// //   }
// //   if (err.name === "TokenExpiredError") {
// //     const message = `Json Web Token is expired, Try again!`;
// //     err = new ErrorHandler(message, 400);
// //   }
// //   return res.status(err.statusCode).json({
// //     success: false,
// //     message: err.message,
// //   });
// // };

// // export default ErrorHandler;

// class ErrorHandler extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

// export const errorMiddleware = (err, req, res, next) => {
//   let error = { ...err };

//   error.message = err.message || "Internal Server Error";
//   error.statusCode = err.statusCode || 500;

//   if (err.name === "CastError") {
//     const message = `Resource not found. Invalid ${err.path}`;
//     error = new ErrorHandler(message, 400);
//   }

//   if (err.code === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//     error = new ErrorHandler(message, 400);
//   }

//   if (err.name === "JsonWebTokenError") {
//     const message = `Json Web Token is invalid, Try again!`;
//     error = new ErrorHandler(message, 400);
//   }

//   if (err.name === "TokenExpiredError") {
//     const message = `Json Web Token is expired, Try again!`;
//     error = new ErrorHandler(message, 400);
//   }

//   return res.status(error.statusCode).json({
//     success: false,
//     message: error.message,
//   });
// };

// export default ErrorHandler;

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  let error;

  if (typeof err === "string") {
    error = new ErrorHandler(err, 500);
  } else if (err instanceof ErrorHandler) {
    error = err;
  } else if (err instanceof Error) {
    error = new ErrorHandler(err.message, err.statusCode || 500);
  } else {
    error = new ErrorHandler("Internal Server Error", 500);
  }

  // Specific error handlers
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    error = new ErrorHandler(message, 400);
  }

  // Ensure valid status code
  const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default ErrorHandler;
