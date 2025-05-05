//IM postive this actually didnt get used because im pretty sure this was i was gonna do when the bookmark clicks a noti appears



import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Toast({
  message,
  visible,
  duration = 3000,
  onClose,
  actionLabel,
  onAction,
}: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-3">
      <span>{message}</span>
      {actionLabel && onAction && (
        <button onClick={onAction} className="underline text-sm">
          {actionLabel}
        </button>
      )}
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
