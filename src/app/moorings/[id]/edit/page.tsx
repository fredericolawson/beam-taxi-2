import { getMooringById } from '@/lib/tables/moorings-legacy';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { EditMooringForm } from '@/components/moorings/edit-form'; // Import the edit form component
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Master } from '@/components/moorings/google-maps-picker';

// Define props, including the dynamic route parameter `id`
type EditMooringPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMooringPage({ params }: EditMooringPageProps) {
  const { id } = await params;

  // Fetch user and mooring data concurrently
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const mooring = await getMooringById(id);

  // Check if mooring exists
  if (!mooring) {
    notFound();
  }

  // Check if user is logged in
  if (!user) {
    redirect(`/auth/login?message=You must be logged in to edit this mooring.&next=/moorings/${id}/edit`);
  }

  // Check if the logged-in user is the owner
  if (mooring.owner_id !== user.id) {
    // Redirect them away, perhaps back to the detail page with a message
    redirect(`/moorings/${id}?error=You are not authorized to edit this mooring.`);
  }

  // If all checks pass, render the edit form
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="card-container flex h-full flex-grow flex-col p-6 md:w-1/2">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Mooring</h1>
          <Button variant="outline" asChild>
            <Link href={`/moorings/${id}`}>Cancel</Link>
          </Button>
        </div>
        <EditMooringForm mooring={mooring} />
      </div>
      <div className="md:w-1/2">
        <Master />
      </div>
    </div>
  );
}
