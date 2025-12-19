/**
 * This is a simple wrapper around `react-hooks-form` to allow render a context provider around
 * each individual form so that e.g. the `Field` component can access form functionality for that
 * specific form
 */

import { forwardRef } from 'react';

import { FormStateProvider } from './use-form-state';

import type { useForm } from './use-form';
import type { ForwardedRef, HTMLProps, PropsWithChildren } from 'react';

import { cn } from '~/ui/lib/utils';

type FormProps = PropsWithChildren<
  Omit<HTMLProps<HTMLFormElement>, 'id' | 'form' | 'onSubmit'> & {
    form: ReturnType<typeof useForm>;
  }
>;

const Form = forwardRef(function Form(
  { form, children, className, ...props }: FormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const { submit, id } = form;
  return (
    <FormStateProvider form={form}>
      <form
        {...props}
        className={cn('flex flex-col w-full', className)}
        ref={ref}
        id={id}
        onSubmit={submit}
        noValidate
      >
        {children}
      </form>
    </FormStateProvider>
  );
});

export { Form };
