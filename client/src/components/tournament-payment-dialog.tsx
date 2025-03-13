import { Elements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { stripePromise, CheckoutForm } from './tournament-checkout';
import { Tournament } from '@shared/schema';

interface TournamentPaymentDialogProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  onSuccess: (paymentIntentId: string) => void;
}

export function TournamentPaymentDialog({
  tournament,
  isOpen,
  onClose,
  clientSecret,
  onSuccess,
}: TournamentPaymentDialogProps) {
  if (!clientSecret) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tournament Registration Payment</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-6 space-y-2">
            <h3 className="font-semibold">{tournament.name}</h3>
            <p className="text-sm text-muted-foreground">
              Registration fee: ${((tournament.entryFee ?? 0) / 100).toFixed(2)}
            </p>
          </div>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  );
}