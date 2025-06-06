'use server';

import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { type User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Define the structure of a Mooring based on the DB schema
export type Mooring = {
  id: string; // uuid
  created_at: string; // timestamp with time zone
  name: string;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  price_per_month: number | null;
  commitment_term: 'monthly' | 'quarterly' | 'annual' | null;
  is_available: boolean;
  owner_id: string; // uuid
  description: string | null;
};

// Schema for validating mooring creation/update form data
// We use zod for validation before hitting the DB
const MooringSchema = z.object({
  id: z.string().uuid().optional(), // Optional for create, required for update
  name: z.string().min(3, 'Name must be at least 3 characters'),
  location_description: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  price_per_month: z.coerce.number().positive('Price must be positive').optional().nullable(),
  commitment_term: z
    .enum(['monthly', 'quarterly', 'annual'], {
      errorMap: () => ({ message: 'Please select a valid commitment term.' }),
    })
    .nullable(),
  is_available: z.boolean().default(true),
  description: z.string().optional().nullable(),
});

// Define a type specifically for the create form data, omitting fields not in the form
type CreateMooringData = z.infer<ReturnType<typeof MooringSchema.omit<{ id: true; is_available: true }>>>;

// --- Read Operations ---

export async function getAllAvailableMoorings(): Promise<Mooring[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('is_available', true).order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching available moorings:', error);
    return []; // Return empty array on error
  }
  return data as Mooring[];
}

export async function getMooringById(id: string): Promise<Mooring | null> {
  if (!id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error(`Error fetching mooring by id ${id}:`, error);
    return null;
  }
  return data as Mooring | null;
}

export async function getMooringsByOwner(userId: string): Promise<Mooring[]> {
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('moorings').select('*').eq('owner_id', userId).order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching moorings for owner ${userId}:`, error);
    return [];
  }
  return data as Mooring[];
}

// --- Helper to get current user ---

async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

// --- Write Operations (Server Actions) ---

// Refactored createMooring for react-hook-form
export async function createMooring(
  data: CreateMooringData // Accept the validated form data object directly
): Promise<void> {
  // Returns void on success (redirects) or throws error

  const user = await getCurrentUser();
  if (!user) {
    // Throw an error for authentication failure
    throw new Error('Authentication Error: Please log in.');
  }

  // Debug: Log received data
  console.log('Server received data:', data);
  console.log('Received latitude:', data.latitude);
  console.log('Received longitude:', data.longitude);

  // Validation is now handled client-side by react-hook-form + zodResolver
  // However, it's good practice to re-validate on the server.
  const validatedFields = MooringSchema.omit({
    id: true,
    is_available: true,
  }).safeParse(data);

  if (!validatedFields.success) {
    console.error('Server Validation Error:', validatedFields.error.flatten().fieldErrors);
    // Throw a generic validation error; client-side validation should catch specifics.
    throw new Error('Validation Error: Invalid data received.');
  }

  console.log('Validated data:', validatedFields.data);
  console.log('Validated latitude:', validatedFields.data.latitude);
  console.log('Validated longitude:', validatedFields.data.longitude);

  const insertData = {
    ...validatedFields.data,
    owner_id: user.id,
    is_available: true, // Explicitly set default if not in form/schema
  };

  console.log('Data being inserted into database:', insertData);

  const supabase = await createClient();
  const { data: insertedData, error } = await supabase.from('moorings').insert(insertData).select('id').single();

  if (error) {
    console.error('Database Error creating mooring:', error);
    // Throw an error for database failure
    throw new Error(`Database Error: ${error.message}`);
  }

  console.log('Successfully inserted mooring:', insertedData);

  // On success, revalidate paths and redirect
  revalidatePath('/');
  revalidatePath('/account/moorings');
  if (insertedData?.id) {
    revalidatePath(`/moorings/${insertedData.id}`);
    // Redirect throws an error, stopping execution, so no return needed.
    redirect(`/moorings/${insertedData.id}`);
  } else {
    console.error('Insert successful but no ID returned');
    // Redirect to a fallback page if ID is missing for some reason
    redirect('/');
  }
}

// Keep FormState for updateMooring if it still uses useActionState
export type FormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    location_description?: string[];
    latitude?: string[];
    longitude?: string[];
    price_per_month?: string[];
    commitment_term?: string[];
    is_available?: string[];
    description?: string[];
    // Add other fields as needed
  };
};

// Make sure updateMooring still uses FormState if it needs it
export async function updateMooring(
  prevState: FormState, // Add prevState
  formData: FormData
): Promise<FormState> {
  // Update return type

  const user = await getCurrentUser();
  if (!user) {
    // Return error state instead of redirecting
    return { message: 'Authentication Error: Please log in.' };
  }

  const mooringId = formData.get('id') as string | null;
  if (!mooringId) {
    return { message: 'Error: Missing Mooring ID for update.' };
  }

  const validatedFields = MooringSchema.safeParse({
    id: mooringId, // id is needed for validation schema but not for the update payload itself
    name: formData.get('name'),
    location_description: formData.get('location_description'),
    price_per_month: formData.get('price_per_month'),
    commitment_term: formData.get('commitment_term'),
    description: formData.get('description'),
    // Add is_available if you have a checkbox/switch for it in the edit form
    // is_available: formData.get('is_available') === 'on',
  });

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Error: Please check the form fields.',
    };
  }

  const supabase = await createClient();

  // Verify ownership before update (RLS provides primary protection, but good practice)
  const { data: existingMooring, error: fetchError } = await supabase.from('moorings').select('owner_id').eq('id', mooringId).maybeSingle(); // Use maybeSingle to handle null case gracefully

  if (fetchError) {
    console.error('Database Error fetching mooring for ownership check:', fetchError);
    return { message: `Database Error: ${fetchError.message}` };
  }

  if (!existingMooring || existingMooring.owner_id !== user.id) {
    console.error('Authorization Error: User does not own mooring or mooring not found.');
    return {
      message: 'Authorization Error: You are not allowed to update this mooring or it does not exist.',
    };
  }

  // Prepare data for update, removing id from the payload
  const { id: _, ...updateData } = validatedFields.data;

  // Proceed with update
  const { error: updateError } = await supabase.from('moorings').update(updateData).eq('id', mooringId).eq('owner_id', user.id); // RLS handles this, but explicit check is fine

  if (updateError) {
    console.error('Database Error updating mooring:', updateError);
    return { message: `Database Error: ${updateError.message}` };
  }

  // Revalidate relevant paths
  revalidatePath('/');
  revalidatePath('/account/moorings');
  revalidatePath(`/moorings/${mooringId}`);
  revalidatePath(`/moorings/${mooringId}/edit`);

  // Redirect on success
  redirect(`/moorings/${mooringId}`);

  // This return is unreachable due to redirect but required by TypeScript
  // return { message: 'Success' }
}

export async function deleteMooring(
  //prevState: FormState, // Example if using useFormState with a form wrapper
  id: string
  //): Promise<FormState> { // Example if using useFormState
) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  if (!id) {
    return { message: 'Error: Missing Mooring ID for delete.' };
  }

  const supabase = await createClient();

  // Optional: Verify ownership before delete attempt, although RLS is the main guard
  const { data: existingMooring, error: fetchError } = await supabase.from('moorings').select('owner_id').eq('id', id).single();

  if (fetchError || !existingMooring || existingMooring.owner_id !== user.id) {
    console.error('Authorization Error or Fetch Error:', fetchError);
    return {
      message: 'Error: You are not authorized to delete this mooring or mooring not found.',
    };
  }

  // Attempt deletion (RLS enforces ownership)
  const { error } = await supabase.from('moorings').delete().eq('id', id).eq('owner_id', user.id); // RLS makes this eq redundant but adds clarity

  if (error) {
    console.error('Error deleting mooring:', error);
    return { message: 'Database Error: Failed to Delete Mooring.' };
  }

  // Revalidate paths after deletion
  revalidatePath('/');
  revalidatePath('/account/moorings');
  // No need to revalidate the detail/edit page as it won't exist
  redirect('/account/moorings'); // Redirect to the user's mooring list
}
