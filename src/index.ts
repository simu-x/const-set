import ConstSetError from './ConstSetError';

const className = 'ConstSet';

const validateConstructorArguments = <T>(argumentsArr: any[]): Set<T> => {
  // Arg Validation
  if (argumentsArr.length < 1) {
    throw TypeError(
      [`${className} constructor takes a list of strings.`, `Received no arguments`].join('\n')
    );
  }

  // Input Validation
  const nonStringArgs = argumentsArr.reduce((a, v, i) => {
    if (typeof v !== 'string') return [...a, `arg[${i}]: typeof ${typeof v}`];
    return a;
  }, []);
  if (nonStringArgs.length > 0) {
    throw TypeError(
      [
        `${className} constructor takes a list of strings.`,
        `${nonStringArgs.length} arguments were non-strings:`,
        ...nonStringArgs,
      ].join('\n')
    );
  }

  // Const Strings must be /^[a-zA-Z][a-zA-Z0-9_]*$/
  const validStringRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  const nonValidStrings = argumentsArr.reduce((a, v, i) => {
    if (!validStringRegex.test(v)) return [...a, `arg[${i}]: ${v}`];
    return a;
  }, []);
  if (nonValidStrings.length > 0) {
    throw TypeError(
      [
        `${className} constructor takes a list of strings matching ${validStringRegex.toString()}.`,
        `${nonValidStrings.length} arguments did not pass validation:`,
        ...nonValidStrings,
      ].join('\n')
    );
  }

  return new Set(argumentsArr) as Set<T>;
};

/**
 * A unique set of constants derived from a set of appropriate strings.
 * The list of given strings should match /^[a-zA-Z_]+$/
 */
class ConstSet<T extends string> {
  #constSet: Set<T>;

  /**
   * Creates a unique set of string constants which are self-indexing.
   * Consts are case-insensitive and will be forced to lowercase.
   * @param {...string} constStrings A list of strings which will be treated as constants
   */
  constructor(...constStrings: T[]) {
    // Assign to internal Set
    this.#constSet = validateConstructorArguments<T>(constStrings);
  }

  /**
   * Gets an indexed object of the input strings as constants
   */
  get value(): Record<T, T> {
    return Object.fromEntries(this.#constSet.entries()) as Record<T, T>;
  }

  get size() {
    return this.#constSet.size;
  }

  /**
   * Get an array populated with the consts as strings
   */
  values(): T[] {
    return [...this.#constSet];
  }

  /**
   * @throws {TypeError}
   */
  is(possibleConst: T | string): possibleConst is T {
    if (typeof possibleConst !== 'string') {
      throw TypeError(
        `${className}.is() takes a {string} argument. Received: ${typeof possibleConst}`
      );
    }
    return this.#constSet.has(possibleConst as T);
  }

  /**
   * @throws {ConstSetError | TypeError}
   */
  assert(possibleConst: T | string): T {
    if (typeof possibleConst !== 'string') {
      throw TypeError(
        `${className}.assert() takes a {string} argument. Received: ${typeof possibleConst}`
      );
    }
    const errorMessage = `Unknown const value ${possibleConst}`;
    if (!this.is(possibleConst)) throw new ConstSetError(this.values(), errorMessage);
    else return possibleConst as T;
  }
}

export default ConstSet;
export {ConstSetError};
