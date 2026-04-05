export abstract class Option<T> {
  /**
   * A private property used for type branding to distinguish between Some and None at runtime. This property is not intended to be accessed directly and is only used for internal type checking purposes.
   */
  abstract readonly _tag: string;

  // ===========================
  // Transformers
  // ===========================
  /**
   * Transforms the value inside the Option if it exists, otherwise returns None.
   * @since 0.1.0
   * @param fn A function that transforms the value T into U.
   * @returns An Option containing the transformed value if this is a Some, or None if this is a None.
   */
  abstract map<U>(fn: (value: T) => U): Option<U>;

  /**
   * Transforms the value inside the Option using a function that returns another Option, effectively flattening the result.
   * @since 0.1.0
   * @param fn A function that transforms the value T into an Option of type U.
   * @returns The result of applying the function if this is a Some, or None if this is a None.
   */
  abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Flattens an Option of an Option into a single Option. If this is a Some containing another Some, it will return the inner Some. If this is a Some containing a None, it will return None. If this is a None, it will return None.
   * @since 0.1.0
   * @returns An Option containing the flattened value if this is a Some of a Some, or None otherwise.
   */
  abstract flatten<U>(this: Option<Option<U>>): Option<U>;

  /**
   * Returns None if the Option is a Some and the predicate returns false for the contained value, otherwise returns the original Option. If this is a None, it will return None regardless of the predicate.
   * @since 0.1.0
   * @param predicate A function that takes the value of type T and returns a boolean.
   * @returns The original Option if this is a Some and the predicate returns true, or None otherwise.
   */
  abstract filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Applies a function contained in an Option to the value contained in another Option. If both Options are Some, it will return a Some containing the result of applying the function to the value. If either Option is None, it will return None.
   * @since 0.1.0
   * @param this An Option containing a function that takes a value of type U and returns a value of type V.
   * @param value An Option containing a value of type U.
   * @returns An Option containing the result of applying the function if both Options are Some, or None otherwise.
   */
  abstract ap<U, V>(this: Option<(value: U) => V>, value: Option<U>): Option<V>;

  /**
   * Combines this Option with another Option. If both Options are Some, it will return a Some containing a tuple of both values. If either Option is None, it will return None.
   * @since 0.1.0
   * @param other Another Option to combine with this Option.
   * @returns An Option containing a tuple of both values if both are Some, or None otherwise.
   */
  abstract zip<U>(other: Option<U>): Option<[T, U]>;

  /**
   * Combines this Option with another Option using a provided function. If both Options are Some, it will return a Some containing the result of applying the function to both values. If either Option is None, it will return None.
   * @since 0.1.0
   * @param other Another Option to combine with this Option.
   * @param fn A function that takes the values of type T and U and returns a value of type V.
   * @returns An Option containing the result of applying the function if both are Some, or None otherwise.
   */
  abstract zipWith<U, V>(other: Option<U>, fn: (a: T, b: U) => V): Option<V>;

  /**
   * Unzips an Option containing a tuple into a tuple of Options. If this is a Some containing a tuple, it will return a tuple of Some values. If this is a None, it will return a tuple of None values.
   * @since 0.1.0
   * @returns A tuple of Options if this is a Some containing a tuple, or a tuple of None values if this is a None.
   */
  abstract unzip<U, V>(this: Option<[U, V]>): [Option<U>, Option<V>];

  /**
   * Returns None if this Option is a None, otherwise returns the alternative Option.
   * @since 0.1.0
   * @param alternative An alternative Option to return if this Option is None.
   * @returns The alternative Option if this Option is None, otherwise this Option.
   */
  abstract and<U>(alternative: Option<U>): Option<U>;

  /**
   * Returns this Option if it is a Some, otherwise returns the alternative Option.
   * @since 0.1.0
   * @param alternative An alternative Option to return if this Option is None.
   * @returns This Option if it is a Some, otherwise the alternative Option.
   */
  abstract or(alternative: Option<T>): Option<T>;

  /**
   * Returns this Option if it is a Some, otherwise returns the result of calling the alternative function to get an alternative Option.
   * @since 0.1.0
   * @param alternativeFn A function that returns an alternative Option to be used if this Option is None.
   * @returns This Option if it is a Some, otherwise the result of calling the alternative function.
   */
  abstract orElse(alternativeFn: () => Option<T>): Option<T>;

  /**
   * Returns Some if exactly one of this Option or the alternative Option is a Some, otherwise returns None.
   * @since 0.1.0
   * @param alternative An alternative Option to return if this Option is None or if both Options are Some.
   * @returns This Option if it is a Some and the alternative is None, the alternative Option if this Option is None and the alternative is a Some, or None if both Options are Some.
   */
  abstract xor(alternative: Option<T>): Option<T>;

  /**
   * Applies a function to the value inside the Option if it exists, without changing the structure of the Option. If this is a None, it will return None.
   * @since 0.1.0
   * @param fn A function that takes the value of type T and returns void.
   * @returns This Option if this is a Some, or None if this is a None.
   */
  abstract peek(fn: (value: T) => void): Option<T>;

  // ===========================
  // Selectors
  // ===========================
  /**
   * Folds the Option into a single value by applying one of two functions depending on whether this is a Some or a None. If this is a Some, it will apply the ifSome function to the contained value. If this is a None, it will apply the ifNone function.
   * @since 0.1.0
   * @param ifNone A function that returns a value of type U to be used if this Option is a None.
   * @param ifSome A function that takes the value of type T and returns a value of type U to be used if this Option is a Some.
   * @returns The result of applying the appropriate function based on whether this Option is a Some or a None.
   */
  abstract fold<U>(ifNone: () => U, ifSome: (value: T) => U): U;

  /**
   * Matches the Option by applying one of two functions depending on whether this is a Some or a None. If this is a Some, it will apply the some function to the contained value. If this is a None, it will apply the none function.
   * @since 0.1.0
   * @param matcher An object containing two functions: one for handling the None case and one for handling the Some case.
   * @returns The result of applying the appropriate function based on whether this Option is a Some or a None.
   */
  abstract match<U>(matcher: { none: () => U; some: (value: T) => U }): U;

  /**
   * Returns the contained value if this is a Some, otherwise returns null.
   * @since 0.1.0
   * @returns The contained value if this is a Some, or null if this is a None.
   */
  abstract getOrNull(): T | null;

  /**
   * Returns the contained value if this is a Some, otherwise returns undefined.
   * @since 0.1.0
   * @returns The contained value if this is a Some, or undefined if this is a None.
   */
  abstract getOrUndefined(): T | undefined;

  /**
   * Returns the contained value if this is a Some, otherwise returns the provided default value. If a transform function is provided, it will apply the transform to the contained value before returning it. If this is a None, it will return the default value regardless of the transform.
   * @since 0.1.0
   * @param defaultValue A value of type T to be returned if this Option is a None.
   * @returns The contained value if this is a Some, or the default value if this is a None.
   */
  abstract getOr(defaultValue: T): T;

  /**
   * Returns the contained value if this is a Some, otherwise returns the result of calling the provided default value function. If a transform function is provided, it will apply the transform to the contained value before returning it. If this is a None, it will return the result of calling the default value function regardless of the transform.
   * @since 0.1.0
   * @param defaultValueFn A function that returns a value of type T to be used as a default if this Option is a None.
   * @returns The contained value if this is a Some, or the result of calling the default value function if this is a None.
   */
  abstract getOrElse(defaultValueFn: () => T): T;

  /**
   * Returns the contained value if this is a Some, otherwise throws an error with the provided message. If a transform function is provided, it will apply the transform to the contained value before returning it. If this is a None, it will throw an error regardless of the transform.
   * @since 0.1.0
   * @param errorMessage An optional string to be used as the error message if this Option is a None.
   * @return The contained value if this is a Some, or throws an error if this is a None.
   */
  abstract getOrThrow(errorMessage?: string): T;

  /**
   * Checks if the contained value satisfies the given predicate. If this is a Some and the predicate returns true, it returns true. Otherwise, it returns false.
   * @since 0.1.0
   * @param predicate A function that takes the value of type T and returns a boolean indicating whether the value satisfies the condition.
   * @returns true if this is a Some and the predicate returns true for the contained value, false otherwise.
   */
  abstract has(predicate: (value: T) => boolean): boolean;

  /**
   * A convenience method that combines the functionality of map and getOrNull. It applies a transform function to the contained value if this is a Some, and returns the result. If this is a None, it returns null regardless of the transform.
   * @since 0.1.0
   * @param transform A function that takes the value of type T and returns a value of type U.
   * @returns The result of applying the transform function if this is a Some, or null if this is a None.
   */
  abstract extract<U>(transform: (value: T) => U): U | null;

  // ===========================
  // Type Guards
  // ===========================
  /**
   * Type guard that checks if this Option is a Some. If this method returns true, TypeScript will narrow the type of this Option to Some<T> within the scope of the check.
   * @since 0.1.0
   * @returns true if this Option is a Some, false otherwise.
   */
  abstract isSome(): this is Some<T>;

  /**
   * Type guard that checks if this Option is a None. If this method returns true, TypeScript will narrow the type of this Option to None within the scope of the check.
   * @since 0.1.0
   * @returns true if this Option is a None, false otherwise.
   */
  abstract isNone(): this is None;

  // ===========================
  // Constructors
  // ===========================
  /**
   * Creates a new Some instance with the provided value.
   * @since 0.1.0
   * @param value The value to be contained in the Some.
   * @returns A new Some instance containing the provided value.
   */
  static some<T>(value: T): Option<T> {
    return new Some(value);
  }
  
  /**
   * Returns a None instance. Since None is a singleton, this method always returns the same instance of None.
   * @since 0.1.0
   * @returns A None instance.
   */
  static none<T>(): Option<T> {
    return None.instance;
  }

  /**
   * An alias for the some constructor, provided for convenience. This method creates a new Some instance with the given value.
   * @since 0.1.0
   * @param value The value to be contained in the Some.
   * @returns A new Some instance containing the provided value.
   */
  static of<T>(value: T): Option<T> {
    return Option.some(value);
  }

  /**
   * Creates an Option from a value that may be null or undefined. If the value is null or undefined, it returns None. Otherwise, it returns Some containing the value.
   * @since 0.1.0
   * @param value The value to be converted into an Option.
   * @returns Some containing the value if it is not null or undefined, or None if it is null or undefined.
   */
  static fromNullable<T>(value: T | null | undefined): Option<T> {
    if (value === null || value === undefined) {
      return Option.none<T>();
    }
    return Option.some(value);
  }

  /**
   * Creates an Option from a value based on a predicate function. If the predicate returns true for the given value, it returns Some containing the value. Otherwise, it returns None.
   * @since 0.1.0
   * @param value The value to be evaluated by the predicate.
   * @param predicate A function that takes the value and returns a boolean indicating whether the value should be wrapped in a Some or not.
   * @returns Some containing the value if the predicate returns true, or None if the predicate returns false.
   */
  static fromPredicate<T>(value: T, predicate: (value: T) => boolean): Option<T> {
    if (predicate(value)) {
      return Option.some(value);
    }
    return Option.none<T>();
  }

  /**
   * Executes a function that may throw an error and returns an Option containing the result if the function executes successfully, or None if the function throws an error. This is useful for safely handling operations that may fail without having to use try-catch blocks directly in the code.
   * @since 0.1.0
   * @param fn A function that returns a value of type T and may throw an error.
   * @returns Some containing the result of the function if it executes successfully, or None if the function throws an error.
   */
  static tryCatch<T>(fn: () => T): Option<T> {
    try {
      return Option.some(fn());
    } catch {
      return Option.none<T>();
    }
  }

  /**
   * Collects a tuple of Options into an Option of a tuple. If all elements in the tuple are Some, it returns Some containing a tuple of the values. If any element is None, it returns None.
   * @since 0.1.0
   * @param tuple A tuple of Options to be collected.
   * @returns Some containing a tuple of values if all elements are Some, or None if any element is None.
   */
  static collectTuple<A, B>(tuple: [Option<A>, Option<B>]): Option<[A, B]> {
    const [a, b] = tuple;
    if (a.isSome() && b.isSome()) {
      return Option.some([a.value, b.value]);
    }
    return Option.none();
  }

  /**
   * Collects an array of Options into an Option of an array. If all elements in the array are Some, it returns Some containing an array of the values. If any element is None, it returns None.
   * @since 0.1.0
   * @param options An array of Options to be collected.
   * @returns Some containing an array of values if all elements are Some, or None if any element is None.
   */
  static collectArray<T>(options: Array<Option<T>>): Option<Array<T>> {
    const values: T[] = [];
    for (const option of options) {
      if (option.isNone()) {
        return Option.none();
      }

      if (option.isSome()) {
        values.push(option.value);
      }
    }
    return Option.some(values);
  }

  /**
   * Collects an object of Options into an Option of an object. If all properties in the object are Some, it returns Some containing an object with the values. If any property is None, it returns None.
   * @since 0.1.0
   * @param options An object of Options to be collected.
   * @returns Some containing an object with values if all properties are Some, or None if any property is None.
   */
  static collectObject<T extends Record<string, unknown>>(options: { [K in keyof T]: Option<T[K]> }): Option<T> {
    const result: Partial<T> = {};
    for (const key in options) {
      const option = options[key];
      if (option.isNone()) {
        return Option.none();
      }
      if (option.isSome()) {
        result[key] = option.value;
      }
    }
    return Option.some(result as T);
  }
}

class Some<T> extends Option<T> {
  readonly _tag = "Some";

  constructor(public readonly value: T) {
    super();
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None {
    return false;
  }

  getOr(defaultValue: T): T {
    return this.value;
  }

  getOrElse(defaultValueFn: () => T): T {
    return this.value;
  }
  getOrNull(): T | null {
    return this.value;
  }

  getOrUndefined(): T | undefined {
    return this.value;
  }

  getOrThrow(errorMessage?: string): T {
    return this.value;
  }

  has(predicate: (value: T) => boolean): boolean {
    return predicate(this.value);
  }

  fold<U>(ifNone: () => U, ifSome: (value: T) => U): U {
    return ifSome(this.value);
  }

  match<U>(matcher: { none: () => U; some: (value: T) => U }): U {
    return matcher.some(this.value);
  }

  extract<U>(transform: (value: T) => U): U | null {
    return transform(this.value);
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return Option.some(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  flatten<U>(this: Option<Option<U>>): Option<U> {
    return this.fold(
      () => Option.none<U>(),
      innerOption => innerOption
    );
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (predicate(this.value)) {
      return this;
    }
    return Option.none();
  }

  ap<U, V>(this: Option<(value: U) => V>, value: Option<U>): Option<V> {
    if (this.isSome() && value.isSome()) {
      return Option.some(this.value(value.value));
    }
    return Option.none();
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return this.zipWith(other, (a, b) => [a, b]);
  }

  zipWith<U, V>(other: Option<U>, fn: (a: T, b: U) => V): Option<V> {
    if (this.isSome() && other.isSome()) {
      return Option.some(fn(this.value, other.value));
    }
    return Option.none();
  }

  unzip<U, V>(this: Option<[U, V]>): [Option<U>, Option<V>] {
    return this.fold(
      () => [Option.none<U>(), Option.none<V>()],
      ([a, b]) => [Option.some(a), Option.some(b)],
    );
  }

  and<U>(alternative: Option<U>): Option<U> {
    return alternative;
  }

  or(alternative: Option<T>): Option<T> {
    return this;
  }

  orElse(alternativeFn: () => Option<T>): Option<T> {
    return this;
  }

  xor(alternative: Option<T>): Option<T> {
    if (alternative.isNone()) {
      return this;
    }
    return Option.none();
  }

  peek(fn: (value: T) => void): Option<T> {
    fn(this.value);
    return this;
  }
}

class None extends Option<never> {
  readonly _tag = "None";

  private static _instance: None | null = null;
  
  static get instance(): None {
    if (this._instance === null) {
      this._instance = new None();
    }
    return this._instance;
  }

  constructor() {
    super();
  }

  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  getOr(defaultValue: never): never {
    return defaultValue;
  }

  getOrElse(defaultValueFn: () => never): never {
    return defaultValueFn();
  }

  getOrNull(): null {
    return null;
  }

  getOrUndefined(): undefined {
    return undefined;
  }

  getOrThrow(errorMessage?: string): never {
    throw new Error(errorMessage ?? "Option is None");
  }

  has(predicate: (value: never) => boolean): boolean {
    return false;
  }

  fold<U>(ifNone: () => U, ifSome: (value: never) => U): U {
    return ifNone();
  }

  match<U>(matcher: { none: () => U; some: (value: never) => U }): U {
    return matcher.none();
  }

  extract<U>(transform: (value: never) => U): U | null {
    return null;
  }

  map<U>(fn: (value: never) => U): Option<U> {
    return this;
  }

  flatMap<U>(fn: (value: never) => Option<U>): Option<U> {
    return this;
  }

  flatten<U>(this: Option<Option<U>>): Option<U> {
    return Option.none<U>();
  }

  filter(predicate: (value: never) => boolean): Option<never> {
    return this;
  }

  ap<U, V>(this: Option<(value: U) => V>, value: Option<U>): Option<V> {
    return Option.none();
  }

  zip<U>(other: Option<U>): Option<[never, U]> {
    return this;
  }

  zipWith<U, V>(other: Option<U>, fn: (a: never, b: U) => V): Option<V> {
    return this;
  }

  unzip<U, V>(this: Option<[U, V]>): [Option<U>, Option<V>] {
    return [Option.none(), Option.none()];
  }

  and<U>(alternative: Option<U>): Option<U> {
    return this;
  }

  or(alternative: Option<never>): Option<never> {
    return alternative;
  }

  orElse(alternativeFn: () => Option<never>): Option<never> {
    return alternativeFn();
  }

  xor(alternative: Option<never>): Option<never> {
    if (alternative.isSome()) {
      return alternative;
    }
    return this;
  }

  peek(fn: (value: never) => void): Option<never> {
    return this;
  }
}
