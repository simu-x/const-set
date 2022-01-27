const name = 'ConstSetError';

class ConstSetError<T extends string> extends Error {
  public knownConsts: T[];
  public withV8: boolean;

  constructor(knownConsts: T[], message = 'Unspecified Error') {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConstSetError);
      this.withV8 = true;
    } else {
      this.withV8 = false;
    }

    this.name = name;
    this.knownConsts = knownConsts;
  }
}

export default ConstSetError;
