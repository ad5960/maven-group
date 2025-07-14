import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fullWidth?: boolean;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, fullWidth }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '1rem',
          maxWidth: fullWidth ? '100vw' : '95vw',
          maxHeight: fullWidth ? '100vh' : '90vh',
          overflow: fullWidth ? 'visible' : 'auto',
          position: 'relative',
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: 20,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 