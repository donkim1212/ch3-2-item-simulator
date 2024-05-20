const errorHandler = (err, req, res, next) => {
  let msg = "An error occurred.";
  console.error(err);

  if (err.code == 11000) {
    msg = "Failed: Tried to post with a duplicate key.";
    return res.status(500).json({ errorMessage: msg });
  } else if (
    err.name === "ItemNotFoundError" ||
    err.name === "CharacterNotFoundError" ||
    err.name === "InvalidEquipOperationError"
  ) {
    return res.status(err.statusCode).json({ errorMessage: err.message });
  }

  return res.status(500).json({ errorMessage: msg });
};

export default errorHandler;
