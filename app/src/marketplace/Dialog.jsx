import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

export default function MarketplaceDialog({ title, onClose, children, wide = false }) {
  const dialog = useRef(null);
  const headingId = React.useId();
  useEffect(() => { if (!dialog.current.open) dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className={`market-dialog ${wide ? 'market-dialog--wide' : ''}`} onClose={onClose} aria-labelledby={headingId}>
    <div className="market-dialog-header"><h2 id={headingId}>{title}</h2><button aria-label="Fechar janela" onClick={() => dialog.current.close()}><FiX aria-hidden="true" /></button></div>
    {children}
  </dialog>;
}
