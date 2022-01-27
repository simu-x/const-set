import {suite} from 'uvu';
import * as assert from 'uvu/assert';

import ConstSet, {ConstSetError} from '../../src';

// Tooling for testing for unknowns (needed if consumed as JS)
type UnknownObj = {
  value: unknown;
  type: string;
};

const makeUnknownObject = (value: any): UnknownObj => ({
  value,
  type: typeof value,
});

const unknowns = [2, 'str', {}, null, false].map(makeUnknownObject);

const callbackAgainstUnknowns = (callback: (u: UnknownObj) => void) =>
  unknowns.forEach((unknownObj) => {
    callback(unknownObj);
  });

// Constructor
const ConstructorSuite = suite('constructor()');

callbackAgainstUnknowns(({value, type}) => {
  if (type !== 'string') {
    ConstructorSuite(`should throw TypeError when given ${type} in args`, () => {
      assert.throws(
        () => new ConstSet(value as string),
        (err: any) => err instanceof TypeError
      );
    });
  }
});

ConstructorSuite('should validate constructor arguments', () => {
  assert.throws(
    () => new ConstSet(),
    (err: any) => err instanceof TypeError
  );
  assert.throws(
    () => new ConstSet('2sd'),
    (err: any) => err instanceof TypeError
  );

  const badArg: unknown = 2;
  assert.throws(
    () => new ConstSet(badArg as string),
    (err: any) => err instanceof TypeError
  );
});

ConstructorSuite.run();

/**
 * Size Tests
 */
const SizeSuite = suite('size');

SizeSuite('should have length equal to size arguments Set', () => {
  const args = ['foo', 'bar', 'foo', 'BAR'];
  const myConstSet = new ConstSet(...args);
  const argSet = new Set(args);

  assert.equal(myConstSet.size, argSet.size);
});

SizeSuite.run();

/**
 * is Tests
 */
const IsSuite = suite('is()');

callbackAgainstUnknowns(({value, type}) => {
  if (type !== 'string') {
    IsSuite(`should throw TypeError when given ${type}`, () => {
      const arg = 'foo';
      const myConstSet = new ConstSet(arg);

      assert.throws(
        () => myConstSet.is(value as string),
        (err: any) => err instanceof TypeError
      );
    });
  }
});

IsSuite('should return true for known const strings', () => {
  const arg = 'foo';
  const myConstSet = new ConstSet(arg);

  assert.ok(myConstSet.is(arg));
});

IsSuite('should return false for unknown const strings', () => {
  const arg = 'foo';
  const myConstSet = new ConstSet(arg);

  assert.not.ok(myConstSet.is('bar'));
});

IsSuite.run();

/**
 * assert Tests
 */
const AssertSuite = suite('assert()');

callbackAgainstUnknowns(({value, type}) => {
  if (type !== 'string') {
    AssertSuite(`should throw TypeError when given ${type}`, () => {
      const arg = 'foo';
      const myConstSet = new ConstSet(arg);

      assert.throws(
        () => myConstSet.assert(value as string),
        (err: any) => err instanceof TypeError
      );
    });
  }
});

AssertSuite('should return the value is it is a valid const string', () => {
  const arg = 'foo';
  const myConstSet = new ConstSet(arg);

  assert.equal(myConstSet.assert(arg), 'foo');
});

AssertSuite('should throw ConstSetError for invalid const strings', () => {
  const arg = 'foo';
  const myConstSet = new ConstSet(arg);

  assert.throws(
    () => myConstSet.assert('bar'),
    (err: any) => err instanceof ConstSetError
  );
});

AssertSuite.run();

/**
 * value Tests
 */
const ValueSuite = suite('value');

ValueSuite('should map 1:1 input string to value[arg]', () => {
  const args = ['foo', 'bar', 'BAR'];
  const myConstSet = new ConstSet(...args);

  args.forEach((arg) => {
    assert.equal(myConstSet.value[arg], arg);
  });
});

ValueSuite('should have case-sensitive value entries', () => {
  const arg = 'foo';
  const myConstSet = new ConstSet(arg);

  assert.equal(myConstSet.value[arg.toUpperCase()], undefined);
});

ValueSuite.run();

/**
 * values Tests
 */
const ValuesSuite = suite('values()');

ValuesSuite('should return Set of known const strings as Array', () => {
  const args = ['foo', 'bar', 'BAR', 'foo'];
  const argSet = new Set(args);

  const myConstSet = new ConstSet(...args);
  const constSetValues = myConstSet.values();

  assert.equal(constSetValues.length, argSet.size, 'Expected values length to be same as Set size');
  assert.equal(constSetValues.length, myConstSet.size);

  for (const arg of argSet.values()) {
    assert.ok(constSetValues.includes(arg));
  }
});

ValuesSuite.run();
