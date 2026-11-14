import { SubmitButton } from '@/components/ui/submit-button';
import { logoutAction } from '../actions';

/** Server component: un form que llama a la server action (funciona incluso sin JS). */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <SubmitButton variant="secondary" pendingText="Saliendo…">
        Cerrar sesión
      </SubmitButton>
    </form>
  );
}
