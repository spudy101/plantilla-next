import { Card, CardTitle } from '@/components/ui/card';
import type { Profile } from '../types';

const Row = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <dt className="text-ink-soft">{label}</dt>
    <dd className="text-ink font-medium">{value ?? '—'}</dd>
  </div>
);

export function ProfileCard({ profile }: { profile: Profile | null }) {
  return (
    <Card>
      <CardTitle>Mi perfil</CardTitle>
      {profile ? (
        <dl className="divide-line mt-3 divide-y">
          <Row label="Nombre" value={`${profile.firstName} ${profile.lastName}`} />
          <Row label="Documento" value={profile.nationalId} />
          <Row label="Teléfono" value={profile.phone} />
          <Row label="Fecha de nacimiento" value={profile.birthDate} />
        </dl>
      ) : (
        <p className="text-ink-soft mt-3 text-sm">
          Estamos preparando tu perfil. Si acabas de registrarte, recarga la página en unos segundos.
        </p>
      )}
    </Card>
  );
}
