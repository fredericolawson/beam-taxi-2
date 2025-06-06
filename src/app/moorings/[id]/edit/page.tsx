import { getMooringById } from '@/lib/supabase/moorings';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { EditMooringForm } from '@/components/moorings/edit-form'; // Import the edit form component
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="flex min-h-screen w-full flex-col items-center">
      <main className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Mooring</h1>
          {/* Optional: Add a cancel button linking back to the detail page */}
          <Button variant="outline" asChild>
            <Link href={`/moorings/${id}`}>Cancel</Link>
          </Button>
        </div>
        <EditMooringForm mooring={mooring} />
      </main>
    </div>
  );
}
