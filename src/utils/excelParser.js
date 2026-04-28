import * as XLSX from 'xlsx';

/**
 * 预期 Excel 格式:
 * 展馆, 街道字母, 摊位号, 制品名, 价格, 热度, 种类, IP标签, CP标签
 */
export const parseExcelV2 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const boothsMap = new Map();
        const items = [];
        
        jsonData.forEach((row, index) => {
          const hall = String(row['展馆'] || '2');
          const street = String(row['街道字母'] || 'A').toUpperCase();
          const number = String(row['摊位号'] || '00');
          const boothId = `${hall}-${street}${number}`;

          const heat = parseInt(row['热度']) || 0;

          if (!boothsMap.has(boothId)) {
            boothsMap.set(boothId, {
              booth_id: boothId,
              zone: '一期',
              hall: hall,
              street: street,
              number: number,
              name: `${hall}-${street}${number}`,
              max_heat: heat
            });
          } else {
            const b = boothsMap.get(boothId);
            if (heat > b.max_heat) b.max_heat = heat;
          }
          
          if (row['制品名']) {
            items.push({
              item_id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              booth_id: boothId,
              name: row['制品名'],
              price: parseFloat(row['价格']) || 0,
              cpp_heat: heat,
              type: row['种类'] || '谷子',
              ip_tags: row['IP标签'] ? String(row['IP标签']).split(/[，,]/).map(t => t.trim()) : [],
              cp_tags: row['CP标签'] ? String(row['CP标签']).split(/[，,]/).map(t => t.trim()) : [],
              phase: row['所属展期'] || '一期',
              promo_link: row['宣摊链接'] || '',
              notes: row['我的备注'] || '',
              daily_stock: row['单日售卖数量'] ? parseInt(row['单日售卖数量']) : null,
              has_online_sales: row['是否会通贩'] || '',
              status: 0,
              is_s_tier: false
            });
          }
        });
        
        resolve({
          booths: Array.from(boothsMap.values()),
          items: items
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseClipboardText = (text) => {
  const items = [];
  const booths = [];
  
  const lines = text.split('\n');
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const boothMatch = line.match(/(\d+)-([a-zA-Z])(\d+)/);
    const priceMatch = line.match(/(?:¥|￥)(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)r/i);
    const heatMatch = line.match(/(?:🔥|热度)\s*(\d+)/);

    const hall = boothMatch ? boothMatch[1] : '4';
    const street = boothMatch ? boothMatch[2].toUpperCase() : 'A';
    const number = boothMatch ? boothMatch[3] : '00';
    const boothId = `${hall}-${street}${number}`;

    const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[2]) : 0;
    const heat = heatMatch ? parseInt(heatMatch[1]) : 0;

    booths.push({
      booth_id: boothId,
      hall,
      street,
      number,
      name: boothId,
      max_heat: heat
    });

    items.push({
      item_id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      booth_id: boothId,
      name: line.substring(0, 20) + '...',
      price,
      cpp_heat: heat,
      status: 0,
      is_s_tier: false,
    });
  });

  return { items, booths };
};
