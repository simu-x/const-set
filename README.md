[![Build Status](https://app.travis-ci.com/simu-x/const-set.svg?branch=main)](https://app.travis-ci.com/simu-x/const-set)
[![Coverage Status](https://coveralls.io/repos/github/simu-x/const-set/badge.svg?branch=main)](https://coveralls.io/github/simu-x/const-set?branch=main)

# const-set

A Typescript/Javascript utility for making Sets of constant strings

## Installation

```sh
npm install @simu-x/const-set --save
```

## Usage

```typescript
import ConstSet, {ConstSetError} from '@simu-x/const-set';

// Make a ConstSet
const flavors = new ConstSet('strawberry', 'vanilla');

// Works like a read-only JS Set
flavors.size; // '2'

// Indexed constants are type friendly
flavors.value.strawberry; // return constant string value

// You can get the whole set of constant strings as an array
flavors.values();

// Value Checking
flavors.is('vanilla'); // return true since this is a known constant string
flavors.is('chocolatte'); // return false since this is an unknown constant string
// Note: these also function as typeguards

// Value Assertion
try {
  flavors.assert('rocky_road');
} catch (e: Error) {
  /* handle your errors here */
  if (e instanceof ConstSetError) {
    /* handle specific ConstSetError if needed */
  }
}

try {
  const rockyRoad = flavors.assert('rocky_road'); // returns the known constant string if valid
}
```
