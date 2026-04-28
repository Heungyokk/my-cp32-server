import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CoverPage() {
  const navigate = useNavigate();

  return (
    <div className="cover-page">
      <div className="scanlines"></div>

      {/* 漂浮的同人展元素装饰 */}
      <motion.div className="deco deco-1" animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }}>📖</motion.div>
      <motion.div className="deco deco-2" animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>🎨</motion.div>
      <motion.div className="deco deco-3" animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>✨</motion.div>
      <motion.div className="deco deco-4" animate={{ y: [0, 14, 0], rotate: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>🛍️</motion.div>
      <motion.div className="deco deco-5" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>💫</motion.div>
      <motion.div className="deco deco-6" animate={{ y: [0, 8, 0], rotate: [0, 12, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>🎪</motion.div>
      
      <div className="cover-content">
        <motion.h1 
          className="glitch-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CP32
          <br/>
          <span className="title-sub">购物助手</span>
        </motion.h1>
        
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          - 线下同人展专属购物工具 -<br/>
          一键录入 · 智能分类 · 预算核算
        </motion.p>

        <motion.button 
          className="neo-button start-btn"
          onClick={() => navigate('/add')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          [ 开始购物之旅 ]
        </motion.button>
      </div>

      <style>{`
        .cover-page {
          height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fef6e4 0%, #f3d2c1 50%, #f5cac3 100%);
          position: relative;
          overflow: hidden;
        }

        /* 漂浮装饰 */
        .deco {
          position: absolute;
          font-size: 40px;
          opacity: 0.3;
          z-index: 1;
          pointer-events: none;
        }
        .deco-1 { top: 10%; left: 8%; font-size: 48px; }
        .deco-2 { top: 18%; right: 12%; font-size: 36px; }
        .deco-3 { bottom: 25%; left: 15%; font-size: 32px; }
        .deco-4 { bottom: 15%; right: 10%; font-size: 44px; }
        .deco-5 { top: 40%; left: 5%; font-size: 28px; }
        .deco-6 { top: 60%; right: 8%; font-size: 38px; }

        .scanlines {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.03) 50%,
            rgba(0,0,0,0.03)
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 10;
        }

        .cover-content {
          position: relative;
          z-index: 20;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .glitch-title {
          font-family: 'Courier New', monospace;
          font-size: 80px;
          margin: 0;
          line-height: 1.1;
          color: var(--text);
          text-shadow: 
            4px 4px 0px #fff,
            8px 8px 0px var(--primary);
        }

        .title-sub {
          font-size: 40px;
          color: var(--primary);
        }

        .subtitle {
          font-family: monospace;
          font-weight: bold;
          color: #555;
          margin: 40px 0;
          line-height: 1.6;
          border: 2px solid var(--border);
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          box-shadow: 4px 4px 0px var(--secondary);
        }

        .start-btn {
          font-size: 24px;
          padding: 16px 32px;
          border-width: 4px;
          background: var(--primary);
          color: #fff;
          border-color: var(--border);
          box-shadow: 6px 6px 0px var(--shadow-color);
        }
      `}</style>
    </div>
  );
}
