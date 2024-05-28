class WrongUserError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "Forbidden: Access by wrong user detected.";
    this.statusCode = 403;
    this.name = "WrongUserError";
  }
}

export default WrongUserError;
