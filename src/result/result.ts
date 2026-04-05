import { Option } from "../option";

export abstract class Result<T, E> {

  /**
   * A private property used for type branding to distinguish between Ok and Err at runtime. This property is not intended to be accessed directly and is only used for internal type checking purposes.
   */
  abstract readonly _tag: string;

  // ===========================
  // Type Guards
  // ===========================
  /**
   * Type guard that checks if this Result is an Ok. If this method returns true, TypeScript will narrow the type of this Result to Ok<T, E> within the scope of the check.
   * @since 0.1.0
   * @returns true if this Result is an Ok, false otherwise.
   */
  abstract isOk(): this is Ok<T, E>;

  /**
   * Type guard that checks if this Result is an Err. If this method returns true, TypeScript will narrow the type of this Result to Err<T, E> within the scope of the check.
   * @since 0.1.0
   * @returns true if this Result is an Err, false otherwise.
   */
  abstract isErr(): this is Err<T, E>;

  // ===========================
  // Selectors
  // ===========================
  /**
   * Returns the Ok value as an Option. If this is an Ok, it returns Some containing the value. If this is an Err, it returns None.
   * @since 0.1.0
   * @returns Some containing the value if this is an Ok, or None if this is an Err.
   */
  abstract getOk(): Option<T>;

  /**
   * Returns the Err value as an Option. If this is an Err, it returns Some containing the error. If this is an Ok, it returns None.
   * @since 0.1.0
   * @returns Some containing the error if this is an Err, or None if this is an Ok.
   */
  abstract getErr(): Option<E>;

  /**
   * Returns the contained value if this is an Ok, otherwise returns the provided default value.
   * @since 0.1.0
   * @param defaultValue A value of type T to be returned if this Result is an Err.
   * @returns The contained value if this is an Ok, or the default value if this is an Err.
   */
  abstract getOr(defaultValue: T): T;

  /**
   * Returns the contained value if this is an Ok, otherwise returns the result of calling the provided function with the error.
   * @since 0.1.0
   * @param fn A function that takes the error of type E and returns a value of type T to be used as a default.
   * @returns The contained value if this is an Ok, or the result of calling the function with the error if this is an Err.
   */
  abstract getOrElse(fn: (error: E) => T): T;

  /**
   * Returns the contained error if this is an Err, otherwise returns the provided default error.
   * @since 0.1.0
   * @param defaultError A value of type E to be returned if this Result is an Ok.
   * @returns The contained error if this is an Err, or the default error if this is an Ok.
   */
  abstract getErrOr(defaultError: E): E;

  /**
   * Returns the contained error if this is an Err, otherwise returns the result of calling the provided function with the value.
   * @since 0.1.0
   * @param fn A function that takes the value of type T and returns an error of type E to be used as a default.
   * @returns The contained error if this is an Err, or the result of calling the function with the value if this is an Ok.
   */
  abstract getErrOrElse(fn: (value: T) => E): E;

  /**
   * Returns the contained value if this is an Ok, otherwise returns null.
   * @since 0.1.0
   * @returns The contained value if this is an Ok, or null if this is an Err.
   */
  abstract getOrNull(): T | null;

  /**
   * Returns the contained value if this is an Ok, otherwise returns undefined.
   * @since 0.1.0
   * @returns The contained value if this is an Ok, or undefined if this is an Err.
   */
  abstract getOrUndefined(): T | undefined;

  /**
   * Returns the contained value if this is an Ok, otherwise throws the contained error.
   * @since 0.1.0
   * @returns The contained value if this is an Ok, or throws the error if this is an Err.
   */
  abstract getOrThrow(): T;

  /**
   * Folds the Result into a single value by applying one of two functions depending on whether this is an Ok or an Err. If this is an Ok, it will apply the ifOk function to the contained value. If this is an Err, it will apply the ifErr function to the contained error.
   * @since 0.1.0
   * @param ifErr A function that takes the error of type E and returns a value of type U to be used if this Result is an Err.
   * @param ifOk A function that takes the value of type T and returns a value of type U to be used if this Result is an Ok.
   * @returns The result of applying the appropriate function based on whether this Result is an Ok or an Err.
   */
  abstract fold<U>(ifErr: (error: E) => U, ifOk: (value: T) => U): U;

  /**
   * Matches the Result by applying one of two functions depending on whether this is an Ok or an Err. If this is an Ok, it will apply the ok function to the contained value. If this is an Err, it will apply the err function to the contained error.
   * @since 0.1.0
   * @param matcher An object containing two functions: one for handling the Ok case and one for handling the Err case.
   * @returns The result of applying the appropriate function based on whether this Result is an Ok or an Err.
   */
  abstract match<U>(matcher: { ok: (value: T) => U; err: (error: E) => U }): U;

  /**
   * A convenience method that combines the functionality of map and getOrNull. It applies a transform function to the contained value if this is an Ok, and returns the result. If this is an Err, it returns null regardless of the transform.
   * @since 0.1.0
   * @param transform A function that takes the value of type T and returns a value of type U.
   * @returns The result of applying the transform function if this is an Ok, or null if this is an Err.
   */
  abstract extract<U>(transform: (value: T) => U): U | null;

  /**
   * A convenience method that applies a transform function to the contained error if this is an Err, and returns the result. If this is an Ok, it returns null regardless of the transform.
   * @since 0.1.0
   * @param transform A function that takes the error of type E and returns a value of type U.
   * @returns The result of applying the transform function if this is an Err, or null if this is an Ok.
   */
  abstract extractErr<U>(transform: (error: E) => U): U | null;

  /**
   * Unpacks the Result into a tuple of nullable values. If this is an Ok, it returns a tuple with the value and null. If this is an Err, it returns a tuple with null and the error.
   * @since 0.1.0
   * @returns A tuple of [T | null, E | null] representing the contained value or error.
   */
  abstract unpack(): [T | null, E | null];

  // ===========================
  // Transformers
  // ===========================
  /**
   * Transforms the value inside the Result if it is an Ok, otherwise returns the Err unchanged.
   * @since 0.1.0
   * @param fn A function that transforms the value T into U.
   * @returns A Result containing the transformed value if this is an Ok, or the original Err if this is an Err.
   */
  abstract map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Transforms the error inside the Result if it is an Err, otherwise returns the Ok unchanged.
   * @since 0.1.0
   * @param fn A function that transforms the error E into F.
   * @returns A Result containing the transformed error if this is an Err, or the original Ok if this is an Ok.
   */
  abstract mapErr<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Transforms the value inside the Result using a function that returns another Result, effectively flattening the result.
   * @since 0.1.0
   * @param fn A function that transforms the value T into a Result of type U with error type E.
   * @returns The result of applying the function if this is an Ok, or the original Err if this is an Err.
   */
  abstract flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Flattens a Result of a Result into a single Result. If this is an Ok containing another Ok, it will return the inner Ok. If this is an Ok containing an Err, it will return that Err. If this is an Err, it will return the Err.
   * @since 0.1.0
   * @returns A Result containing the flattened value if this is an Ok of an Ok, or the appropriate Err otherwise.
   */
  abstract flatten<U>(this: Result<Result<U, E>, E>): Result<U, E>;

  /**
   * Returns this Result if it is an Ok and the predicate returns true for the contained value, otherwise returns an Err created by the error function. If this is an Err, it will return the Err regardless of the predicate.
   * @since 0.1.0
   * @param predicate A function that takes the value of type T and returns a boolean.
   * @param errorFn A function that takes the value of type T and returns an error of type E to be used if the predicate returns false.
   * @returns The original Result if this is an Ok and the predicate returns true, or an Err otherwise.
   */
  abstract filterOrElse(predicate: (value: T) => boolean, errorFn: (value: T) => E): Result<T, E>;

  /**
   * Swaps the Ok and Err values of this Result. If this is an Ok, it returns an Err containing the value. If this is an Err, it returns an Ok containing the error.
   * @since 0.1.0
   * @returns A Result with the Ok and Err values swapped.
   */
  abstract swap(): Result<E, T>;

  /**
   * Applies a function contained in a Result to the value contained in another Result. If both Results are Ok, it will return an Ok containing the result of applying the function to the value. If either Result is an Err, it will return the Err.
   * @since 0.1.0
   * @param this A Result containing a function that takes a value of type U and returns a value of type V.
   * @param value A Result containing a value of type U.
   * @returns A Result containing the result of applying the function if both Results are Ok, or an Err otherwise.
   */
  abstract ap<U, V>(this: Result<(value: U) => V, E>, value: Result<U, E>): Result<V, E>;

  /**
   * Combines this Result with another Result. If both Results are Ok, it will return an Ok containing a tuple of both values. If either Result is an Err, it will return the first Err encountered.
   * @since 0.1.0
   * @param other Another Result to combine with this Result.
   * @returns A Result containing a tuple of both values if both are Ok, or the first Err otherwise.
   */
  abstract zip<U>(other: Result<U, E>): Result<[T, U], E>;

  /**
   * Combines this Result with another Result using a provided function. If both Results are Ok, it will return an Ok containing the result of applying the function to both values. If either Result is an Err, it will return the first Err encountered.
   * @since 0.1.0
   * @param other Another Result to combine with this Result.
   * @param fn A function that takes the values of type T and U and returns a value of type V.
   * @returns A Result containing the result of applying the function if both are Ok, or the first Err otherwise.
   */
  abstract zipWith<U, V>(other: Result<U, E>, fn: (a: T, b: U) => V): Result<V, E>;

  /**
   * Unzips a Result containing a tuple into a tuple of Results. If this is an Ok containing a tuple, it will return a tuple of Ok values. If this is an Err, it will return a tuple of Err values with the same error.
   * @since 0.1.0
   * @returns A tuple of Results if this is an Ok containing a tuple, or a tuple of Err values if this is an Err.
   */
  abstract unzip<U, V>(this: Result<[U, V], E>): [Result<U, E>, Result<V, E>];

  /**
   * Returns the Err if this Result is an Err, otherwise returns the alternative Result.
   * @since 0.1.0
   * @param alternative An alternative Result to return if this Result is an Ok.
   * @returns The alternative Result if this Result is an Ok, otherwise this Err.
   */
  abstract and<U>(alternative: Result<U, E>): Result<U, E>;

  /**
   * Returns this Result if it is an Ok, otherwise returns the alternative Result.
   * @since 0.1.0
   * @param alternative An alternative Result to return if this Result is an Err.
   * @returns This Result if it is an Ok, otherwise the alternative Result.
   */
  abstract or(alternative: Result<T, E>): Result<T, E>;

  /**
   * Returns this Result if it is an Ok, otherwise returns the result of calling the alternative function with the error to get an alternative Result.
   * @since 0.1.0
   * @param alternativeFn A function that takes the error of type E and returns an alternative Result to be used if this Result is an Err.
   * @returns This Result if it is an Ok, otherwise the result of calling the alternative function.
   */
  abstract orElse(alternativeFn: (error: E) => Result<T, E>): Result<T, E>;

  /**
   * Applies a function to the value inside the Result if it is an Ok, without changing the structure of the Result. If this is an Err, it will return the Err unchanged.
   * @since 0.1.0
   * @param fn A function that takes the value of type T and returns void.
   * @returns This Result unchanged.
   */
  abstract peek(fn: (value: T) => void): Result<T, E>;

  /**
   * Applies a function to the error inside the Result if it is an Err, without changing the structure of the Result. If this is an Ok, it will return the Ok unchanged.
   * @since 0.1.0
   * @param fn A function that takes the error of type E and returns void.
   * @returns This Result unchanged.
   */
  abstract peekErr(fn: (error: E) => void): Result<T, E>;

  /**
   * Applies a function to both the value and error of this Result as a tuple of nullable values, without changing the structure of the Result. The function receives [value, null] for Ok and [null, error] for Err.
   * @since 0.1.0
   * @param fn A function that takes a tuple of [T | null, E | null] and returns void.
   * @returns This Result unchanged.
   */
  abstract peekBoth(fn: (both: [T | null, E | null]) => void): Result<T, E>;

  // ===========================
  // Constructors
  // ===========================
  /**
   * Creates a new Ok instance with the provided value.
   * @since 0.1.0
   * @param value The value to be contained in the Ok.
   * @returns A new Ok instance containing the provided value.
   */
  static ok<T, E>(value: T): Result<T, E> {
    return new Ok(value);
  }

  /**
   * Creates a new Err instance with the provided error.
   * @since 0.1.0
   * @param error The error to be contained in the Err.
   * @returns A new Err instance containing the provided error.
   */
  static err<T, E>(error: E): Result<T, E> {
    return new Err(error);
  }

  /**
   * Creates a Result from a value that may be null or undefined. If the value is null or undefined, it returns an Err created by the error function. Otherwise, it returns Ok containing the value.
   * @since 0.1.0
   * @param value The value to be converted into a Result.
   * @param errorFn A function that returns the error to be used if the value is null or undefined.
   * @returns Ok containing the value if it is not null or undefined, or Err if it is null or undefined.
   */
  static fromNullable<T, E>(value: T | null | undefined, errorFn: () => E): Result<T, E> {
    if (value === null || value === undefined) {
      return Result.err(errorFn());
    }
    return Result.ok(value);
  }

  /**
   * Creates a Result from an Option. If the Option is a Some, it returns Ok containing the value. If the Option is a None, it returns an Err created by the error function.
   * @since 0.1.0
   * @param option The Option to be converted into a Result.
   * @param errorFn A function that returns the error to be used if the Option is a None.
   * @returns Ok containing the value if the Option is a Some, or Err if the Option is a None.
   */
  static fromOption<T, E>(option: Option<T>, errorFn: () => E): Result<T, E> {
    return option.fold(
      () => Result.err(errorFn()),
      (value) => Result.ok(value)
    );
  }

  /**
   * Creates a Result from a value based on a predicate function. If the predicate returns true for the given value, it returns Ok containing the value. Otherwise, it returns an Err created by the error function.
   * @since 0.1.0
   * @param value The value to be evaluated by the predicate.
   * @param predicate A function that takes the value and returns a boolean indicating whether the value should be wrapped in an Ok.
   * @param errorFn A function that takes the value and returns the error to be used if the predicate returns false.
   * @returns Ok containing the value if the predicate returns true, or Err if the predicate returns false.
   */
  static fromPredicate<T, E>(value: T, predicate: (value: T) => boolean, errorFn: (value: T) => E): Result<T, E> {
    if (predicate(value)) {
      return Result.ok(value);
    }
    return Result.err(errorFn(value));
  }

  /**
   * Executes a function that may throw an error and returns an Ok containing the result if the function executes successfully, or an Err containing the caught error if the function throws. This is useful for safely handling operations that may fail without having to use try-catch blocks directly in the code.
   * @since 0.1.0
   * @param fn A function that returns a value of type T and may throw an error.
   * @returns Ok containing the result of the function if it executes successfully, or Err containing the caught error if it throws.
   */
  static tryCatch<T, E = unknown>(fn: () => T): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(error as E);
    }
  }

  /**
   * Collects a tuple of Results into a Result of a tuple. If all elements in the tuple are Ok, it returns Ok containing a tuple of the values. If any element is an Err, it returns the first Err encountered.
   * @since 0.1.0
   * @param tuple A tuple of Results to be collected.
   * @returns Ok containing a tuple of values if all elements are Ok, or the first Err encountered.
   */
  static collectTuple<A, B, C>(tuple: [Result<A, C>, Result<B, C>]): Result<[A, B], C> {
    const [a, b] = tuple;
    return a.fold(
      (err) => Result.err(err),
      (valueA) => b.fold(
        (err) => Result.err(err),
        (valueB) => Result.ok([valueA, valueB])
      )
    );
  }

  /**
   * Collects an array of Results into a Result of an array. If all elements in the array are Ok, it returns Ok containing an array of the values. If any element is an Err, it returns the first Err encountered.
   * @since 0.1.0
   * @param results An array of Results to be collected.
   * @returns Ok containing an array of values if all elements are Ok, or the first Err encountered.
   */
  static collectArray<T, E>(results: Array<Result<T, E>>): Result<Array<T>, E> {
    const values: T[] = [];
    for (const result of results) {
      if (result.isErr()) {
        return Result.err(result.error);
      }
      
      if (result.isOk()) {
        values.push(result.value);
      }
    }
    return Result.ok(values);
  }

  /**
   * Collects an object of Results into a Result of an object. If all properties in the object are Ok, it returns Ok containing an object with the values. If any property is an Err, it returns the first Err encountered.
   * @since 0.1.0
   * @param results An object of Results to be collected.
   * @returns Ok containing an object with values if all properties are Ok, or the first Err encountered.
   */
  static collectObject<T extends Record<string, unknown>, E>(results: { [K in keyof T]: Result<T[K], E> }): Result<T, E> {
    const result: Partial<T> = {};
    for (const key in results) {
      const res = results[key];
      if (res.isErr()) {
        return Result.err(res.error);
      }
      if (res.isOk()) {
        result[key] = res.value;
      }
    }
    return Result.ok(result as T);
  }
};

class Ok<T, E> extends Result<T, E> {
  readonly _tag = 'Ok';

  constructor(public readonly value: T) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  getOk(): Option<T> {
    return Option.some(this.value);
  }

  getErr(): Option<E> {
    return Option.none();
  }

  getOr(defaultValue: T): T {
    return this.value;
  }

  getOrElse(fn: (error: E) => T): T {
    return this.value;
  }

  getErrOr(defaultError: E): E {
    return defaultError;
  }

  getErrOrElse(fn: (value: T) => E): E {
    return fn(this.value);
  }

  getOrNull(): T | null {
    return this.value;
  }

  getOrUndefined(): T | undefined {
    return this.value;
  }

  getOrThrow(): T {
    return this.value;
  }

  toOption(): Option<T> {
    return Option.some(this.value);
  }

  fold<U>(ifErr: (error: E) => U, ifOk: (value: T) => U): U {
    return ifOk(this.value);
  }

  match<U>(matcher: { ok: (value: T) => U; err: (error: E) => U; }): U {
    return matcher.ok(this.value);
  }

  extract<U>(transform: (value: T) => U): U | null {
    return transform(this.value);
  }

  extractErr<U>(transform: (error: E) => U): U | null {
    return null;
  }

  unpack(): [T | null, E | null] {
    return [this.value, null];
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return Result.ok(fn(this.value));
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return Result.ok(this.value);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }

  flatten<U>(this: Result<Result<U, E>, E>): Result<U, E> {
    return this.fold(
      (err) => Result.err(err),
      (res) => res
    );
  }

  filterOrElse(predicate: (value: T) => boolean, errorFn: (value: T) => E): Result<T, E> {
    if (predicate(this.value)) {
      return this;
    }
    return Result.err(errorFn(this.value));
  }

  swap(): Result<E, T> {
    return Result.err(this.value);
  }

  ap<U, V>(this: Result<(value: U) => V, E>, value: Result<U, E>): Result<V, E> {
    return this.fold(
      (err) => Result.err(err),
      (fn) => value.map(fn)
    );
  }

  zip<U>(other: Result<U, E>): Result<[T, U], E> {
    return this.fold(
      (err) => Result.err(err),
      (value) => other.fold(
        (err) => Result.err(err),
        (otherValue) => Result.ok([value, otherValue])
      )
    );
  }

  zipWith<U, V>(other: Result<U, E>, fn: (a: T, b: U) => V): Result<V, E> {
    return this.fold(
      (err) => Result.err(err),
      (value) => other.fold(
        (err) => Result.err(err),
        (otherValue) => Result.ok(fn(value, otherValue))
      )
    );
  }

  unzip<U, V>(this: Result<[U, V], E>): [Result<U, E>, Result<V, E>] {
    return this.fold(
      (err) => [Result.err(err), Result.err(err)],
      ([valueU, valueV]) => [Result.ok(valueU), Result.ok(valueV)]
    );
  }

  and<U>(alternative: Result<U, E>): Result<U, E> {
    return alternative;
  }

  or(alternative: Result<T, E>): Result<T, E> {
    return this;
  }

  orElse(alternativeFn: (error: E) => Result<T, E>): Result<T, E> {
    return this;
  }

  peek(fn: (value: T) => void): Result<T, E> {
    fn(this.value);
    return this;
  }

  peekErr(fn: (error: E) => void): Result<T, E> {
    return this;
  }

  peekBoth(fn: (both: [T | null, E | null]) => void): Result<T, E> {
    fn([this.value, null]);
    return this;
  }
}

class Err<T, E> extends Result<T, E> {
  readonly _tag = 'Err';

  constructor(public readonly error: E) {
    super();
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  getOk(): Option<T> {
    return Option.none();
  }

  getErr(): Option<E> {
    return Option.some(this.error);
  }

  getOr(defaultValue: T): T {
    return defaultValue;
  }

  getOrElse(fn: (error: E) => T): T {
    return fn(this.error);
  }

  getErrOr(defaultError: E): E {
    return this.error;
  }

  getErrOrElse(fn: (value: T) => E): E {
    return this.error;
  }
  
  getOrNull(): T | null {
    return null;
  }
  
  getOrUndefined(): T | undefined {
    return undefined;
  }
  
  getOrThrow(): T {
    throw this.error;
  }

  fold<U>(ifErr: (error: E) => U, ifOk: (value: T) => U): U {
    return ifErr(this.error);
  }

  match<U>(matcher: { ok: (value: T) => U; err: (error: E) => U; }): U {
    return matcher.err(this.error);
  }

  extract<U>(transform: (value: T) => U): U | null {
    return null;
  }

  extractErr<U>(transform: (error: E) => U): U | null {
    return transform(this.error);
  }

  unpack(): [T | null, E | null] {
    return [null, this.error];
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return Result.err(this.error);
  }
  
  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return Result.err(fn(this.error));
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return Result.err(this.error);
  }

  flatten<U>(this: Result<Result<U, E>, E>): Result<U, E> {
    return this as Result<U, E>;
  }

  filterOrElse(predicate: (value: T) => boolean, errorFn: (value: T) => E): Result<T, E> {
    return this;
  }

  swap(): Result<E, T> {
    return Result.ok(this.error);
  }

  ap<U, V>(this: Result<(value: U) => V, E>, value: Result<U, E>): Result<V, E> {
    return this.fold(
      (err) => Result.err(err),
      (fn) => value.map(fn)
    );
  }

  zip<U>(other: Result<U, E>): Result<[T, U], E> {
    return Result.err(this.error);
  }

  zipWith<U, V>(other: Result<U, E>, fn: (a: T, b: U) => V): Result<V, E> {
    return Result.err(this.error);
  }

  unzip<U, V>(this: Result<[U, V], E>): [Result<U, E>, Result<V, E>] {
    return this.fold(
      (err) => [Result.err(err), Result.err(err)],
      ([valueU, valueV]) => [Result.ok(valueU), Result.ok(valueV)]
    );
  }

  and<U>(alternative: Result<U, E>): Result<U, E> {
    return Result.err(this.error);
  }

  or(alternative: Result<T, E>): Result<T, E> {
    return alternative;
  }

  orElse(alternativeFn: (error: E) => Result<T, E>): Result<T, E> {
    return alternativeFn(this.error);
  }

  peek(fn: (value: T) => void): Result<T, E> {
    return this;
  }

  peekErr(fn: (error: E) => void): Result<T, E> {
    fn(this.error);
    return this;
  }

  peekBoth(fn: (both: [T | null, E | null]) => void): Result<T, E> {
    fn([null, this.error]);
    return this;
  }
}
