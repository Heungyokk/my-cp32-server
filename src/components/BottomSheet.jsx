import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, XCircle, Edit3 } from 'lucide-react';

export default function BottomSheet({ booth, isOpen, onClose, onItemToggle, onSTierToggle, onDelete, onEdit }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  if (!booth) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="bottom-sheet neo-box" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
            <div className="sheet-header">
              <div style={{flex: 1}}><h2 className="sheet-title">{booth.name}</h2><div style={{fontSize: '12px', color: '#666', marginTop: '4px', fontFamily: 'monospace'}}>{booth.hall}-{booth.street}{booth.number}</div></div>
              <button className="close-btn" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="items-list">
              {booth.items.map((item) => (
                <div key={item.item_id} className={`item-row neo-box ${item.status !== 0 ? 'processed' : ''}`}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '70px' }}>
                    <button className={`s-tier-toggle-btn ${item.is_s_tier ? 'active' : ''}`} onClick={() => onSTierToggle(item.item_id)} title="标记为S级优先" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: item.is_s_tier ? 'var(--primary)' : '#eee', color: item.is_s_tier ? '#fff' : '#666', border: '2px solid', borderColor: item.is_s_tier ? 'var(--primary)' : 'var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>
                      <Star size={16} fill={item.is_s_tier ? "#fff" : "none"} color={item.is_s_tier ? "#fff" : "#999"} />{item.is_s_tier ? '已设为S级' : '设为S级'}
                    </button>
                    {onEdit && (<button onClick={() => onEdit(item)} title="编辑商品信息" style={{ background: 'none', border: '2px solid var(--border)', borderRadius: '8px', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 'bold', color: '#666' }}><Edit3 size={14} /> 编辑</button>)}
                    {onDelete && (<button className="delete-toggle" onClick={() => { if(window.confirm('确定要彻底删除该商品记录吗？')) { onDelete(item.item_id); } }} title="删除该商品" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><span style={{ fontSize: '18px' }}>🗑️</span></button>)}
                  </div>
                  <div className="item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="item-name">{item.name}</span>
                      {item.promo_link && (<a href={item.promo_link} target="_blank" rel="noreferrer" className="promo-link-btn">[🔗 查看宣摊]</a>)}
                    </div>
                    <div className="item-meta" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      <span className="item-price">¥{item.price}</span><span className="item-heat">🔥 {item.cpp_heat}</span><span className="item-phase">({item.phase || '一期'})</span>
                      {item.has_online_sales === '否' && <span style={{ fontSize: '10px', color: '#fff', background: '#d32f2f', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>场贩限定</span>}
                      {item.has_online_sales === '是' && <span style={{ fontSize: '10px', color: '#fff', background: '#388e3c', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>会通贩</span>}
                      {item.daily_stock && <span style={{ color: '#666', background: '#eee', padding: '0 4px', borderRadius: '4px', fontSize: '12px' }}>限量 {item.daily_stock}</span>}
                    </div>
                    {item.notes && (<div className="item-notes">📝 备注: {item.notes}</div>)}
                    {(item.ip_tags?.length > 0 || item.cp_tags?.length > 0) && (<div className="item-tags" style={{ marginTop: '4px' }}>{item.ip_tags?.map((t, i) => <span key={`ip-${i}`} className="tag-pill ip">{t}</span>)}{item.cp_tags?.map((t, i) => <span key={`cp-${i}`} className="tag-pill cp">{t}</span>)}</div>)}
                  </div>
                  <div className="action-buttons-v2">
                    {item.status === 0 ? (<><button className="action-labeled buy" onClick={() => onItemToggle(item.item_id, 1)}>✅ 已购入</button><button className="action-labeled soldout" onClick={() => onItemToggle(item.item_id, 2)}>售罄</button></>) : (<span className="status-label">{item.status === 1 ? '✅ 已入库' : '❌ 已售罄'}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
      <style>{`
        .backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 200; max-width: 600px; margin: 0 auto; }
        .bottom-sheet { position: fixed; bottom: 0; left: 0; right: 0; z-index: 210; max-width: 600px; margin: 0 auto; background: var(--bg); height: 85vh; border-bottom: none; display: flex; flex-direction: column; }
        .sheet-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px; border-bottom: 3px solid var(--border); background: white; }
        .sheet-title { margin: 0; font-size: 20px; font-weight: 900; }
        .close-btn { background: transparent; border: 3px solid var(--border); padding: 4px; cursor: pointer; box-shadow: 2px 2px 0px var(--shadow-color); }
        .close-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px transparent; }
        .items-list { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .item-row { display: flex; align-items: center; padding: 12px; background: white; gap: 12px; }
        .item-row.processed { opacity: 0.6; filter: grayscale(1); }
        .item-info { flex: 1; display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
        .item-name { font-weight: bold; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-meta { display: flex; gap: 12px; font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; }
        .item-price { color: var(--primary); }
        .item-heat { color: var(--secondary); }
        .item-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .tag-pill { font-size: 10px; padding: 2px 6px; border-radius: 20px; color: white; font-weight: bold; }
        .tag-pill.ip { background: var(--secondary); }
        .tag-pill.cp { background: var(--primary); }
        .action-buttons-v2 { display: flex; flex-direction: column; gap: 6px; min-width: 70px; }
        .action-labeled { padding: 8px 10px; font-weight: bold; cursor: pointer; border: 2px solid var(--border); font-size: 13px; transition: all 0.2s; text-align: center; }
        .action-labeled:active { transform: scale(0.9); }
        .action-labeled.buy { background: var(--primary); color: white; font-size: 14px; }
        .action-labeled.soldout { background: #bbb; color: white; font-size: 12px; }
        .status-label { font-size: 12px; font-weight: bold; padding: 4px 8px; border: 2px solid var(--border); text-align: center; }
      `}</style>
    </AnimatePresence>
  );
}
