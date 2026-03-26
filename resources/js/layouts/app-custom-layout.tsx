import { useEffect, useRef, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Toast from '@/components/toast';
import { ToastType } from '@/types/general';

export const AppCustomLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { url, props } = usePage();

  // Local state to control toast visibility
  const [activeToast, setActiveToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    // 1. Handle Scroll Reset (for your h-dvh layout)
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo(0, 0);
    }

    // 2. Handle Stale Data on Back Button
    // We listen for the 'popstate' event which is triggered by browser back/forward
    const handlePopState = () => {
      router.reload({
        preserveScroll: true,
        preserveState: false,
      } as any);
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [url]);

  useEffect(() => {
    // Listen for flash messages from Laravel
    // Assuming your Laravel controller uses: back()->with('success', 'Saved!')
    const flash = props.flash as {
      success?: string;
      error?: string;
      status?: string;
    };

    if (flash.success) {
      setActiveToast({ message: flash.success, type: 'success' });
    } else if (flash.error) {
      setActiveToast({ message: flash.error, type: 'error' });
    } else if (flash.status) {
      setActiveToast({ message: flash.status, type: 'status' });
    }
  }, [props.flash]); // Re-run whenever flash props change

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-900">
      {/* Navbar stays put because the parent doesn't scroll */}
      <Navbar className="flex-shrink-0" />

      {/* This div becomes the only thing that scrolls */}
      <div
        ref={scrollContainer}
        className="flex flex-grow flex-col overflow-y-auto"
      >
        {/* <div className="flex min-h-full flex-col">
          <main className="flex-grow">{children}</main>
          <Footer className="flex-shrink-0" />
        </div> */}
        <main className="flex-grow">{children}</main>
        <Footer className="flex-shrink-0" />
      </div>

      {/* Render the Toast if activeToast is not null */}
      {activeToast && (
        <Toast
          message={activeToast.message}
          type={activeToast.type}
          onClose={() => setActiveToast(null)} // This handles the click-to-close
        />
      )}
    </div>
  );
};
