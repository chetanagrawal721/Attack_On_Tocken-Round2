import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../state/store';

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`toast${t.halo ? ' halo' : ''}`}
            data-testid="toast"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="row" style={{ gap: 10 }}>
              <span>{t.text}</span>
              {t.action && <button className="link" style={{ color: 'inherit' }} onClick={t.action.run}>{t.action.label}</button>}
            </div>
            {t.progress !== undefined && <div className="progress"><i style={{ width: `${Math.round(t.progress * 100)}%` }} /></div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
