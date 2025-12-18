import { useEffect, useMemo, useState } from 'react';
import { useForm as useHookForm } from 'react-hook-form';

import type { UseFormReturn, UseFormProps, SubmitHandler, FieldValues } from 'react-hook-form';

type UseFormArg<Values extends FieldValues> = UseFormProps<Values> & {
  onSubmit: SubmitHandler<Values>;
  id: string;
  key?: string;
  isLoading?: boolean;
};

type Return = UseFormReturn<any> & {
  id?: string;
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useForm<Values extends FieldValues>({
  onSubmit,
  id,
  key,
  defaultValues,
  ...options
}: UseFormArg<Values>): Return {
  const form = useHookForm<Values>({
    ...options,
    defaultValues,
  });

  // We use the `loading` property to tell the form to reset once any async default values
  // have been loaded
  const [isLoading, setIsLoading] = useState(!!options.isLoading);
  useEffect(() => {
    if (isLoading && !options.isLoading) {
      form.reset(defaultValues as Values);
      setIsLoading(false);
    }
  }, [options.isLoading, defaultValues, form, isLoading]);

  useEffect(() => {
    form.reset(defaultValues as Values);
  }, [key]);

  return useMemo(
    () => ({ submit: form.handleSubmit(onSubmit), id, isLoading, ...form }),
    [id, form, isLoading, onSubmit],
  );
}
