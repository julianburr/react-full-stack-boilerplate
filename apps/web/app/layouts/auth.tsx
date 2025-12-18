import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-[320px]">
        <Outlet />
      </div>
    </div>
  );
}
