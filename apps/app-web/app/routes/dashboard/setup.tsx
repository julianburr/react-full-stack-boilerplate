import { useOrganizationList } from '@clerk/react-router';
import { useNavigate } from 'react-router';

export default function DashboardSetup() {
  const navigate = useNavigate();
  const orgList = useOrganizationList();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    try {
      const org = await orgList.createOrganization?.({ name });
      await navigate(`/dashboard/${org?.id}`);
    } catch (error) {
      console.error('Set up account failed');
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Set up account</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <button type="submit">Set up</button>
      </form>
    </div>
  );
}
