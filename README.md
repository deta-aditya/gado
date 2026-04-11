# gado

[![CI](https://github.com/deta-aditya/gado/actions/workflows/ci.yml/badge.svg)](https://github.com/deta-aditya/gado/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/deta-aditya/gado/graph/badge.svg)](https://codecov.io/gh/deta-aditya/gado)
[![npm](https://img.shields.io/npm/v/@detaditya/gado)](https://www.npmjs.com/package/@detaditya/gado)

Facilitates you in writing easy functional style code.

## Motivation

Most functional programming libraries in TypeScript are function-based and lean heavily into category theory jargon. That makes them powerful, but intimidating and confusing for everyday use. If you just want to stop throwing exceptions or eliminate `null` checks, you shouldn't need to learn what a "monad transformer" is first.

**gado** takes a different approach:

- **Method chaining over pipes and free functions.** Call `.map()`, `.flatMap()`, `.getOr()` directly on values — a style most TypeScript developers already know from arrays and promises.
- **Familiar naming.** Methods are named after what they do, not what category-theory concept they implement.
- **Not "extremely pure."** Pragmatism over dogma. Side-effecting helpers like `.peek()` and escape hatches like `.getOrThrow()` are first-class citizens because real-world code needs them.

## Installation

```bash
npm install gado
# or
bun add gado
```

## Option

`Option<T>` represents a value that may or may not exist. Use it instead of `null` or `undefined` to make the absence of a value explicit and safe.

- `Some<T>` — contains a value
- `None` — represents no value

### Creating Options

```ts
import { Option } from "gado";

// From a known value
const some = Option.some(42);
const none = Option.none<number>();

// Alias for some
const opt = Option.of(42);

// From a nullable value
const fromNull = Option.fromNullable(possiblyNull); // Some(value) or None

// From a predicate
const positive = Option.fromPredicate(5, (n) => n > 0); // Some(5)

// From a function that may throw
const parsed = Option.tryCatch(() => JSON.parse(input)); // Some(result) or None
```

### Transforming

```ts
const doubled = Option.some(5).map((n) => n * 2); // Some(10)

const flattened = Option.some(5).flatMap((n) =>
  n > 0 ? Option.some(n) : Option.none()
); // Some(5)

const filtered = Option.some(5).filter((n) => n > 3); // Some(5)

const peeked = Option.some(5).peek((n) => console.log(n)); // logs 5, returns Some(5)
```

### Extracting Values

```ts
Option.some(5).getOr(0);           // 5
Option.none().getOr(0);            // 0

Option.some(5).getOrElse(() => 0); // 5
Option.none().getOrElse(() => 0);  // 0

Option.some(5).getOrNull();        // 5
Option.none().getOrNull();         // null

Option.some(5).getOrUndefined();   // 5
Option.none().getOrUndefined();    // undefined

Option.some(5).getOrThrow("No value!"); // 5
Option.none().getOrThrow("No value!"); // throws Error("No value!")
```

### Pattern Matching

```ts
const result = Option.some(5).fold(
  () => "nothing",
  (n) => `got ${n}`
); // "got 5"

const result = Option.some(5).match({
  none: () => "nothing",
  some: (n) => `got ${n}`,
}); // "got 5"
```

### Combining Options

```ts
// zip — combine two Options into a tuple
Option.some(1).zip(Option.some("a")); // Some([1, "a"])

// zipWith — combine with a function
Option.some(1).zipWith(Option.some(2), (a, b) => a + b); // Some(3)

// unzip — split a tuple Option
Option.some([1, "a"]).unzip(); // [Some(1), Some("a")]

// and / or / xor
Option.some(1).and(Option.some(2)); // Some(2)
Option.none().or(Option.some(2));   // Some(2)
Option.some(1).xor(Option.none());  // Some(1)

// ap — apply a function inside an Option
Option.some((n: number) => n * 2).ap(Option.some(5)); // Some(10)
```

### Collecting Options

```ts
// Collect an array — all must be Some
Option.collectArray([Option.some(1), Option.some(2)]); // Some([1, 2])
Option.collectArray([Option.some(1), Option.none()]);  // None

// Collect a tuple
Option.collectTuple([Option.some(1), Option.some("a")]); // Some([1, "a"])

// Collect an object
Option.collectObject({ x: Option.some(1), y: Option.some(2) }); // Some({ x: 1, y: 2 })
```

### Type Guards

```ts
const opt = Option.some(5);

if (opt.isSome()) {
  console.log(opt.value); // TypeScript knows this is Some<number>
}

if (opt.isNone()) {
  // TypeScript knows this is None
}
```

### Other Utilities

```ts
// has — check if value satisfies a predicate
Option.some(5).has((n) => n > 3); // true

// extract — map + getOrNull shorthand
Option.some(5).extract((n) => n.toString()); // "5"
Option.none().extract((n) => n.toString());  // null
```

---

## Result

`Result<T, E>` represents an operation that can succeed with a value `T` or fail with an error `E`. Use it instead of throwing exceptions.

- `Ok<T, E>` — contains a success value
- `Err<T, E>` — contains an error

### Creating Results

```ts
import { Result } from "gado";

const ok = Result.ok<number, string>(42);
const err = Result.err<number, string>("something went wrong");

// From a nullable value
const fromNull = Result.fromNullable(value, () => "was null");

// From an Option
const fromOpt = Result.fromOption(someOption, () => "was None");

// From a predicate
const positive = Result.fromPredicate(5, (n) => n > 0, (n) => `${n} is not positive`);

// From a function that may throw
const parsed = Result.tryCatch(() => JSON.parse(input)); // Ok(result) or Err(error)
```

### Transforming

```ts
Result.ok(5).map((n) => n * 2);          // Ok(10)
Result.err("fail").mapErr((e) => e.toUpperCase()); // Err("FAIL")

Result.ok(5).flatMap((n) =>
  n > 0 ? Result.ok(n) : Result.err("not positive")
); // Ok(5)

Result.ok(5).filterOrElse(
  (n) => n > 3,
  (n) => `${n} is too small`
); // Ok(5)

Result.ok(5).swap();  // Err(5)
Result.err(5).swap(); // Ok(5)

Result.ok(5).peek((n) => console.log(n));       // logs 5, returns Ok(5)
Result.err("x").peekErr((e) => console.log(e)); // logs "x", returns Err("x")
```

### Extracting Values

```ts
Result.ok(5).getOr(0);                    // 5
Result.err("fail").getOr(0);              // 0

Result.ok(5).getOrElse((err) => 0);       // 5
Result.err("fail").getOrElse((err) => 0); // 0

Result.ok(5).getOrNull();       // 5
Result.err("fail").getOrNull(); // null

Result.ok(5).getOrThrow();        // 5
Result.err("fail").getOrThrow();  // throws "fail"

// Access Ok/Err as Options
Result.ok(5).getOk();    // Some(5)
Result.ok(5).getErr();   // None
Result.err("x").getErr(); // Some("x")

// Error-side accessors
Result.err("x").getErrOr("default");             // "x"
Result.ok(5).getErrOr("default");                // "default"
Result.err("x").getErrOrElse((val) => "fallback"); // "x"

// Unpack into a tuple
Result.ok(5).unpack();       // [5, null]
Result.err("x").unpack();   // [null, "x"]
```

### Pattern Matching

```ts
const msg = Result.ok(5).fold(
  (err) => `error: ${err}`,
  (val) => `value: ${val}`
); // "value: 5"

const msg = Result.ok(5).match({
  ok: (val) => `value: ${val}`,
  err: (err) => `error: ${err}`,
}); // "value: 5"
```

### Combining Results

```ts
// zip / zipWith
Result.ok(1).zip(Result.ok("a"));                        // Ok([1, "a"])
Result.ok(1).zipWith(Result.ok(2), (a, b) => a + b);     // Ok(3)

// unzip
Result.ok([1, "a"]).unzip(); // [Ok(1), Ok("a")]

// and / or / orElse
Result.ok(1).and(Result.ok(2));                    // Ok(2)
Result.err("x").or(Result.ok(2));                  // Ok(2)
Result.err("x").orElse((e) => Result.ok(0));       // Ok(0)

// ap — apply a function inside a Result
Result.ok((n: number) => n * 2).ap(Result.ok(5)); // Ok(10)
```

### Collecting Results

```ts
// Collect an array — all must be Ok, returns first Err otherwise
Result.collectArray([Result.ok(1), Result.ok(2)]);              // Ok([1, 2])
Result.collectArray([Result.ok(1), Result.err("fail")]);        // Err("fail")

// Collect a tuple
Result.collectTuple([Result.ok(1), Result.ok("a")]);            // Ok([1, "a"])

// Collect an object
Result.collectObject({ x: Result.ok(1), y: Result.ok(2) });    // Ok({ x: 1, y: 2 })
```

### Type Guards

```ts
const res = Result.ok(5);

if (res.isOk()) {
  console.log(res.value); // TypeScript narrows to Ok
}

if (res.isErr()) {
  console.log(res.error); // TypeScript narrows to Err
}
```

### Other Utilities

```ts
// extract / extractErr — map + getOrNull shorthand
Result.ok(5).extract((n) => n.toString());       // "5"
Result.err("x").extractErr((e) => e.length);     // 1

// peekBoth — inspect both sides as a tuple
Result.ok(5).peekBoth(([val, err]) => console.log(val, err)); // logs 5, null
```

---

## Roadmap

- [ ] Computation notation
- [ ] Tagged union primitives
- [ ] Additional monadic types
- [ ] Piping API

## License

MIT
