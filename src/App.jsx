import '@/index.css';
import { useEffect } from 'react';
import NLCApp from '@/nlc/NLCApp';
import { checkFounderUrl } from '@/nlc/founder';

export default function App() {
  useEffect(() => { checkFounderUrl(); }, []);
  return <NLCApp />;
}
