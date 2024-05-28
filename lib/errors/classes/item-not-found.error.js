class ItemNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "Item not found.";
    this.name = "ItemNotFoundError";
    this.statusCode = 404;
  }
}

export default ItemNotFoundError;
