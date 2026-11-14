import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import { getAccessToken, getCurrentUser } from '@/features/auth/session';
import { ProfileCard } from '@/features/profile/components/profile-card';
import { profileApi } from '@/features/profile/profile.api';

export const metadata: Metadata = { title: 'Mi panel' };

export default async function DashboardPage() {
  const [user, token] = await Promise.all([getCurrentUser(), getAccessToken()]);
  if (!user || !token) {
    redirect(ROUTES.login);
  }

  const profile = await profileApi.getMine(token);
  const greetingName = profile?.firstName ?? user.email;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink text-3xl font-bold">Hola, {greetingName}</h1>
        <p className="text-ink-soft mt-1">Este es tu panel. Desde aquí crecen los módulos privados de la app.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Mi cuenta</CardTitle>
          <dl className="divide-line mt-3 divide-y text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-ink-soft">Correo</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-soft">Rol</dt>
              <dd className="font-medium">{user.role?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-ink-soft">Estado</dt>
              <dd className="font-medium">{user.status === 'ACTIVE' ? 'Activa' : 'Bloqueada'}</dd>
            </div>
          </dl>
        </Card>
        <ProfileCard profile={profile} />
      </div>
    </div>
  );
}
