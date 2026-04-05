import { describe, expect, it, vi } from "vitest";
import { Result } from "./result";
import { Option } from "../option";

describe('Result', () => {
  describe('constructors', () => {
    describe('ok', () => {
      it('should create an Ok result with the given value', () => {
        const result = Result.ok(42);
        expect(result.isOk()).toBe(true);
      });
    });

    describe('err', () => {
      it('should create an Err result with the given error', () => {
        const result = Result.err('Something went wrong');
        expect(result.isErr()).toBe(true);
      });
    });

    describe('fromNullable', () => {
      it('should create an Ok result if the value is not null or undefined', () => {
        const result = Result.fromNullable(42, () => 'Value is null or undefined');
        expect(result.isOk()).toBe(true);
      });

      it('should create an Err result if the value is null', () => {
        const result = Result.fromNullable(null, () => 'Value is null or undefined');
        expect(result.isErr()).toBe(true);
      });
    });

    describe('fromOption', () => {
      it('should create an Ok result if the option is Some', () => {
        const option = Option.some(42);
        const result = Result.fromOption(option, () => 'Option is None');
        expect(result.isOk()).toBe(true);
      });

      it('should create an Err result if the option is None', () => {
        const option = Option.none();
        const result = Result.fromOption(option, () => 'Option is None');
        expect(result.isErr()).toBe(true);
      });
    });

    describe('fromPredicate', () => {
      it('should create an Ok result if the predicate returns true', () => {
        const result = Result.fromPredicate(42, x => x > 40, x => `Value ${x} is too small`);
        expect(result.isOk()).toBe(true);
      });

      it('should create an Err result if the predicate returns false', () => {
        const result = Result.fromPredicate(30, x => x > 40, x => `Value ${x} is too small`);
        expect(result.isErr()).toBe(true);
      });
    });

    describe('tryCatch', () => {
      it('should create an Ok result if the function executes successfully', () => {
        const result = Result.tryCatch(() => JSON.parse('{"valid": true}'));
        expect(result.isOk()).toBe(true);
      });

      it('should create an Err result if the function throws an error', () => {
        const result = Result.tryCatch(() => JSON.parse('invalid json'));
        expect(result.isErr()).toBe(true);
      });
    });

    describe('collectTuple', () => {
      it('should collect Ok results into a tuple', () => {
        const result1 = Result.ok(1);
        const result2 = Result.ok('hello');
        const collected = Result.collectTuple([result1, result2]);
        expect(collected.isOk()).toBe(true);
        expect(collected.getOrNull()).toEqual([1, 'hello']);
      });

      it('should return an Err if any result is an Err', () => {
        const result1 = Result.ok(1);
        const result2 = Result.err('Something went wrong');
        const collected = Result.collectTuple([result1, result2]);
        expect(collected.isErr()).toBe(true);
        expect(collected.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('collectArray', () => {
      it('should collect Ok results into an array', () => {
        const results = [Result.ok(1), Result.ok(2), Result.ok(3)];
        const collected = Result.collectArray(results);
        expect(collected.isOk()).toBe(true);
        expect(collected.getOrNull()).toEqual([1, 2, 3]);
      });

      it('should return an Err if any result is an Err', () => {
        const results = [Result.ok(1), Result.err('Something went wrong'), Result.ok(3)];
        const collected = Result.collectArray(results);
        expect(collected.isErr()).toBe(true);
        expect(collected.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('collectObject', () => {
      it('should collect Ok results into an object', () => {
        const results = {
          a: Result.ok(1),
          b: Result.ok('hello'),
          c: Result.ok(true)
        };
        const collected = Result.collectObject(results);
        expect(collected.isOk()).toBe(true);
        expect(collected.getOrNull()).toEqual({ a: 1, b: 'hello', c: true });
      });

      it('should return an Err if any result is an Err', () => {
        const results = {
          a: Result.ok(1),
          b: Result.err('Something went wrong'),
          c: Result.ok(true)
        };
        const collected = Result.collectObject(results);
        expect(collected.isErr()).toBe(true);
        expect(collected.getErr().getOrNull()).toBe('Something went wrong');
      });
    });
  });

  describe('type guards', () => {
    describe('isOk', () => {
      it('should return true for Ok results', () => {
        const result = Result.ok(42);
        expect(result.isOk()).toBe(true);
      });

      it('should return false for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.isOk()).toBe(false);
      });

      it('should narrow the type to Ok when isOk returns true', () => {
        const result = Result.ok(42);
        if (result.isOk()) {
          expect(result.value).toBe(42);
        }
      });
    });

    describe('isErr', () => {
      it('should return true for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.isErr()).toBe(true);
      });

      it('should return false for Ok results', () => {
        const result = Result.ok(42);
        expect(result.isErr()).toBe(false);
      });

      it('should narrow the type to Err when isErr returns true', () => {
        const result = Result.err('Something went wrong');
        if (result.isErr()) {
          expect(result.error).toBe('Something went wrong');
        }
      });
    });
  });

  describe('selectors', () => {
    describe('getOk', () => {
      it('should return the value wrapped with Option for Ok results', () => {
        const result = Result.ok(42);
        const option = result.getOk();
        expect(option.isSome()).toBe(true);
        expect(option.getOrNull()).toBe(42);
      });

      it('should return None for Err results', () => {
        const result = Result.err('Something went wrong');
        const option = result.getOk();
        expect(option.isNone()).toBe(true);
      });
    });

    describe('getErr', () => {
      it('should return the error wrapped with Option for Err results', () => {
        const result = Result.err('Something went wrong');
        const option = result.getErr();
        expect(option.isSome()).toBe(true);
        expect(option.getOrNull()).toBe('Something went wrong');
      });

      it('should return None for Ok results', () => {
        const result = Result.ok(42);
        const option = result.getErr();
        expect(option.isNone()).toBe(true);
      });
    });

    describe('getOr', () => {
      it('should return the value for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getOr(0)).toBe(42);
      });

      it('should return the default value for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getOr(0)).toBe(0);
      });
    });

    describe('getOrElse', () => {
      it('should return the value for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getOrElse(() => 0)).toBe(42);
      });

      it('should return the default value from the function for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getOrElse(() => 0)).toBe(0);
      });
    });

    describe('getErrOr', () => {
      it('should return the error for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getErrOr('No error')).toBe('Something went wrong');
      });

      it('should return the default error for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getErrOr('No error')).toBe('No error');
      });
    });

    describe('getErrOrElse', () => {
      it('should return the error for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getErrOrElse(() => 'No error')).toBe('Something went wrong');
      });

      it('should return the default error from the function for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getErrOrElse(() => 'No error')).toBe('No error');
      });
    });

    describe('getOrNull', () => {
      it('should return the value for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getOrNull()).toBe(42);
      });

      it('should return null for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getOrNull()).toBeNull();
      });
    });

    describe('getOrUndefined', () => {
      it('should return the value for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getOrUndefined()).toBe(42);
      });

      it('should return undefined for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(result.getOrUndefined()).toBeUndefined();
      });
    });

    describe('getOrThrow', () => {
      it('should return the value for Ok results', () => {
        const result = Result.ok(42);
        expect(result.getOrThrow()).toBe(42);
      });

      it('should throw an error for Err results', () => {
        const result = Result.err('Something went wrong');
        expect(() => result.getOrThrow()).toThrow('Something went wrong');
      });
    });

    describe('fold', () => {
      it('should apply the ifOk function for Ok results', () => {
        const result = Result.ok(42);
        const folded = result.fold(
          err => `Error: ${err}`,
          ok => `Value: ${ok}`
        );
        expect(folded).toBe('Value: 42');
      });
      
      it('should apply the ifErr function for Err results', () => {
        const result = Result.err('Something went wrong');
        const folded = result.fold(
          err => `Error: ${err}`,
          ok => `Value: ${ok}`
        );
        expect(folded).toBe('Error: Something went wrong');
      });
    });

    describe('match', () => {
      it('should apply the some function for Ok results', () => {
        const result = Result.ok(42);
        const matched = result.match({
          err: err => `Error: ${err}`,
          ok: ok => `Value: ${ok}`
        });
        expect(matched).toBe('Value: 42');
      });
      
      it('should apply the none function for Err results', () => {
        const result = Result.err('Something went wrong');
        const matched = result.match({
          err: err => `Error: ${err}`,
          ok: ok => `Value: ${ok}`
        });
        expect(matched).toBe('Error: Something went wrong');
      });
    });

    describe('extract', () => {
      it('should return the transformed value for Ok results', () => {
        const result = Result.ok(42);
        const extracted = result.extract(x => x * 2);
        expect(extracted).toBe(84);
      });

      it('should return null for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const extracted = result.extract(x => x * 2);
        expect(extracted).toBeNull();
      });
    });

    describe('extractErr', () => {
      it('should return the transformed error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const extracted = result.extractErr(err => `Error: ${err}`);
        expect(extracted).toBe('Error: Something went wrong');
      });

      it('should return null for Ok results', () => {
        const result = Result.ok(42);
        const extracted = result.extractErr(err => `Error: ${err}`);
        expect(extracted).toBeNull();
      });
    });

    describe('unpack', () => {
      it('should return the tuple for Ok results', () => {
        const result = Result.ok(42);
        const [value, error] = result.unpack();
        expect(value).toBe(42);
        expect(error).toBeNull();
      });

      it('should return the tuple for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const [value, error] = result.unpack();
        expect(value).toBeNull();
        expect(error).toBe('Something went wrong');
      });
    });
  });

  describe('transformers', () => {
    describe('map', () => {
      it('should transform the value for Ok results', () => {
        const result = Result.ok(42);
        const mapped = result.map(x => x * 2);
        expect(mapped.isOk()).toBe(true);
        expect(mapped.getOrNull()).toBe(84);
      });

      it('should not transform the error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const mapped = result.map(x => x * 2);
        expect(mapped.isErr()).toBe(true);
        expect(mapped.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('mapErr', () => {
      it('should transform the error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const mapped = result.mapErr(err => `Error: ${err}`);
        expect(mapped.isErr()).toBe(true);
        expect(mapped.getErr().getOrNull()).toBe('Error: Something went wrong');
      });

      it('should not transform the value for Ok results', () => {
        const result = Result.ok(42);
        const mapped = result.mapErr(err => `Error: ${err}`);
        expect(mapped.isOk()).toBe(true);
        expect(mapped.getOrNull()).toBe(42);
      });
    });

    describe('flatMap', () => {
      it('should transform the value for Ok results', () => {
        const result = Result.ok(42);
        const flatMapped = result.flatMap(x => Result.ok(x * 2));
        expect(flatMapped.isOk()).toBe(true);
        expect(flatMapped.getOrNull()).toBe(84);
      });

      it('should not transform the error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const flatMapped = result.flatMap(x => Result.ok(x * 2));
        expect(flatMapped.isErr()).toBe(true);
        expect(flatMapped.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('flatten', () => {
      it('should flatten nested Ok results', () => {
        const result = Result.ok(Result.ok(42));
        const flattened = result.flatten();
        expect(flattened.isOk()).toBe(true);
        expect(flattened.getOrNull()).toBe(42);
      });

      it('should return a Err if this is an Err', () => {
        const result = Result.err<Result<string, string>, string>('Something went wrong');
        const flattened = result.flatten();
        expect(flattened.isErr()).toBe(true);
      });

      it('should return a Err if this is an Ok(Err)', () => {
        const result = Result.ok(Result.err('Something went wrong'));
        const flattened = result.flatten();
        expect(flattened.isErr()).toBe(true);
        expect(flattened.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('filterOrElse', () => {
      it('should return the original Ok result if the predicate returns true', () => {
        const result = Result.ok(42);
        const filtered = result.filterOrElse(x => x > 40, x => `Value ${x} is too small`);
        expect(filtered.isOk()).toBe(true);
        expect(filtered.getOrNull()).toBe(42);
      });

      it('should return an Err result if the predicate returns false', () => {
        const result = Result.ok(30);
        const filtered = result.filterOrElse(x => x > 40, x => `Value ${x} is too small`);
        expect(filtered.isErr()).toBe(true);
        expect(filtered.getErr().getOrNull()).toBe('Value 30 is too small');
      });
    });

    describe('swap', () => {
      it('should swap Ok to Err', () => {
        const okResult = Result.ok(42);
        const swapped = okResult.swap();
        expect(swapped.isErr()).toBe(true);
        expect(swapped.getErr().getOrNull()).toBe(42);
      });

      it('should swap Err to Ok', () => {
        const errResult = Result.err('Something went wrong');
        const swapped = errResult.swap();
        expect(swapped.isOk()).toBe(true);
        expect(swapped.getOrNull()).toBe('Something went wrong');
      });
    });

    describe('ap', () => {
      it('should apply the function in an Ok result to the value in another Ok result', () => {
        const fnResult = Result.ok((x: number) => x * 2);
        const valueResult = Result.ok(42);
        const applied = fnResult.ap(valueResult);
        expect(applied.isOk()).toBe(true);
        expect(applied.getOrNull()).toBe(84);
      });

      it('should return an Err if the function result is an Err', () => {
        const fnResult = Result.err<(x: number) => number, string>('Function error');
        const valueResult = Result.ok<number, string>(42);
        const applied = fnResult.ap(valueResult);
        expect(applied.isErr()).toBe(true);
        expect(applied.getErr().getOrNull()).toBe('Function error');
      });

      it('should return an Err if the value result is an Err', () => {
        const fnResult = Result.ok((x: number) => x * 2);
        const valueResult = Result.err<number, string>('Value error');
        const applied = fnResult.ap(valueResult);
        expect(applied.isErr()).toBe(true);
        expect(applied.getErr().getOrNull()).toBe('Value error');
      });
    });

    describe('zip', () => {
      it('should combine two Ok results into a tuple', () => {
        const result1 = Result.ok(1);
        const result2 = Result.ok('hello');
        const zipped = result1.zip(result2);
        expect(zipped.isOk()).toBe(true);
        expect(zipped.getOrNull()).toEqual([1, 'hello']);
      });

      it('should return an Err if this is an Err', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.ok<string, string>('hello');
        const zipped = result1.zip(result2);
        expect(zipped.isErr()).toBe(true);
        expect(zipped.getErr().getOrNull()).toBe('First error');
      });

      it('should return an Err if the other result is an Err', () => {
        const result1 = Result.ok(1);
        const result2 = Result.err<string, string>('Second error');
        const zipped = result1.zip(result2);
        expect(zipped.isErr()).toBe(true);
        expect(zipped.getErr().getOrNull()).toBe('Second error');
      });
    });

    describe('zipWith', () => {
      it('should combine two Ok results using the provided function', () => {
        const result1 = Result.ok(1);
        const result2 = Result.ok(2);
        const zipped = result1.zipWith(result2, (a, b) => a + b);
        expect(zipped.isOk()).toBe(true);
        expect(zipped.getOrNull()).toBe(3);
      });

      it('should return an Err if this is an Err', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.ok<number, string>(2);
        const zipped = result1.zipWith(result2, (a, b) => a + b);
        expect(zipped.isErr()).toBe(true);
        expect(zipped.getErr().getOrNull()).toBe('First error');
      });

      it('should return an Err if the other result is an Err', () => {
        const result1 = Result.ok(1);
        const result2 = Result.err<number, string>('Second error');
        const zipped = result1.zipWith(result2, (a, b) => a + b);
        expect(zipped.isErr()).toBe(true);
        expect(zipped.getErr().getOrNull()).toBe('Second error');
      });
    });

    describe('unzip', () => {
      it('should unzip an Ok result containing a tuple into a tuple of Ok results', () => {
        const result = Result.ok<[number, string], string>([1, 'hello']);
        const [result1, result2] = result.unzip();
        expect(result1.isOk()).toBe(true);
        expect(result1.getOrNull()).toBe(1);
        expect(result2.isOk()).toBe(true);
        expect(result2.getOrNull()).toBe('hello');
      });

      it('should return Err results if this is an Err', () => {
        const result = Result.err<[number, string], string>('Something went wrong');
        const [result1, result2] = result.unzip();
        expect(result1.isErr()).toBe(true);
        expect(result1.getErr().getOrNull()).toBe('Something went wrong');
        expect(result2.isErr()).toBe(true);
        expect(result2.getErr().getOrNull()).toBe('Something went wrong');
      });
    });

    describe('and', () => {
      it('should return the alternative result if this is an Ok', () => {
        const result1 = Result.ok(42);
        const result2 = Result.ok(100);
        const anded = result1.and(result2);
        expect(anded.isOk()).toBe(true);
        expect(anded.getOrNull()).toBe(100);
      });

      it('should return this Err if this is an Err', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.ok<number, string>(100);
        const anded = result1.and(result2);
        expect(anded.isErr()).toBe(true);
        expect(anded.getErr().getOrNull()).toBe('First error');
      });

      it('should return the alternative Err if this is an Ok and the alternative is an Err', () => {
        const result1 = Result.ok(42);
        const result2 = Result.err<number, string>('Second error');
        const anded = result1.and(result2);
        expect(anded.isErr()).toBe(true);
        expect(anded.getErr().getOrNull()).toBe('Second error');
      });
    });

    describe('or', () => {
      it('should return this Ok if this is an Ok', () => {
        const result1 = Result.ok(42);
        const result2 = Result.ok(100);
        const ored = result1.or(result2);
        expect(ored.isOk()).toBe(true);
        expect(ored.getOrNull()).toBe(42);
      });

      it('should return the alternative Ok if this is an Err', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.ok<number, string>(100);
        const ored = result1.or(result2);
        expect(ored.isOk()).toBe(true);
        expect(ored.getOrNull()).toBe(100);
      });

      it('should return the alternative Err if both this and the alternative are Errs', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.err<number, string>('Second error');
        const ored = result1.or(result2);
        expect(ored.isErr()).toBe(true);
        expect(ored.getErr().getOrNull()).toBe('Second error');
      });
    });

    describe('orElse', () => {
      it('should return this Ok if this is an Ok', () => {
        const result1 = Result.ok(42);
        const result2 = Result.ok(100);
        const orElseed = result1.orElse(() => result2);
        expect(orElseed.isOk()).toBe(true);
        expect(orElseed.getOrNull()).toBe(42);
      });

      it('should return the alternative Ok if this is an Err', () => {
        const result1 = Result.err<number, string>('First error');
        const result2 = Result.ok<number, string>(100);
        const orElseed = result1.orElse(() => result2);
        expect(orElseed.isOk()).toBe(true);
        expect(orElseed.getOrNull()).toBe(100);
      });

      it('should return the alternative Err if both this and the alternative are Errs', () => {
        const result = Result.err<number, string>('First error');
        const orElseed = result.orElse((err) => Result.err(`Alternative error: ${err}`));
        expect(orElseed.isErr()).toBe(true);
        expect(orElseed.getErr().getOrNull()).toBe('Alternative error: First error');
      });
    });

    describe('peek', () => {
      it('should call the provided function with the value for Ok results', () => {
        const result = Result.ok(42);
        const mockFn = vi.fn();
        result.peek(mockFn);
        expect(mockFn).toHaveBeenCalledWith(42);
      });

      it('should not call the provided function for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const mockFn = vi.fn();
        result.peek(mockFn);
        expect(mockFn).not.toHaveBeenCalled();
      });
    });

    describe('peekErr', () => {
      it('should call the provided function with the error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const mockFn = vi.fn();
        result.peekErr(mockFn);
        expect(mockFn).toHaveBeenCalledWith('Something went wrong');
      });

      it('should not call the provided function for Ok results', () => {
        const result = Result.ok(42);
        const mockFn = vi.fn();
        result.peekErr(mockFn);
        expect(mockFn).not.toHaveBeenCalled();
      });
    });

    describe('peekBoth', () => {
      it('should call the provided function with the value for Ok results', () => {
        const result = Result.ok(42);
        const mockFn = vi.fn();
        result.peekBoth(mockFn);
        expect(mockFn).toHaveBeenCalledWith([42, null]);
      });

      it('should call the provided function with the error for Err results', () => {
        const result = Result.err<number, string>('Something went wrong');
        const mockFn = vi.fn();
        result.peekBoth(mockFn);
        expect(mockFn).toHaveBeenCalledWith([null, 'Something went wrong']);
      });
    });
  });
});
