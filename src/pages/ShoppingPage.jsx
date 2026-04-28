import React, { useState } from 'react';
import { useTacticalStore } from '../store/useTacticalStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import BottomSheet from '../components/BottomSheet';
import BoothCard from '../components/BoothCard';
import ItemCard from '../components/ItemCard';
import EditItemModal from '../components/EditItemModal';

export default function ShoppingPage() {
  const { getShoppingData, markBoothSoldOut, toggleItemStatus, toggleSTier, deleteItem, updateItem } = useTacticalStore();
  const [groupMode, setGroupMode] = useState('booth');
  const [filterPhase, setFilterPhase] = useState('全部');
  const [sortType, setSortType] = useState(['heat', 'stier']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeBooth, setActiveBooth] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const listData = getShoppingData(groupMode, filterPhase, sortType);
  const toggleSort = (type) => {
    if (sortType.includes(type)) { setSortType(sortType.filter(t => t !== type)); }
    else { setSortType([...sortType, type]); }
  };

  return (
    <div className="page-container combat-page">
      <div className="top-console neo-box">
        <div className="filter-tabs">
          <button className={groupMode === 'booth' ? 'active' : ''} onClick={() => setGroupMode('booth')}>按摊位</button>
          <button className={groupMode === 'ip' ? 'active' : ''} onClick={() => setGroupMode('ip')}>按 IP</button>
          <button className={groupMode === 'cp' ? 'active' : ''} onClick={() => setGroupMode('cp')}>按 CP</button>
        </div>
        <div className="advanced-filter-header" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><SlidersHorizontal size={16} /> 高级筛选与排序</div>
          {isFilterOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="advanced-filter-body">
              <div className="filter-group">
                <label>展期筛选</label>
                <div className="btn-group">
                  {['全部', '一期', '二期'].map(p => (<button key={p} className={`filter-btn ${filterPhase === p ? 'active' : ''}`} onClick={() => setFilterPhase(p)}>{p}</button>))}
                </div>
              </div>
              <div className="filter-group">
                <label>排序规则</label>
                <div className="btn-group">
                  <button className={`filter-btn ${sortType.includes('stier') ? 'active' : ''}`} onClick={() => toggleSort('stier')}>S级强制置顶</button>
                  <button className={`filter-btn ${sortType.includes('heat') ? 'active' : ''}`} onClick={() => toggleSort('heat')}>按热度降序</button>
                </div>
                <div style={{marginTop: '8px', fontSize: '11px', color: '#666'}}>* 按摊位浏览时，会优先按场馆排序，再执行上述规则。</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="booth-grid">
        <AnimatePresence>
          {listData.map((dataItem) => {
            if (groupMode === 'booth') {
              return (<BoothCard key={dataItem.booth_id} booth={dataItem} onSoldOutToggle={() => markBoothSoldOut(dataItem.booth_id)} onClick={() => setActiveBooth(dataItem)} />);
            } else {
              return (<ItemCard key={dataItem.item_id} item={dataItem} booth={dataItem.booth} onToggleStatus={toggleItemStatus} onSTierToggle={toggleSTier} onEdit={(item) => setEditingItem(item)} />);
            }
          })}
        </AnimatePresence>
        {listData.length === 0 && (<div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}><h3 style={{ color: 'var(--secondary)' }}>暂无内容</h3><p>该分类下暂无商品，请更改筛选条件或前往录入</p></div>)}
      </div>
      <BottomSheet booth={activeBooth} isOpen={!!activeBooth} onClose={() => setActiveBooth(null)}
        onItemToggle={(id, status) => { toggleItemStatus(id, status); setActiveBooth(null); }}
        onSTierToggle={(id) => { toggleSTier(id); setActiveBooth(null); }}
        onDelete={(id) => { deleteItem(id); setActiveBooth(null); }}
        onEdit={(item) => { setActiveBooth(null); setEditingItem(item); }}
      />
      <EditItemModal item={editingItem} isOpen={!!editingItem} onClose={() => setEditingItem(null)}
        onSave={(itemId, updates) => { updateItem(itemId, updates); setEditingItem(null); }}
      />
      <style>{`
        .combat-page { padding: 12px; padding-bottom: 80px; overflow-y: auto; flex: 1; }
        .top-console { background: #fff; margin-bottom: 16px; position: sticky; top: 0; z-index: 50; }
        .filter-tabs { display: flex; border-bottom: 2px solid var(--border); }
        .filter-tabs button { flex: 1; padding: 12px 8px; background: #f8f8f8; border: none; border-right: 2px solid var(--border); font-weight: bold; font-size: 14px; cursor: pointer; }
        .filter-tabs button:last-child { border-right: none; }
        .filter-tabs button.active { background: var(--primary); color: white; }
        .advanced-filter-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; font-size: 13px; font-weight: bold; color: #555; cursor: pointer; background: #fff; }
        .advanced-filter-body { border-top: 1px dashed var(--border); padding: 12px; background: #fafafa; overflow: hidden; }
        .filter-group { margin-bottom: 12px; }
        .filter-group:last-child { margin-bottom: 0; }
        .filter-group label { display: block; font-size: 12px; font-weight: bold; color: #888; margin-bottom: 6px; }
        .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn { padding: 6px 12px; border: 1px solid var(--border); background: #fff; font-size: 12px; font-weight: bold; cursor: pointer; border-radius: 4px; }
        .filter-btn.active { background: var(--secondary); color: white; border-color: var(--secondary); }
        .booth-grid { display: flex; flex-direction: column; }
      `}</style>
    </div>
  );
}
