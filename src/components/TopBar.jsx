import React, { useRef } from 'react';
import { Settings, Upload, Trash2 } from 'lucide-react';
import { parseExcel } from '../utils/excelParser';

export default function TopBar({ stats, hideCompleted, setHideCompleted, onDataLoaded, onClearData }) {
  const fileInputRef = useRef(null);
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { const parsedData = await parseExcel(file); onDataLoaded(parsedData); }
    catch (error) { alert('解析 Excel 失败，请确保格式正确'); console.error(error); }
  };
  const progress = stats.totalItems === 0 ? 0 : Math.round((stats.purchasedCount / stats.totalItems) * 100);
  return (
    <div className="top-bar neo-box">
      <div className="top-bar-header">
        <h1 className="title">TACTICAL SNIPER</h1>
        <div className="actions">
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="导入 Excel"><Upload size={20} /></button>
          <button className="icon-btn" onClick={() => { if(window.confirm('清空所有本地数据？')) onClearData(); }} title="清除数据"><Trash2 size={20} color="var(--primary)" /></button>
        </div>
      </div>
      <div className="status-panel">
        <div className="progress-container">
          <div className="progress-label"><span>战况进度 / HP</span><span>{progress}%</span></div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${progress}%` }}></div></div>
          <div className="stats-row"><span>已俏获: {stats.purchasedCount}/{stats.totalItems}</span><span>已阵亡(售罄): {stats.soldOutBooths}</span></div>
        </div>
      </div>
      <div className="tactical-switch">
        <span>隐藏已购/售罄目标</span>
        <label className="switch"><input type="checkbox" checked={hideCompleted} onChange={(e) => setHideCompleted(e.target.checked)} /><span className="slider"></span></label>
      </div>
      <style>{`
        .top-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 12px 16px; margin: 0 auto; max-width: 600px; border-top: none; border-left: 2px solid var(--border); border-right: 2px solid var(--border); box-shadow: 0 4px 0px var(--shadow-color); }
        .top-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid var(--border); padding-bottom: 8px; }
        .title { font-family: 'Courier New', monospace; font-weight: 900; font-size: 20px; margin: 0; color: var(--primary); letter-spacing: -1px; }
        .actions { display: flex; gap: 8px; }
        .icon-btn { background: transparent; border: 2px solid var(--border); padding: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 0px var(--shadow-color); transition: all 0.1s ease; }
        .icon-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px var(--shadow-color); }
        .progress-container { margin-bottom: 12px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; }
        .progress-bar-bg { height: 16px; background: #e0e0e0; border: 2px solid var(--border); width: 100%; position: relative; }
        .progress-bar-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; border-right: 2px solid var(--border); }
        .stats-row { display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px; color: #555; font-weight: bold; }
        .tactical-switch { display: flex; justify-content: space-between; align-items: center; background: #eee; padding: 8px; border: 2px solid var(--border); font-weight: bold; font-size: 13px; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border: 2px solid var(--border); transition: .2s; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; border: 2px solid var(--border); transition: .2s; }
        input:checked + .slider { background-color: var(--secondary); }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
