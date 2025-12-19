import { Header } from '../components/header';
import dynamic from 'next/dynamic';

// ⚡ Lazy load footer (below the fold)
const Footer = dynamic(() => import('../components/footer').then(mod => ({ default: mod.Footer })), {
  loading: () => null,
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}