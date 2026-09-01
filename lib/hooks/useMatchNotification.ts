import { useEffect, useState } from "react";

interface MatchNotificationProps {
  onClose: () => void;
  onStartChat: () => void;
}

export function useMatchNotification({ onClose, onStartChat }: MatchNotificationProps) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }

  function handleStartChat() {
    onStartChat();
    handleClose();
  }
return { isVisible, handleClose, handleStartChat };
}