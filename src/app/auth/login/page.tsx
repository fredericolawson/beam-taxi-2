import { LoginForm } from '@/components/login-form';

export default function Page() {
  return (
    <div className="flex w-full flex-grow items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
