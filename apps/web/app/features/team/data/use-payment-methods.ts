import { useQuery } from '@tanstack/react-query';

import { api } from '~/utils/api';

type PaymentMethod = any;

export function usePaymentMethods() {
  return useQuery<{ data: PaymentMethod[] }>({
    queryKey: ['payment-methods'],
    queryFn: () => api('/team/payment-methods'),
  });
}
