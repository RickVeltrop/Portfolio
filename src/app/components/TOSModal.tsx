"use client";

import { useState, useEffect } from "react";

interface TOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TOSModal({ isOpen, onClose }: TOSModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`code-modal-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`code-modal ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="code-modal-header">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2 text-accent">
                gavel
              </span>
              <h3 className="text-white">Terms of Service</h3>
            </div>
          </div>
          <button onClick={handleClose} className="close-button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="tos-content">
          <p className="tos-intro">
            By using any of my services, you must fully agree to these terms.
          </p>

          <div className="tos-section">
            <div className="tos-section-header">
              <span className="material-symbols-outlined">payments</span>
              <h4>Payments & Refunds</h4>
            </div>
            <ul>
              <li>
                PayPal (30$ minimum) preferred - Robux payments negotiable.
              </li>
              <li>
                Payments must (partially) be made upfront or through an agreed
                milestone plan.
              </li>
              <li>No refunds once work has started.</li>
              <li>
                Chargebacks or disputes may lead to service termination and
                legal action.
              </li>
            </ul>
          </div>

          <div className="tos-section">
            <div className="tos-section-header">
              <span className="material-symbols-outlined">assignment</span>
              <h4>Client Responsibilities</h4>
            </div>
            <ul>
              <li>
                Provide all necessary details, assets, and communication to keep
                things moving.
              </li>
              <li>
                Delays or forgetfulness on your end may push deadlines without
                liability on my part.
              </li>
            </ul>
          </div>

          <div className="tos-section">
            <div className="tos-section-header">
              <span className="material-symbols-outlined">schedule</span>
              <h4>Timelines & Changes</h4>
            </div>
            <ul>
              <li>Estimated timelines can be discussed upfront.</li>
              <li>
                Extra features or major revisions can extend deadlines and cost
                more.
              </li>
              <li>
                2 minor revisions and bug fixes are included in the price, major
                revisions will cost extra.
              </li>
            </ul>
          </div>

          <div className="tos-section">
            <div className="tos-section-header">
              <span className="material-symbols-outlined">lock</span>
              <h4>Confidentiality</h4>
            </div>
            <ul>
              <li>
                Your project details stay private unless otherwise agreed.
              </li>
              <li>
                I reserve the right to save and use any code created by me in
                future projects.
              </li>
              <li>
                After receiving the product you are not to redistribute my work
                in any way.
              </li>
            </ul>
          </div>

          <div className="tos-section">
            <div className="tos-section-header">
              <span className="material-symbols-outlined">gavel</span>
              <h4>Liability & Termination</h4>
            </div>
            <ul>
              <li>I'm not responsible for losses from delays.</li>
              <li>
                I can end a project if the client is uncooperative or violates
                these terms (no refunds).
              </li>
              <li>Any disputes will be settled.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
