import React from 'react';
import { useTacticalStore } from '../store/useTacticalStore';

export default function HistoryPage() {
  const { getStats, items, booths, deleteItem } = useTacticalStore();
  const stats = getStats();
  const purchasedItems = items.filter(i => i.status === 1);
  const soldOutItems = items.filter(i => i.status === 2);
  const handleDelete = (id) => { if(window.confirm('确定要删除该商品记录吗？')) { deleteItem(id); } };

  return (
    <div className="page-container loot-page">
      <div className="header neo-box"><h2>购物记录 HISTORY</h2></div>
      <div className="budget-panel neo-box">
        <h3>预算统计</h3>
        <div className="progress-container">
          <div className="progress-label"><span>预算消耗率</span><span>{Math.round(stats.progress)}%</span></div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${Math.min(stats.progress, 100)}%`, background: stats.progress > 100 ? '#ff0000' : 'var(--primary)' }}></div></div>
          <div className="stats-row"><span>已花费: ¥{stats.spent.toFixed(2)}</span><span>总预算: ¥{stats.budget.toFixed(2)}</span></div>
        </div>
      </div>
      <div className="list-section">
        <h3 className="section-title" style={{ color: 'var(--secondary)' }}>✅ 已购清单 ({stats.purchasedCount})</h3>
        {purchasedItems.length === 0 ? <p className="empty-text">暂无已购商品</p> : (
          <div className="loot-grid">
            {purchasedItems.map(item => {
              const booth = booths.find(b => b.booth_id === item.booth_id);
              return (
                <div key={item.item_id} className="loot-item neo-box" style={{position: 'relative'}}>
                  <button onClick={() => handleDelete(item.item_id)} className="history-delete-btn" title="删除记录">✕</button>
                  <div className="loot-name" style={{paddingRight: '16px'}}>{item.name}</div>
                  <div className="loot-meta"><span>{booth?.hall}-{booth?.street}{booth?.number}</span><span className="price">¥{item.price}</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="list-section" style={{ opacity: 0.7 }}>
        <h3 className="section-title" style={{ color: '#666' }}>❌ 售罄记录 ({stats.soldOutCount})</h3>
        {soldOutItems.length === 0 ? <p className="empty-text">无</p> : (
          <div className="loot-grid">
            {soldOutItems.map(item => (
              <div key={item.item_id} className="loot-item neo-box" style={{ background: '#eee', position: 'relative' }}>
                <button onClick={() => handleDelete(item.item_id)} className="history-delete-btn" title="删除记录">✕</button>
                <div className="loot-name" style={{ textDecoration: 'line-through', paddingRight: '16px' }}>{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .loot-page { padding: 16px; padding-bottom: 80px; overflow-y: auto; flex: 1; }
        .header { padding: 12px; margin-bottom: 20px; background: var(--secondary); color: white; text-align: center; }
        .header h2 { margin: 0; font-family: 'Courier New', monospace; font-size: 24px; }
        .budget-panel { padding: 16px; margin-bottom: 24px; }
        .budget-panel h3 { margin: 0 0 12px; font-size: 18px; border-bottom: 2px solid var(--border); padding-bottom: 4px; }
        .progress-label { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px; }
        .progress-bar-bg { height: 20px; background: #e0e0e0; border: 2px solid var(--border); width: 100%; margin-bottom: 8px; }
        .progress-bar-fill { height: 100%; border-right: 2px solid var(--border); transition: width 0.3s; }
        .stats-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; font-family: monospace; }
        .section-title { font-size: 18px; border-bottom: 2px solid var(--border); padding-bottom: 4px; margin-bottom: 12px; }
        .empty-text { font-size: 14px; color: #999; }
        .loot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .loot-item { padding: 10px; background: white; display: flex; flex-direction: column; gap: 6px; }
        .loot-name { font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .loot-meta { display: flex; justify-content: space-between; font-size: 12px; color: #666; font-family: monospace; }
        .price { color: var(--primary); font-weight: bold; }
        .history-delete-btn { position: absolute; top: 4px; right: 4px; background: transparent; border: none; color: #999; font-size: 14px; font-weight: bold; cursor: pointer; padding: 4px; }
        .history-delete-btn:hover { color: var(--primary); }
      `}</style>
    </div>
  );
}
