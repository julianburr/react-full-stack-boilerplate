/**
 * This is a simple wrapper around `react-hooks-form` to allow render a context provider around
 * each individual form so that e.g. the `Field` component can access form functionality for that
 * specific form
 */

import { forwardRef } from 'react';

import { FormStateProvider } from './use-form-state';

import type { useForm } from './use-form';
import type { ForwardedRef, HTMLProps, PropsWithChildren } from 'react';

type FormProps = PropsWithChildren<
  Omit<HTMLProps<HTMLFormElement>, 'id' | 'form' | 'onSubmit'> & {
    form: ReturnType<typeof useForm>;
  }
>;

const Form = forwardRef(function Form(
  { form, children, ...props }: FormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  const { submit, id } = form;
  return (
    <FormStateProvider form={form}>
      <form {...props} ref={ref} id={id} onSubmit={submit} noValidate>
        {children}
      </form>
    </FormStateProvider>
  );
});

export { Form };
