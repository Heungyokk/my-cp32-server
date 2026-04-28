import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function EditItemModal({ item, isOpen, onClose, onSave }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (item) {
      setForm({ name: item.name || '', price: item.price || '', cpp_heat: item.cpp_heat || '', type: item.type || '谷子', ip_tags: (item.ip_tags || []).join(', '), cp_tags: (item.cp_tags || []).join(', '), phase: item.phase || '一期', promo_link: item.promo_link || '', notes: item.notes || '', daily_stock: item.daily_stock || '', has_online_sales: item.has_online_sales || '' });
    }
  }, [item]);
  if (!isOpen || !item) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.item_id, { name: form.name, price: parseFloat(form.price) || 0, cpp_heat: parseInt(form.cpp_heat) || 0, type: form.type, ip_tags: form.ip_tags ? form.ip_tags.split(/[，,]/).map(t => t.trim()).filter(Boolean) : [], cp_tags: form.cp_tags ? form.cp_tags.split(/[，,]/).map(t => t.trim()).filter(Boolean) : [], phase: form.phase, promo_link: form.promo_link, notes: form.notes, daily_stock: form.daily_stock ? parseInt(form.daily_stock) : null, has_online_sales: form.has_online_sales });
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="edit-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="edit-modal neo-box" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <div className="edit-header"><h3 style={{ margin: 0 }}>编辑商品信息</h3><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="edit-row"><label>商品名称</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="edit-row-half"><div className="edit-row"><label>价格</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div><div className="edit-row"><label>热度</label><input type="number" value={form.cpp_heat} onChange={e => setForm({...form, cpp_heat: e.target.value})} /></div></div>
              <div className="edit-row-half"><div className="edit-row"><label>种类</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="同人本">同人本</option><option value="谷子">谷子</option><option value="无料">无料</option><option value="色纸">色纸</option><option value="其他">其他</option></select></div><div className="edit-row"><label>所属展期</label><select value={form.phase} onChange={e => setForm({...form, phase: e.target.value})}><option value="一期">一期</option><option value="二期">二期</option><option value="双日">双日</option></select></div></div>
              <div className="edit-row-half"><div className="edit-row"><label>IP 标签</label><input type="text" value={form.ip_tags} onChange={e => setForm({...form, ip_tags: e.target.value})} placeholder="逗号分隔" /></div><div className="edit-row"><label>CP 标签</label><input type="text" value={form.cp_tags} onChange={e => setForm({...form, cp_tags: e.target.value})} placeholder="逗号分隔" /></div></div>
              <div className="edit-row-half"><div className="edit-row"><label>是否会通贩</label><select value={form.has_online_sales} onChange={e => setForm({...form, has_online_sales: e.target.value})}><option value="">未填写</option><option value="是">是</option><option value="否">否</option></select></div><div className="edit-row"><label>单日售卖数量</label><input type="number" value={form.daily_stock} onChange={e => setForm({...form, daily_stock: e.target.value})} /></div></div>
              <div className="edit-row"><label>宣摊链接</label><input type="url" value={form.promo_link} onChange={e => setForm({...form, promo_link: e.target.value})} /></div>
              <div className="edit-row"><label>我的备注</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
              <button type="submit" className="neo-button full-width" style={{ marginTop: '12px' }}>保存修改</button>
            </form>
          </motion.div>
          <style>{`
            .edit-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 300; max-width: 600px; margin: 0 auto; }
            .edit-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) !important; z-index: 310; width: 90%; max-width: 500px; max-height: 85vh; overflow-y: auto; background: #fff; padding: 20px; }
            .edit-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border); padding-bottom: 12px; margin-bottom: 16px; }
            .edit-form { display: flex; flex-direction: column; gap: 10px; }
            .edit-row { display: flex; flex-direction: column; gap: 4px; }
            .edit-row label { font-size: 12px; font-weight: bold; color: #666; }
            .edit-row input, .edit-row select, .edit-row textarea { padding: 8px; border: 2px solid var(--border); font-size: 14px; font-family: inherit; }
            .edit-row-half { display: flex; gap: 12px; }
            .edit-row-half > .edit-row { flex: 1; }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
