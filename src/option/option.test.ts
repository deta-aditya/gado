import { describe, expect, it } from 'vitest';
import { Option } from './option';

describe('Option', () => {
  describe('some', () => {
    it('should create a Some instance with the given value', () => {
      const option = Option.some(42);
      expect(option.isSome()).toBe(true);
    });
  });

  describe('none', () => {
    it('should create a None instance', () => {
      const option = Option.none();
      expect(option.isNone()).toBe(true);
    });
  });
});
