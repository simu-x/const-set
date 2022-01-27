import {suite} from 'uvu';
import * as assert from 'uvu/assert';

import ConstSetError from '../../src/ConstSetError';

const ConstSetErrorSuite = suite('contructor()');

ConstSetErrorSuite('should have name: ConstSetError', () => {
  const e = new ConstSetError(['foo']);

  assert.equal(e.name, 'ConstSetError');
  assert.equal(e.knownConsts, ['foo']);
  assert.equal(e.message, 'Unspecified Error');
});

ConstSetErrorSuite('should run capture stack trace if available', () => {
  let stashErr: Error;
  let stashFn: any;
  try {
    stashFn = Error.captureStackTrace;
    Error.captureStackTrace = (thiz: any, errType: any) => {
      assert.equal(errType, ConstSetError);
    };

    const yesStack = new ConstSetError(['val']);
    assert.ok(yesStack.withV8);

    // Check that stack is undefined when this fn is undefined
    Error.captureStackTrace = undefined;

    const noStack = new ConstSetError(['val']);
    assert.not.ok(noStack.withV8);
  } catch (e) {
    stashErr = e;
  } finally {
    Error.captureStackTrace = stashFn;
    if (stashErr) {
      /* eslint-disable no-unsafe-finally */
      throw stashErr;
    }
  }
});

ConstSetErrorSuite.run();
