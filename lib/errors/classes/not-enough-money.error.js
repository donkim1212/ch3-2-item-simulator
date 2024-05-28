class NotEnoughMoneyError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "You don't have enough money.";
    this.statusCode = 403;
    this.name = "NotEnoughMoneyError";
  }
}

export default NotEnoughMoneyError;
