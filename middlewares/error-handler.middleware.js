const errorHandler = (err, req, res, next) => {
  let msg = "An error occurred.";
  console.error(err);

  if (err.code === 11000) {
    msg = "Failed: Tried to post with a duplicate key.";
    return res.status(500).json({ message: err.message });
  } else if (err.code === "P2025") {
    return res.status(404).json({ message: err.message });
  } else if (
    err.name === "ItemNotFoundError" ||
    err.name === "CharacterNotFoundError" ||
    err.name === "InvalidEquipOperationError"
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: msg });
};

export default errorHandler;
