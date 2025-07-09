import Script from 'next/script';
import NewTripForm from '../components/form';

export default function NewTripPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <NewTripForm />
    </div>
  );
}
