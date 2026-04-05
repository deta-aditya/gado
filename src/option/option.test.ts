import { describe, expect, it, vi } from 'vitest';
import { Option } from './option';

describe('Option', () => {
  describe('constructors', () => {
    describe('some', () => {
      it('should create a Some instance with the given value', () => {
        const option = Option.some(42);
        expect(option.isSome()).toBe(true);
      });
    });

    describe('none', () => {
      it('should return a None instance', () => {
        const option = Option.none();
        expect(option.isNone()).toBe(true);
      });
    });

    describe('fromNullable', () => {
      it('should create a Some instance if the value is not null or undefined', () => {
        const option = Option.fromNullable('hello');
        expect(option.isSome()).toBe(true);
      });

      it('should return a None instance if the value is null', () => {
        const option = Option.fromNullable(null);
        expect(option.isNone()).toBe(true);
      });

      it('should return a None instance if the value is undefined', () => {
        const option = Option.fromNullable(undefined);
        expect(option.isNone()).toBe(true);
      });
    });

    describe('fromPredicate', () => {
      it('should create a Some instance if the value satisfies the predicate', () => {
        const option = Option.fromPredicate(42, x => x > 40);
        expect(option.isSome()).toBe(true);
      });

      it('should return a None instance if the value does not satisfy the predicate', () => {
        const option = Option.fromPredicate(42, x => x < 40);
        expect(option.isNone()).toBe(true);
      });
    });

    describe('tryCatch', () => {
      it('should create a Some instance if the function executes without throwing', () => {
        const option = Option.tryCatch(() => 42);
        expect(option.isSome()).toBe(true);
      });

      it('should return a None instance if the function throws an error', () => {
        const option = Option.tryCatch(() => { throw new Error('Test error'); });
        expect(option.isNone()).toBe(true);
      });
    });

    describe('collectTuple', () => {
      it('should create a Some instance containing a tuple of the results if all options are Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some('hello');
        const result = Option.collectTuple([optionA, optionB]);
        expect(result.isSome()).toBe(true);
        expect(result.getOr([0, ''])).toEqual([42, 'hello']);
      });

      it('should return a None instance if any of the options is a None', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<string>();
        const result = Option.collectTuple([optionA, optionB]);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('collectArray', () => {
      it('should create a Some instance containing an array of the results if all options are Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = Option.collectArray([optionA, optionB]);
        expect(result.isSome()).toBe(true);
        expect(result.getOr([])).toEqual([42, 10]);
      });

      it('should return a None instance if any of the options is a None', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<number>();
        const result = Option.collectArray([optionA, optionB]);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('collectObject', () => {
      it('should create a Some instance containing an object of the results if all options are Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some('hello');
        const result = Option.collectObject({ a: optionA, b: optionB });
        expect(result.isSome()).toBe(true);
        expect(result.getOr({ a: 0, b: '' })).toEqual({ a: 42, b: 'hello' });
      });

      it('should return a None instance if any of the options is a None', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<string>();
        const result = Option.collectObject({ a: optionA, b: optionB });
        expect(result.isNone()).toBe(true);
      });
    });
  });
  
  describe('type guards', () => {
    describe('isSome', () => {
      it('should return true for Some instances', () => {
        const option = Option.some(42);
        expect(option.isSome()).toBe(true);
      });

      it('should return false for None instances', () => {
        const option = Option.none();
        expect(option.isSome()).toBe(false);
      });

      it('should narrow the type to Some when isSome returns true', () => {
        const option: Option<number> = Option.some(42);
        if (option.isSome()) {
          expect(option.value).toBe(42);
        }
      });
    });

    describe('isNone', () => {
      it('should return true for None instances', () => {
        const option = Option.none();
        expect(option.isNone()).toBe(true);
      });

      it('should return false for Some instances', () => {
        const option = Option.some(42);
        expect(option.isNone()).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    describe('getOr', () => {
      it('should return the contained value if this is a Some', () => {
        const option = Option.some(42);
        expect(option.getOr(0)).toBe(42);
      });

      it('should return the default value if this is a None', () => {
        const option = Option.none<number>();
        expect(option.getOr(0)).toBe(0);
      });
    });

    describe('getOrElse', () => {
      it('should return the contained value if this is a Some', () => {
        const option = Option.some(42);
        expect(option.getOrElse(() => 0)).toBe(42);
      });

      it('should return the result of calling the default value function if this is a None', () => {
        const option = Option.none<number>();
        expect(option.getOrElse(() => 0)).toBe(0);
      });
    });

    describe('getOrNull', () => {
      it('should return the contained value if this is a Some', () => {
        const option = Option.some(42);
        expect(option.getOrNull()).toBe(42);
      });

      it('should return null if this is a None', () => {
        const option = Option.none<number>();
        expect(option.getOrNull()).toBeNull();
      });
    });

    describe('getOrUndefined', () => {
      it('should return the contained value if this is a Some', () => {
        const option = Option.some(42);
        expect(option.getOrUndefined()).toBe(42);
      });

      it('should return undefined if this is a None', () => {
        const option = Option.none<number>();
        expect(option.getOrUndefined()).toBeUndefined();
      });
    });

    describe('getOrThrow', () => {
      it('should return the contained value if this is a Some', () => {
        const option = Option.some(42);
        expect(option.getOrThrow()).toBe(42);
      });

      it('should throw an error if this is a None', () => {
        const option = Option.none<number>();
        expect(() => option.getOrThrow()).toThrow();
      });

      it('should throw an error with the provided message if this is a None', () => {
        const option = Option.none<number>();
        expect(() => option.getOrThrow('Custom error message')).toThrow('Custom error message');
      });
    });

    describe('has', () => {
      it('should return true if this is a Some and the contained value satisfies the predicate', () => {
        const option = Option.some(42);
        expect(option.has(x => x > 40)).toBe(true);
      });

      it('should return false if this is a Some but the contained value does not satisfy the predicate', () => {
        const option = Option.some(42);
        expect(option.has(x => x < 40)).toBe(false);
      });

      it('should return false if this is a None', () => {
        const option = Option.none<number>();
        expect(option.has(x => x > 40)).toBe(false);
      });
    });

    describe('fold', () => {
      it('should return the result of ifSome if this is a Some', () => {
        const option = Option.some(42);
        const result = option.fold(
          () => 'none',
          value => `some(${value})`
        );
        expect(result).toBe('some(42)');
      });

      it('should return the result of ifNone if this is a None', () => {
        const option = Option.none<number>();
        const result = option.fold(
          () => 'none',
          value => `some(${value})`
        );
        expect(result).toBe('none');
      });
    });

    describe('match', () => {
      it('should return the result of the some matcher if this is a Some', () => {
        const option = Option.some(42);
        const result = option.match({
          none: () => 'none',
          some: value => `some(${value})`
        });
        expect(result).toBe('some(42)');
      });

      it('should return the result of the none matcher if this is a None', () => {
        const option = Option.none<number>();
        const result = option.match({
          none: () => 'none',
          some: value => `some(${value})`
        });
        expect(result).toBe('none');
      });
    });

    describe('extract', () => {
      it('should return the result of applying the transform function if this is a Some', () => {
        const option = Option.some(42);
        const result = option.extract(value => `Value is ${value}`);
        expect(result).toBe('Value is 42');
      });

      it('should return null if this is a None', () => {
        const option = Option.none<number>();
        const result = option.extract(value => `Value is ${value}`);
        expect(result).toBeNull();
      });
    });
  });

  describe('transformers', () => {
    describe('map', () => {
      it('should apply the function to the contained value if this is a Some', () => {
        const option = Option.some(42);
        const result = option.map(x => x + 1);
        expect(result.getOr(0)).toBe(43);
      });

      it('should return a None if this is a None', () => {
        const option = Option.none<number>();
        const result = option.map(x => x + 1);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('flatMap', () => {
      it('should apply the function to the contained value and flatten the result if this is a Some', () => {
        const option = Option.some(42);
        const result = option.flatMap(x => Option.some(x + 1));
        expect(result.getOr(0)).toBe(43);
      });

      it('should return a None if this is a None', () => {
        const option = Option.none<number>();
        const result = option.flatMap(x => Option.some(x + 1));
        expect(result.isNone()).toBe(true);
      });
    });

    describe('flatten', () => {
      it('should flatten nested Some instances', () => {
        const option = Option.some(Option.some(42));
        const result = option.flatten();
        expect(result.getOr(0)).toBe(42);
      });

      it('should return a None if this is a None', () => {
        const option = Option.none<Option<number>>();
        const result = option.flatten();
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if this is a Some(None)', () => {
        const option = Option.some(Option.none<number>());
        const result = option.flatten();
        expect(result.isNone()).toBe(true);
      });
    });

    describe('filter', () => {
      it('should return this if the contained value satisfies the predicate', () => {
        const option = Option.some(42);
        const result = option.filter(x => x > 40);
        expect(result.getOr(0)).toBe(42);
      });

      it('should return a None if the contained value does not satisfy the predicate', () => {
        const option = Option.some(42);
        const result = option.filter(x => x < 40);
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if this is a None', () => {
        const option = Option.none<number>();
        const result = option.filter(x => x > 40);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('ap', () => {
      it('should apply the contained function to the contained value if both this and the argument are Some', () => {
        const optionFn = Option.some((x: number) => x + 1);
        const optionValue = Option.some(42);
        const result = optionFn.ap(optionValue);
        expect(result.getOr(0)).toBe(43);
      });

      it('should return a None if this is a None', () => {
        const optionFn = Option.none<(x: number) => number>();
        const optionValue = Option.some(42);
        const result = optionFn.ap(optionValue);
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if the argument is a None', () => {
        const optionFn = Option.some((x: number) => x + 1);
        const optionValue = Option.none<number>();
        const result = optionFn.ap(optionValue);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('zip', () => {
      it('should combine the values of two Some instances into a tuple', () => {
        const optionA = Option.some(42);
        const optionB = Option.some('hello');
        const result = optionA.zip(optionB);
        expect(result.getOr([0, ''])).toEqual([42, 'hello']);
      });

      it('should return a None if this is a None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some('hello');
        const result = optionA.zip(optionB);
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if the argument is a None', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<string>();
        const result = optionA.zip(optionB);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('zipWith', () => {
      it('should combine the values of two Some instances using the provided function', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = optionA.zipWith(optionB, (a, b) => a + b);
        expect(result.getOr(0)).toBe(52);
      });

      it('should return a None if this is a None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some(10);
        const result = optionA.zipWith(optionB, (a, b) => a + b);
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if the argument is a None', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<number>();
        const result = optionA.zipWith(optionB, (a, b) => a + b);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('unzip', () => {
      it('should split a Some containing a tuple into a tuple of Some instances', () => {
        const option = Option.some<[number, string]>([42, 'hello']);
        const result = option.unzip();
        expect(result).toEqual([Option.some(42), Option.some('hello')]);
      });

      it('should return a tuple of None if this is a None', () => {
        const option = Option.none<[number, string]>();
        const result = option.unzip();
        expect(result).toEqual([Option.none(), Option.none()]);
      });
    });

    describe('and', () => {
      it('should return the alternative if this is a Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = optionA.and(optionB);
        expect(result.getOr(0)).toBe(10);
      });

      it('should return the None if this is a None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some(10);
        const result = optionA.and(optionB);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('or', () => {
      it('should return this if this is a Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = optionA.or(optionB);
        expect(result.getOr(0)).toBe(42);
      });

      it('should return the alternative if this is a None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some(10);
        const result = optionA.or(optionB);
        expect(result.getOr(0)).toBe(10);
      });
    });

    describe('orElse', () => {
      it('should return this if this is a Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = optionA.orElse(() => optionB);
        expect(result.getOr(0)).toBe(42);
      });

      it('should return the result of calling the alternative function if this is a None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some(10);
        const result = optionA.orElse(() => optionB);
        expect(result.getOr(0)).toBe(10);
      });
    });

    describe('xor', () => {
      it('should return this if exactly one of this and the alternative is a Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.none<number>();
        const result = optionA.xor(optionB);
        expect(result.getOr(0)).toBe(42);
      });
      
      it('should return the alternative if exactly one of this and the alternative is a Some', () => {
        const optionA = Option.none<number>();
        const optionB = Option.some(10);
        const result = optionA.xor(optionB);
        expect(result.getOr(0)).toBe(10);
      });

      it('should return a None if both this and the alternative are Some', () => {
        const optionA = Option.some(42);
        const optionB = Option.some(10);
        const result = optionA.xor(optionB);
        expect(result.isNone()).toBe(true);
      });

      it('should return a None if both this and the alternative are None', () => {
        const optionA = Option.none<number>();
        const optionB = Option.none<number>();
        const result = optionA.xor(optionB);
        expect(result.isNone()).toBe(true);
      });
    });

    describe('peek', () => {
      it('should call the provided function with the contained value if this is a Some', () => {
        const option = Option.some(42);
        const mockFn = vi.fn();
        option.peek(mockFn);
        expect(mockFn).toHaveBeenCalledWith(42);
      });

      it('should not call the provided function if this is a None', () => {
        const option = Option.none<number>();
        const mockFn = vi.fn();
        option.peek(mockFn);
        expect(mockFn).not.toHaveBeenCalled();
      });
    });
  });
});
