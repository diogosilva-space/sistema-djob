import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para o login ou app dependendo do estado
  // Para MVP, vamos redirecionar para a auth
  redirect('/auth/login');
}
