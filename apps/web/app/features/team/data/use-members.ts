import { useQuery } from '@tanstack/react-query';

import { api } from '~/utils/api';

type Member = any;

export function useMembers() {
  return useQuery<{ data: { members: Member[]; invitations: Member[] } }>({
    queryKey: ['members'],
    queryFn: () => api('/team/members'),
  });
}
