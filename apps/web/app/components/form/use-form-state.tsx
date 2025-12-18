import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

type FormStateContextValue = null | UseFormReturn;

const FormStateContext = createContext<FormStateContextValue>(null);

type FormStateContextProviderProps = PropsWithChildren<{
  form: FormStateContextValue;
}>;

export function FormStateProvider({ form, children }: FormStateContextProviderProps) {
  return <FormStateContext.Provider value={form}>{children}</FormStateContext.Provider>;
}

export function useFormState<Values extends FieldValues>() {
  return useContext(FormStateContext) as UseFormReturn<Values>;
}
