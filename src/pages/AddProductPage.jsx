import React, { useRef, useState } from 'react';
import { useTacticalStore } from '../store/useTacticalStore';
import { parseExcelV2 } from '../utils/excelParser';
import { Upload, Edit3, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function AddProductPage() {
  const fileInputRef = useRef(null);
  const { importData, setBudget, budget } = useTacticalStore();
  const navigate = useNavigate();

  // 控制折叠面板
  const [activeTab, setActiveTab] = useState(null);

  // 手动录入表单状态
  const [manualForm, setManualForm] = useState({
    name: '',
    hall: '贰',
    street: 'A',
    number: '',
    price: '',
    cpp_heat: '',
    type: '谷子',
    ip_tags: '',
    cp_tags: '',
    phase: '一期',
    promo_link: '',
    notes: '',
    daily_stock: '',
    has_online_sales: ''
  });

  const halls = ['贰', '叁', '肆', '伍', '陆', '柒', '企业6', '企业7'];

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['展馆', '街道字母', '摊位号', '制品名', '种类', '价格', '热度', 'IP标签', 'CP标签', '所属展期', '是否会通贩', '单日售卖数量', '宣摊链接', '我的备注'],
      ['贰', 'A', '32', '新刊《光》', '同人本', 50, 5000, '全职高手', '全职高手其他CP', '一期', '否', 100, 'http://bilibili.com', '首发']
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "商品导入模板");
    XLSX.writeFile(wb, "CP32_购物作战终端_导入模板.xlsx");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { booths, items } = await parseExcelV2(file);
      // Excel 此时也需要支持 phase, promo_link 和 notes, 在后续会扩展 parseExcelV2 或先使用默认值。
      importData(booths, items);
      alert(`成功导入 ${booths.length} 个摊位，${items.length} 个商品`);
    } catch (error) {
      alert('解析失败，请检查格式');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.name) {
      alert('商品名称为必填项');
      return;
    }

    const hall = manualForm.hall || '贰';
    const street = manualForm.street.toUpperCase() || 'A';
    const number = manualForm.number || '00';
    const boothId = `${hall}-${street}${number}`;

    const booth = {
      booth_id: boothId,
      hall,
      street,
      number,
      name: boothId, 
      max_heat: parseInt(manualForm.cpp_heat) || 0
    };

    const item = {
      item_id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      booth_id: boothId,
      name: manualForm.name,
      price: parseFloat(manualForm.price) || 0,
      cpp_heat: parseInt(manualForm.cpp_heat) || 0,
      type: manualForm.type,
      ip_tags: manualForm.ip_tags ? manualForm.ip_tags.split(/[，,]/).map(t => t.trim()) : [],
      cp_tags: manualForm.cp_tags ? manualForm.cp_tags.split(/[，,]/).map(t => t.trim()) : [],
      phase: manualForm.phase,
      promo_link: manualForm.promo_link,
      notes: manualForm.notes,
      daily_stock: manualForm.daily_stock ? parseInt(manualForm.daily_stock) : null,
      has_online_sales: manualForm.has_online_sales,
      status: 0,
      is_s_tier: false,
    };

    importData([booth], [item]);
    alert('手动添加成功');
    // 重置表单但保留位置方便连续录入
    setManualForm({ ...manualForm, name: '', price: '', cpp_heat: '', promo_link: '', notes: '', daily_stock: '', has_online_sales: '' });
  };

  return (
    <div className="page-container setup-page">
      <div className="header neo-box">
        <h2>添加商品 ADD ITEMS</h2>
      </div>

      <div className="section neo-box">
        <h3>设置购物预算</h3>
        <div className="input-row">
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>¥</span>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(Number(e.target.value))}
            className="budget-input"
            placeholder="0"
          />
        </div>
      </div>

      <div className="options-container">
        {/* 1. Excel 导入 */}
        <div className="accordion-item neo-box">
          <div className="accordion-header" onClick={() => toggleTab('excel')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={20} color="var(--primary)"/> <span>批量导入 (Excel)</span>
            </div>
            {activeTab === 'excel' ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
          </div>
          {activeTab === 'excel' && (
            <div className="accordion-content">
              <p className="hint">使用标准模板导入全量数据，包含宣图链接等完整信息。</p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button className="neo-button" style={{ flex: 1, background: '#f5f5f5', color: '#333' }} onClick={downloadTemplate}>
                  <Download size={16} style={{ marginRight: '6px' }} />
                  下载标准模板
                </button>
              </div>

              <input 
                type="file" 
                accept=".xlsx, .xls" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
              <button className="neo-button full-width" onClick={() => fileInputRef.current?.click()}>
                选择 Excel 文件并导入
              </button>
            </div>
          )}
        </div>


        {/* 3. 手动录入 */}
        <div className="accordion-item neo-box">
          <div className="accordion-header" onClick={() => toggleTab('manual')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={20} color="#2e7d32"/> <span>手动填写表单</span>
            </div>
            {activeTab === 'manual' ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
          </div>
          {activeTab === 'manual' && (
            <div className="accordion-content">
              <form onSubmit={handleManualSubmit} className="manual-form">
                <div className="form-row">
                  <div className="form-group required">
                    <label>商品名称 (必填)</label>
                    <input type="text" value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} />
                  </div>
                  
                  <div className="form-group">
                    <label>商品类型</label>
                    <select value={manualForm.type} onChange={e => setManualForm({...manualForm, type: e.target.value})}>
                      <option value="谷子">谷子</option>
                      <option value="同人本">同人本</option>
                      <option value="无料">无料</option>
                      <option value="其它">其它</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>展馆</label>
                    <select value={manualForm.hall} onChange={e => setManualForm({...manualForm, hall: e.target.value})}>
                      {halls.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>街道字母</label>
                    <input type="text" value={manualForm.street} onChange={e => setManualForm({...manualForm, street: e.target.value})} placeholder="A" />
                  </div>
                  <div className="form-group">
                    <label>门牌号</label>
                    <input type="text" value={manualForm.number} onChange={e => setManualForm({...manualForm, number: e.target.value})} placeholder="01" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>价格 (¥)</label>
                    <input type="number" value={manualForm.price} onChange={e => setManualForm({...manualForm, price: e.target.value})} placeholder="50" />
                  </div>
                  <div className="form-group">
                    <label>热度 (数字)</label>
                    <input type="number" value={manualForm.cpp_heat} onChange={e => setManualForm({...manualForm, cpp_heat: e.target.value})} placeholder="100" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>IP 标签</label>
                    <input type="text" value={manualForm.ip_tags} onChange={e => setManualForm({...manualForm, ip_tags: e.target.value})} placeholder="如：全职高手 (逗号分隔)" />
                  </div>
                  <div className="form-group">
                    <label>CP 标签</label>
                    <input type="text" value={manualForm.cp_tags} onChange={e => setManualForm({...manualForm, cp_tags: e.target.value})} placeholder="(逗号分隔)" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group required">
                    <label>所属展期</label>
                    <select value={manualForm.phase} onChange={e => setManualForm({...manualForm, phase: e.target.value})}>
                      <option value="一期">一期 (Phase 1)</option>
                      <option value="二期">二期 (Phase 2)</option>
                      <option value="双日">双日 (Both)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>单日售卖数量</label>
                    <input type="number" value={manualForm.daily_stock} onChange={e => setManualForm({...manualForm, daily_stock: e.target.value})} placeholder="选填，如：100" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>是否会通贩</label>
                    <select value={manualForm.has_online_sales} onChange={e => setManualForm({...manualForm, has_online_sales: e.target.value})}>
                      <option value="">未填写 (选填)</option>
                      <option value="是">是 (会通贩)</option>
                      <option value="否">否 (仅限场贩)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>宣摊链接</label>
                    <input type="url" value={manualForm.promo_link} onChange={e => setManualForm({...manualForm, promo_link: e.target.value})} placeholder="http://..." />
                  </div>
                </div>

                <div className="form-group">
                  <label>我的备注</label>
                  <textarea 
                    value={manualForm.notes} 
                    onChange={e => setManualForm({...manualForm, notes: e.target.value})} 
                    placeholder="如：首日开场直接去排队，限量100份"
                    style={{ padding: '8px', border: '2px solid var(--border)', fontFamily: 'monospace', resize: 'vertical', minHeight: '60px' }}
                  />
                </div>

                <button type="submit" className="neo-button full-width" style={{ marginTop: '12px' }}>
                  确认添加商品
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="neo-button full-width" style={{ padding: '16px', fontSize: '18px' }} onClick={() => navigate('/shopping')}>
          查看待购清单 ➔
        </button>
      </div>

      <style>{`
        .page-container {
          padding: 16px;
          padding-bottom: 80px; 
          overflow-y: auto;
          flex: 1;
        }
        .header {
          padding: 12px;
          margin-bottom: 20px;
          background: var(--primary);
          color: white;
          text-align: center;
        }
        .header h2 { margin: 0; font-family: 'Courier New', monospace; font-size: 24px; }
        .section {
          padding: 16px;
          margin-bottom: 20px;
        }
        .section h3 { margin: 0 0 8px 0; font-size: 18px; color: var(--secondary); border-bottom: 2px solid var(--border); padding-bottom: 4px; }
        .hint { font-size: 12px; color: #666; margin-bottom: 12px; line-height: 1.4; }
        .budget-input {
          font-size: 24px;
          font-weight: bold;
          border: none;
          outline: none;
          flex: 1;
          font-family: 'Courier New', monospace;
        }
        .input-row {
          display: flex;
          align-items: center;
          border-bottom: 2px solid var(--border);
          padding-bottom: 4px;
          gap: 8px;
        }
        .full-width {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .options-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .accordion-item {
          background: #fff;
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }
        .accordion-content {
          padding: 0 16px 16px 16px;
          border-top: 1px dashed var(--border);
          margin-top: 8px;
          padding-top: 16px;
        }

        .paste-area {
          width: 100%;
          height: 100px;
          border: 2px solid var(--border);
          padding: 8px;
          font-family: monospace;
          margin-bottom: 12px;
          resize: none;
        }
        .paste-area:focus { outline: none; border-color: var(--primary); }

        .manual-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-row {
          display: flex;
          gap: 12px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .form-group label {
          font-size: 12px;
          font-weight: bold;
          color: #555;
        }
        .form-group.required label:after {
          content: ' *';
          color: red;
        }
        .form-group input, .form-group select {
          padding: 8px;
          border: 2px solid var(--border);
          font-family: 'Courier New', monospace;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
