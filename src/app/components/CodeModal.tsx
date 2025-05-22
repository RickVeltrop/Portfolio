'use client';

import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-lua';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import './prism-tokyo-night.css'; // We'll create this next

interface CodeModalProps {
  title: string;
  description: string;
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeModal({ title, description, code, isOpen, onClose }: CodeModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match this with the animation duration
  };

  useEffect(() => {
    if (isOpen) {
      Prism.highlightAll();
      setIsClosing(false);
    }
  }, [isOpen, code]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`code-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`code-modal ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="code-modal-header">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2 text-accent">code_blocks</span>
              <h3 className="text-white">{title}</h3>
            </div>
            {description && description.length > 0 && (
              <p className="text-[#565f89] hover:text-accent-text transition-colors duration-200 text-sm mt-1 ml-8">{description}</p>
            )}
          </div>
          <button onClick={handleClose} className="close-button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <pre className="code-block line-numbers !bg-[#1a1b26] !m-0">
          <code className="language-lua">{code}</code>
        </pre>
      </div>
    </div>
  );
} 