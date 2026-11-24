import { redirect } from 'next/navigation';

export default function SellerLoginRedirect() {
  redirect('/partner/login');
}
