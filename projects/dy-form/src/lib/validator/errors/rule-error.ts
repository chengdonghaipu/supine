export class RuleError extends Error {
  name = 'RuleError';
  constructor(message?: string) {
    super(message);
  }
}
