import { HouseIcon, RocketIcon } from '@phosphor-icons/react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { Avatar } from '~/components/avatar';
import { Button } from '~/components/button';
import { useDialog } from '~/components/dialog';
import { DropdownMenu } from '~/components/dropdown-menu';
import { LoadingState } from '~/components/states/loading-state';
import { Tooltip } from '~/components/tooltip';
import { CreateTeamDialog } from '~/features/team/dialogs/create-team-dialog';
import { useAuth } from '~/utils/auth';

export default function DashboardLayout() {
  const auth = useAuth();
  const location = useLocation();

  console.log({ auth });

  const createTeamDialog = useDialog(CreateTeamDialog);

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!auth.team?.id) {
    return <Navigate to="/setup" replace />;
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <div className="flex flex-col h-full border-r-[1px] border-r-solid border-r-[#333]/10 p-3 gap-2 items-center sticky top-0">
        <Tooltip content="Home" side="right">
          <Button
            to={`/dashboard/${auth.team.slug}`}
            isActive={location.pathname === `/dashboard/${auth.team.slug}`}
            icon={<HouseIcon />}
            variant="ghost"
            size="xl"
          />
        </Tooltip>
        <Tooltip content="Projects" side="right">
          <Button
            to={`/dashboard/${auth.team.slug}/projects`}
            isActive={location.pathname === `/dashboard/${auth.team.slug}/projects`}
            icon={<RocketIcon />}
            variant="ghost"
            size="xl"
          />
        </Tooltip>

        <div className="flex flex-1" />
        <DropdownMenu
          key={auth.team.slug}
          side="right"
          items={[
            // NOTE: using `window.location.href` because the middleware that updates the active org in the session token
            // doesn't re-run on client side navigation, so we "force" a page refresh here
            ...(auth.teamList?.map((item) => ({
              label: item.organization.name,
              to: `/dashboard/${item.organization.slug}`,
              onClick: async () => {
                await auth.switchTeam(item.organization.id);
              },
              checked: item.organization.slug === auth.team.slug,
            })) || []),

            { type: 'separator' },
            {
              label: 'Create new team',
              onClick: () => createTeamDialog.open(),
            },

            { type: 'separator' },
            {
              label: 'Profile settings',
              to: '/',
            },
            {
              label: 'Team settings',
              to: `/dashboard/${auth.team.slug}/team-settings`,
            },

            { type: 'separator' },
            {
              label: 'Sign out',
              to: '/auth/sign-out',
            },
          ]}
        >
          <button className="rounded-full outline-offset-2">
            <Avatar name={auth.user?.fullName} avatarUrl={auth.user?.imageUrl} />
          </button>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 overflow-auto w-full">
        <div className="flex flex-1 flex-col p-6 w-full max-w-[1024px] mx-auto">
          {auth.isSwitching ? <LoadingState message="Switching teams..." /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
