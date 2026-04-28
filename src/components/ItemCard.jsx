import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, BookOpen, Package, Gift, Hash, Edit3 } from 'lucide-react';

export default function ItemCard({ item, booth, onToggleStatus, onSTierToggle, onEdit }) {
  const renderTypeIcon = () => {
    if (item.type === '同人本') return <BookOpen size={32} color="#999" />;
    if (item.type === '无料') return <Gift size={32} color="#999" />;
    if (item.type === '谷子') return <Package size={32} color="#999" />;
    return <Hash size={32} color="#999" />;
  };
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }} transition={{ type: "spring", stiffness: 300, damping: 25 }} style={{ marginBottom: '12px' }} className={`neo-box item-card-flat ${item.is_s_tier ? 's-tier-flat' : ''}`}>
      <div className="item-flat-header">
        <div className="item-name-row">{item.is_s_tier && <Star size={16} fill="var(--primary)" color="var(--primary)" style={{marginRight: '6px'}}/>}<h4 className="flat-name">{item.name}</h4></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.has_online_sales === '否' && <span style={{ fontSize: '10px', color: '#fff', background: '#d32f2f', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>场贩限定</span>}
          {item.has_online_sales === '是' && <span style={{ fontSize: '10px', color: '#fff', background: '#388e3c', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>会通贩</span>}
          {item.daily_stock && <span style={{ fontSize: '12px', color: '#666', background: '#eee', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>限量 {item.daily_stock}</span>}
          <div className="flat-heat">🔥 {item.cpp_heat}</div>
        </div>
      </div>
      <div className="item-flat-body">
        <div className="type-icon-box">{renderTypeIcon()}</div>
        <div className="flat-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="flat-price">¥{item.price}</div>
            <div className="flat-phase">({item.phase || '一期'})</div>
            {item.promo_link && (<a href={item.promo_link} target="_blank" rel="noreferrer" className="promo-link-btn" style={{ fontSize: '12px' }}>🔗 查看宣摊</a>)}
          </div>
          <div className="flat-booth"><MapPin size={12} /> {booth ? `${booth.hall}-${booth.street}${booth.number}` : '位置未知'}{booth && <span style={{marginLeft: '6px', color:'#999'}}>({booth.name})</span>}</div>
          {item.notes && (<div className="item-notes" style={{ fontSize: '12px', background: '#fff9c4', padding: '4px', border: '1px solid #ccc' }}>📝 {item.notes}</div>)}
          <div className="flat-tags">{item.ip_tags?.map((t, i) => <span key={`ip-${i}`} className="tag-pill ip">{t}</span>)}{item.cp_tags?.map((t, i) => <span key={`cp-${i}`} className="tag-pill cp">{t}</span>)}</div>
        </div>
      </div>
      <div className="item-flat-actions">
        <div className="actions-row-top">
          <button className="action-btn-flat s-tier" onClick={() => onSTierToggle(item.item_id)}>⭐ {item.is_s_tier ? '取消S级' : '设为S级'}</button>
          {onEdit && (<button className="action-btn-flat edit" onClick={() => onEdit(item)}>✏️ 编辑</button>)}
        </div>
        <div className="actions-row-bottom">
          <button className="action-btn-flat buy" onClick={() => onToggleStatus(item.item_id, 1)}>✅ 已购入</button>
          <button className="action-btn-flat soldout" onClick={() => onToggleStatus(item.item_id, 2)}>售罄</button>
        </div>
      </div>
      <style>{`
        .item-card-flat { background: #fff; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .s-tier-flat { border-color: var(--primary); box-shadow: 4px 4px 0px var(--primary); }
        .item-flat-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px dashed #eee; padding-bottom: 8px; }
        .item-name-row { display: flex; align-items: center; }
        .flat-name { margin: 0; font-size: 16px; }
        .flat-heat { color: var(--secondary); font-weight: bold; font-family: 'Courier New', monospace; }
        .item-flat-body { display: flex; gap: 12px; }
        .type-icon-box { width: 50px; height: 50px; background: #f5f5f5; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0; }
        .flat-details { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
        .flat-price { font-size: 18px; font-weight: bold; color: var(--primary); font-family: 'Courier New', monospace; }
        .flat-booth { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; font-family: monospace; }
        .flat-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .tag-pill { font-size: 10px; padding: 2px 6px; border-radius: 20px; color: white; font-weight: bold; }
        .tag-pill.ip { background: var(--secondary); }
        .tag-pill.cp { background: var(--primary); }
        .item-flat-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
        .actions-row-top, .actions-row-bottom { display: flex; gap: 6px; }
        .action-btn-flat { flex: 1; padding: 8px; font-weight: bold; cursor: pointer; border: 2px solid var(--border); background: #fff; transition: all 0.2s; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .action-btn-flat:active { transform: scale(0.95); }
        .action-btn-flat.s-tier { color: var(--secondary); }
        .action-btn-flat.edit { color: #666; }
        .action-btn-flat.buy { background: var(--primary); color: white; flex: 2; font-size: 15px; }
        .action-btn-flat.soldout { background: #999; color: white; flex: 1; }
      `}</style>
    </motion.div>
  );
}
