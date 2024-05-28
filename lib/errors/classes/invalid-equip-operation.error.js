class InvalidEquipOperationError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "Invalid equip operation detected.";
    this.name = "InvalidEquipOperationError";
    this.statusCode = 409;
  }
}

export default InvalidEquipOperationError;
