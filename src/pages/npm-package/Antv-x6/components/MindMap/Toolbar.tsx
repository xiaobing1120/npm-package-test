import React from 'react';
import styles from './styles.module.css';

interface ToolbarProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitCenter: () => void;
  onExport: () => void;
  selectedCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
                                                  onAddNode,
                                                  onDeleteNode,
                                                  onZoomIn,
                                                  onZoomOut,
                                                  onFitCenter,
                                                  onExport,
                                                  selectedCount,
                                                }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        <button onClick={onAddNode} className={styles.btn} title="添加子节点 (Tab)">
          ➕ 添加节点
        </button>
        <button
          onClick={onDeleteNode}
          className={styles.btn}
          disabled={selectedCount === 0}
          title="删除节点 (Delete/Backspace)"
        >
          🗑️ 删除节点
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button onClick={onZoomIn} className={styles.btn} title="放大">
          🔍+
        </button>
        <button onClick={onZoomOut} className={styles.btn} title="缩小">
          🔍-
        </button>
        <button onClick={onFitCenter} className={styles.btn} title="适应屏幕">
          📐 适应
        </button>
      </div>

      <div className={styles.toolbarGroup}>
        <button onClick={onExport} className={styles.btn} title="导出 JSON">
          📥 导出
        </button>
      </div>

      <div className={styles.status}>
        已选择: {selectedCount} 个节点
      </div>
    </div>
  );
};

export default Toolbar;
