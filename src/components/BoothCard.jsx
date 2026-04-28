import React from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Package, Gift, Hash } from 'lucide-react';

export default function BoothCard({ booth, onSoldOutToggle, onClick }) {
  const handleDragEnd = (event, info) => { if (info.offset.x > 80) { onSoldOutToggle(); } };
  const pendingItems = booth.items.filter(i => i.status === 0);
  const totalHeat = booth.maxHeat;
  const renderTypeIcon = (type) => {
    if (type === '同人本') return <BookOpen size={24} color="#999" />;
    if (type === '无料') return <Gift size={24} color="#999" />;
    if (type === '谷子') return <Package size={24} color="#999" />;
    return <Hash size={24} color="#999" />;
  };
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }} transition={{ type: "spring", stiffness: 300, damping: 25 }} style={{ position: 'relative', marginBottom: '16px' }}>
      {!booth.isTagGroup && (<div className="swipe-bg"><span style={{ fontWeight: 'bold', fontSize: '18px' }}>摊位售罄</span></div>)}
      <motion.div className={`booth-card neo-box ${booth.hasSTier ? 's-tier-card' : ''}`} drag={booth.isTagGroup ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd} onClick={onClick} whileTap={{ scale: 0.98 }}>
        {booth.hasSTier && (<div className="s-tier-badge"><Star size={12} fill="white" /> S级优先</div>)}
        <div className="booth-header">
          <div className="street-badge">{booth.hall}-{booth.street}</div>
          <div className="booth-info"><h3 className="booth-name">{booth.name}</h3>{!booth.isTagGroup && <span className="booth-number">No.{booth.number}</span>}</div>
        </div>
        {pendingItems.length > 0 && (<div className="item-preview"><div className="type-icon-box-small">{renderTypeIcon(pendingItems[0].type)}</div><div className="preview-details"><div className="preview-name">{pendingItems[0].name}</div><div className="preview-tags"><span className="tag price">¥{pendingItems[0].price}</span><span className="tag heat">🔥 {totalHeat}</span></div></div></div>)}
        <div className="booth-meta"><span>待收割目标: {pendingItems.length}件</span><span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>点击展开</span></div>
      </motion.div>
      <style>{`
        .swipe-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border); color: white; display: flex; align-items: center; padding-left: 20px; border: 3px solid var(--border); z-index: 0; }
        .booth-card { position: relative; z-index: 1; background: #fff; padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 12px; touch-action: pan-y; }
        .s-tier-card { border-color: var(--primary); box-shadow: 4px 4px 0px var(--primary); }
        .s-tier-badge { position: absolute; top: -12px; right: 12px; background: var(--primary); color: white; font-size: 10px; font-weight: bold; padding: 4px 8px; border: 2px solid var(--border); display: flex; align-items: center; gap: 4px; }
        .booth-header { display: flex; align-items: center; gap: 12px; }
        .street-badge { background: var(--secondary); color: white; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-family: 'Courier New', monospace; font-weight: 900; border: 2px solid var(--border); box-shadow: 2px 2px 0px var(--shadow-color); }
        .booth-info { flex: 1; overflow: hidden; }
        .booth-name { margin: 0 0 4px 0; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .booth-number { font-size: 12px; color: #666; font-family: monospace; font-weight: bold; }
        .item-preview { display: flex; gap: 12px; padding: 8px; background: var(--bg); border: 2px solid var(--border); }
        .type-icon-box-small { width: 50px; height: 50px; background: #f5f5f5; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; border-radius: 6px; flex-shrink: 0; }
        .preview-details { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
        .preview-name { font-size: 14px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
        .preview-tags { display: flex; gap: 6px; }
        .tag { font-size: 11px; font-weight: bold; padding: 2px 4px; border: 1px solid var(--border); font-family: monospace; }
        .tag.price { background: white; color: var(--primary); }
        .tag.heat { background: var(--primary); color: white; }
        .booth-meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; border-top: 2px dashed #ccc; padding-top: 8px; }
      `}</style>
    </motion.div>
  );
}
