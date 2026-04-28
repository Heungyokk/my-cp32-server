import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BoothCard from './BoothCard';

export default function BoothGrid({ booths, onSoldOutToggle, onBoothClick }) {
  return (
    <div className="booth-grid">
      <AnimatePresence>
        {booths.map(booth => (
          <BoothCard key={booth.id} booth={booth} onSoldOutToggle={onSoldOutToggle} onClick={onBoothClick} />
        ))}
      </AnimatePresence>
      <style>{`
        .booth-grid { display: flex; flex-direction: column; padding-bottom: 80px; }
      `}</style>
    </div>
  );
}
