export type EmptyRecord = Record<string | number | symbol, never>
export type ValueOf<T> = T[keyof T]

export type NonEmptyRecord<Params> = Params extends EmptyRecord
  ? undefined
  : { [Key in keyof Params]: Params[Key] } // Mapped type is used to simplify the output (cleaner autocomplete)

export type Split<
  Value extends string,
  Separator extends string,
> = Value extends `${infer Head}${Separator}${infer Tail}`
  ? [Head, ...Split<Tail, Separator>]
  : Value extends Separator
    ? []
    : [Value]
