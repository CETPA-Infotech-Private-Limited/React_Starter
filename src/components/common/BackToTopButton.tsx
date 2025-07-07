import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY > 200);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      size="icon"
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full"
      title="Back to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
};

export default BackToTopButton;
