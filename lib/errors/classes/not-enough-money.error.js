class NotEnoughMoneyError extends Error {
  constructor(msg) {
    super(msg);
    this.msg = msg || "You don't have enough money.";
    this.statusCode = 403;
    this.name = "NotEnoughMoneyError";
  }
}

export default NotEnoughMoneyError;
