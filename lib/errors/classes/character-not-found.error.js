class CharacterNotFoundError extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || "Character not found.";
    this.name = "CharacterNotFoundError";
    this.statusCode = 404;
  }
}

export default CharacterNotFoundError;
