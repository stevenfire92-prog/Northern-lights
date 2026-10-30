import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import Lobby from './pages/Lobby';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import Slots from './games/Slots';
import Blackjack from './games/Blackjack';
import Roulette from './games/Roulette';
import Disclaimer from './pages/Disclaimer';

export default function NLCApp() {
  return (
    <Router>
      <Toaster position="top-center" theme="dark" richColors />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/play/slots" element={<Slots />} />
        <Route path="/play/blackjack" element={<Blackjack />} />
        <Route path="/play/roulette" element={<Roulette />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
