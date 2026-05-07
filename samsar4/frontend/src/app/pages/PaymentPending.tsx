import { Link } from 'react-router'
import { Navbar } from '../components/Navbar'
import { Clock, CheckCircle, ArrowRight } from 'lucide-react'

// Cette page s'affiche si quelqu'un navigue directement vers /agent/payment-pending
export function PaymentPending() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <Clock className="w-16 h-16 text-gold mx-auto mb-6 animate-pulse"/>
          <h1 className="font-display text-4xl text-navy mb-4">Paiement en cours</h1>
          <p className="text-navy/50 mb-8">Votre compte est en attente d'activation. Envoyez votre reçu de paiement sur WhatsApp pour accélérer le processus.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary">Se connecter</Link>
            <Link to="/" className="btn-outline">Accueil</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
