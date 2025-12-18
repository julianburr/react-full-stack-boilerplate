import { useQuery } from '@tanstack/react-query';

import { api } from '~/utils/api';

type Invoice = any;

export function useInvoices() {
  return useQuery<{ data: Invoice[] }>({
    queryKey: ['invoices'],
    queryFn: () => api('/team/invoices'),
  });
}
