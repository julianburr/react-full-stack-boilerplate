import { WarningCircleIcon } from '@phosphor-icons/react';
import { useCallback, useId, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { mergeRefs } from 'react-merge-refs';

import { Label } from './label';
import { useFormState } from './use-form-state';

import type { ComponentType, ReactNode, Ref, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import type { ErrorOption, FieldError } from 'react-hook-form';

import { P } from '~/components/text';
import { cn } from '~/ui/lib/utils';

type FieldPassthroughProps = {
  id?: string;
  ref?: Ref<any>;
  onChange?: (e: ChangeEvent) => void;
  onBlur?: (e: ChangeEvent) => void;
  name?: string;
  value?: any;
  setValue?: (value: any, args?: any) => void;
  error?: FieldError;
  setError?: (error: ErrorOption, options?: any) => void;
  clearError?: () => void;
  disabled?: boolean;
  placeholder?: string;
};

type ValidateFn<Value = any> = (value: Value) => boolean | string;
type Validate<Value = any> = ValidateFn<Value> | { [key: string]: ValidateFn<Value> };

type FakeEvent = {
  target: {
    value: any;
  };
};

type Props<InputComponent extends ComponentType<FieldPassthroughProps>> = {
  ref?: Ref<any>;
  name: string;
  label?: ReactNode;
  labelAction?: ReactNode;
  description?: ReactNode;
  Input: InputComponent;
  // The input props type is inferred from the passed in input components, removing the
  // props the field component passes through, but allowing for optional `onChange`
  // and `onBlur` props, which will get merged with the form event handlers
  inputProps?: Omit<ComponentPropsWithoutRef<InputComponent>, keyof FieldPassthroughProps> & {
    onChange?: FieldPassthroughProps['onChange'];
    onBlur?: FieldPassthroughProps['onBlur'];
    ref?: any;
  };
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: Validate;
  onChange?: (e: FakeEvent) => void;
  placeholder?: string;
  className?: string;
};

export function Field<T extends ComponentType<FieldPassthroughProps>>({
  ref,
  name,
  label,
  labelAction,
  description,
  Input,
  inputProps,
  required,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  validate,
  onChange,
  disabled,
  placeholder,
  className,
  ...props
}: Props<T>) {
  const id = useId();
  const formState = useFormState<any>();

  const setValue = useCallback(
    (value: any, args: any = {}) => {
      onChange?.({
        target: {
          value,
        },
      });
      formState.setValue?.(name, value, { shouldDirty: true, shouldTouch: true, ...args });
    },
    [name, onChange, formState],
  );

  const setError = useCallback(
    (error: any, options: any) => formState.setError?.(name, error, options),
    [name, formState],
  );

  const clearError = useCallback(() => formState.clearErrors(name), [formState, name]);

  const InputComponent = Input as ComponentType<FieldPassthroughProps>;

  // We want to take advantage of native browser input validation (e.g. for input types like `email`, `url`
  // etc.), but we want to be able to control when that validation triggers + make sure the UI behaves the same
  // for custom and native validations and errors, so we disable native validation on the form element and
  // trigger it manually here if we have a valid ref
  const inputRef = useRef<any>(null);
  const mergeValidate = useMemo(
    () => ({
      native: () => {
        // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript
        return inputRef.current?.checkValidity
          ? inputRef.current.checkValidity() || inputRef.current.validationMessage
          : true;
      },
      ...(typeof validate === 'function' ? { other: validate } : { ...validate }),
    }),
    [validate],
  );

  return (
    <div className={cn('flex flex-col gap-[2px] w-full', className)} {...props}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {description && (
        <P size="xs" className="m-[2px]">
          {description}
        </P>
      )}
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <>
            <InputComponent
              {...field}
              id={id}
              ref={mergeRefs([ref, field.ref])}
              value={field.value}
              setValue={setValue}
              error={fieldState.error}
              setError={setError}
              clearError={clearError}
              disabled={disabled}
              placeholder={placeholder}
              {...inputProps}
            />
            {fieldState.error && (
              <span className="flex items-center gap-1 text-[#bb6262] text-[10px] font-semibold px-1">
                <WarningCircleIcon className="h-[12px] w-[12px]" />
                {fieldState.error.message
                  ? fieldState.error.message
                  : fieldState.error.type === 'required'
                    ? 'This field is required'
                    : 'Validation failed.'}
              </span>
            )}
          </>
        )}
        control={formState.control}
        rules={{
          required,
          min,
          max,
          minLength,
          maxLength,
          pattern,
          validate: mergeValidate,
        }}
      />
    </div>
  );
}
