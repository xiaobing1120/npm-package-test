import React, { useEffect, useRef, useState } from 'react';
import { Graph, Node, Edge } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Scroller } from '@antv/x6-plugin-scroller';
import './App.css';

// 自定义 React 节点组件
function MindMapNode({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <div className={`mind-node ${selected ? 'selected' : ''}`}>
      <span className="node-label">{label}</span>
    </div>
  );
}

// 注册自定义节点
ReactShape.register({
  shape: 'mind-node',
  width: 120,
  height: 40,
  component: MindMapNode,
});

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  // 初始化 Graph
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      background: { color: '#f5f5f5' },
      grid: { visible: true, type: 'dot', args: { color: '#e0e0e0' } },
      panning: { enabled: true, eventTypes: ['rightMouseDown'] },
      mousewheel: { enabled: true, zoomAtMousePosition: true, minScale: 0.5, maxScale: 3 },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        connector: 'smooth',
      },
    });

    // 使用插件
    graph.use(new Keyboard({ enabled: true }));
    graph.use(new Selection({ enabled: true, rubberband: true }));
    graph.use(new Scroller({ enabled: true }));

    graphRef.current = graph;

    // 监听选择变化
    graph.on('selection:changed', ({ selected }) => {
      setSelectedCount(selected.length);
    });

    // 初始化数据
    initData(graph);

    // 窗口 resize
    const handleResize = () => {
      if (containerRef.current) {
        graph.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      graph.dispose();
    };
  }, []);

  // 初始化思维导图数据
  const initData = (graph: Graph) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // 根节点
    const root = graph.createNode({
      id: 'root',
      shape: 'mind-node',
      x: 400,
      y: 300,
      width: 120,
      height: 40,
      label: '中心主题',
    });
    nodes.push(root);

    // 一级分支
    const branches = ['分支一', '分支二', '分支三'];
    branches.forEach((label, index) => {
      const node = graph.createNode({
        id: `node-${index}`,
        shape: 'mind-node',
        x: 600,
        y: 200 + index * 100,
        width: 120,
        height: 40,
        label,
      });
      nodes.push(node);

      const edge = graph.createEdge({
        source: 'root',
        target: `node-${index}`,
        attrs: { line: { stroke: '#667eea', strokeWidth: 2 } },
      });
      edges.push(edge);
    });

    graph.addCells([...nodes, ...edges]);
    graph.zoomToFit({ padding: 50 });
  };

  // 添加子节点
  const addNode = () => {
    const graph = graphRef.current;
    if (!graph) return;

    const selected = graph.getSelectedCells();
    if (selected.length === 0) {
      alert('请先选择一个节点');
      return;
    }

    const parentNode = selected[0] as Node;
    const newId = `node-${Date.now()}`;
    const parentPos = parentNode.getPosition();

    const newNode = graph.createNode({
      id: newId,
      shape: 'mind-node',
      x: parentPos.x + 180,
      y: parentPos.y,
      width: 120,
      height: 40,
      label: '新节点',
    });

    const newEdge = graph.createEdge({
      source: parentNode.id,
      target: newId,
      attrs: { line: { stroke: '#667eea', strokeWidth: 2 } },
    });

    graph.addCells([newNode, newEdge]);
    graph.select(newNode);
  };

  // 删除节点
  const deleteNode = () => {
    const graph = graphRef.current;
    if (!graph) return;

    const selected = graph.getSelectedCells();
    if (selected.length === 0) {
      alert('请先选择要删除的节点');
      return;
    }

    // 检查是否包含根节点
    const hasRoot = selected.some(cell => cell.id === 'root');
    if (hasRoot) {
      alert('不能删除根节点');
      return;
    }

    graph.removeCells(selected);
  };

  // 导出 JSON
  const exportData = () => {
    const graph = graphRef.current;
    if (!graph) return;
    const data = graph.toJSON();
    console.log('导出数据:', data);
    alert('数据已输出到控制台');
  };

  // 绑定快捷键
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.bindKey('tab', () => {
      addNode();
      return false;
    });

    graph.bindKey('delete', () => {
      deleteNode();
      return false;
    });

    graph.bindKey('backspace', () => {
      deleteNode();
      return false;
    });

    return () => {
      graph.unbindKey('tab');
      graph.unbindKey('delete');
      graph.unbindKey('backspace');
    };
  }, []);

  return (
    <div className="app-container">
      <div className="toolbar">
        <button onClick={addNode}>➕ 添加节点 (Tab)</button>
        <button onClick={deleteNode}>🗑️ 删除节点 (Del)</button>
        <button onClick={exportData}>📥 导出 JSON</button>
        <span className="status">已选择: {selectedCount} 个</span>
      </div>
      <div ref={containerRef} className="graph-container" />
    </div>
  );
}

export default App;
