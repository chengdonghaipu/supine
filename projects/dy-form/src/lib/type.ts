export type ModelPartial<T> = {
  [P in keyof T]?: T[P];
};

export type BreakpointType = 'xm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

