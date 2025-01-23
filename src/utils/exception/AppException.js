class AppException extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.stack = new Error().stack;
  }
}
export default AppException;
