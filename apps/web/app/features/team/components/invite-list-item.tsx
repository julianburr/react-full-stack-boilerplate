import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { match } from 'ts-pattern';

import { Avatar } from '~/components/avatar';
import { Button } from '~/components/button';
import { DropdownMenu } from '~/components/dropdown-menu';
import { Spacer } from '~/components/spacer';
import { Text } from '~/components/text';
import { useAuth } from '~/utils/auth';

type Props = {
  data: any;
};

export function InviteListItem({ data }: Props) {
  const auth = useAuth();

  const isAdmin = auth.orgRole === 'org:admin';

  const email = data.emailAddress;
  const role = match(data.role)
    .with('org:member', () => 'Member')
    .with('org:admin', () => 'Admin')
    .otherwise(() => 'n/a');

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[200px] bg-[#333]/10 p-6 rounded-md relative">
      <Avatar name={email} avatarUrl={data.publicUserData?.imageUrl} />
      <Spacer h={8} />

      <Text size="xs">{email}</Text>
      <Text size="xs">{role}</Text>

      {isAdmin && (
        <DropdownMenu
          items={[
            {
              label: 'Admin',
              checked: data.role === 'org:admin',
            },
            {
              label: 'Member',
              checked: data.role === 'org:member',
            },
            { type: 'separator' },
            {
              label: 'Resend invite',
              onClick: () => {
                console.log('resend invite');
              },
            },
            {
              label: 'Remove from team',
              onClick: () => {
                console.log('remove from team');
              },
            },
          ]}
        >
          <Button
            className="absolute top-2 right-2"
            variant="ghost"
            icon={<DotsThreeVerticalIcon />}
          />
        </DropdownMenu>
      )}
    </div>
  );
}
