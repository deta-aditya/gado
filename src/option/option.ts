export abstract class Option<T> {
  abstract isSome(): this is Some<T>;
  abstract isNone(): this is None<T>;

  static some<T>(value: T): Option<T> {
    return new Some(value);
  }
  
  static none<T>(): Option<T> {
    return new None();
  }
}

export class Some<T> extends Option<T> {
  constructor(public readonly value: T) {
    super();
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None<T> {
    return false;
  }
}

export class None<T> extends Option<T> {
  constructor() {
    super();
  }

  isSome(): this is Some<T> {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }
}
