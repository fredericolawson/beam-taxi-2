import { SignUpForm } from '@/components/sign-up';

export default function Page() {
  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
