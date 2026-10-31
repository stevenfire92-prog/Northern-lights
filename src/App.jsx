import '@/index.css';
import { useEffect } from 'react';
import { checkFounderUrl } from '@/lib/founder';
import NLCApp from '@/nlc/NLCApp';

export default function App() {
  useEffect(() => { checkFounderUrl(); }, []);
  return <NLCApp />;
}
