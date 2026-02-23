import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Graph, Node, Edge } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Scroller } from '@antv/x6-plugin-scroller';
import { MindMapNode } from './MindMapNode';
import { Toolbar } from './Toolbar';
import styles from './styles.module.css';

// 注册自定义 React 节点
ReactShape.register({
  shape: 'mind-map-node',
  width: 120,
  height: 50,
  component: MindMapNode,
});

interface MindMapData {
  id: string;
  label: string;
  children?: MindMapData[];
}

interface MindMapProps {
  initialData?: MindMapData;
  onDataChange?: (data: MindMapData) => void;
}

export const MindMap: React.FC<MindMapProps> = ({
                                                  initialData,
                                                  onDataChange
                                                }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);

  // 默认数据
  const defaultData: MindMapData = {
    id: 'root',
    label: '中心主题',
    children: [
      { id: 'node-1', label: '分支一', children: [] },
      { id: 'node-2', label: '分支二', children: [
          { id: 'node-2-1', label: '子分支', children: [] }
        ]},
      { id: 'node-3', label: '分支三', children: [] },
    ],
  };

  // 初始化思维导图
  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      background: {
        color: '#fafafa',
      },
      grid: {
        visible: true,
        type: 'dot',
        args: {
          color: '#e0e0e0',
          thickness: 1,
        },
      },
      panning: {
        enabled: true,
        eventTypes: ['rightMouseDown'],
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        connector: 'smooth',
        connectionPoint: 'boundary',
        createEdge() {
          return new Edge({
            shape: 'smooth',
            attrs: {
              line: {
                stroke: '#667eea',
                strokeWidth: 2,
              },
            },
          });
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    });

    // 添加插件
    graph.use(
      new Keyboard({
        enabled: true,
        global: true,
      })
    );

    graph.use(
      new Selection({
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
      })
    );

    graph.use(
      new Snapline({
        enabled: true,
      })
    );

    graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: false,
      })
    );

    graphRef.current = graph;

    // 加载初始数据
    const data = initialData || defaultData;
    loadMindMapData(data);

    // 监听选择变化
    graph.on('selection:changed', ({ selected }) => {
      setSelectedCount(selected.length);
    });

    // 监听节点双击编辑
    graph.on('node:dblclick', ({ node }) => {
      // 触发节点编辑
    });

    // 窗口大小变化
    const handleResize = () => {
      if (containerRef.current) {
        graph.resize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      graph.dispose();
    };
  }, []);

  // 加载思维导图数据
  const loadMindMapData = useCallback((data: MindMapData) => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.clearCells();

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, { x: number; y: number }>();

    // 递归创建节点
    const createNodes = (
      nodeData: MindMapData,
      parentX: number,
      parentY: number,
      level: number,
      siblingIndex: number,
      totalSiblings: number
    ) => {
      const nodeWidth = 120;
      const nodeHeight = 50;
      const horizontalGap = 200;
      const verticalGap = 80;

      // 计算节点位置
      let x, y;
      if (level === 0) {
        x = 400;
        y = 300;
      } else {
        x = parentX + horizontalGap;
        // 根据兄弟节点数量分配垂直位置
        const startY = parentY - ((totalSiblings - 1) * verticalGap) / 2;
        y = startY + siblingIndex * verticalGap;
      }

      const node = graph.createNode({
        id: nodeData.id,
        shape: 'mind-map-node',
        x,
        y,
        width: nodeWidth,
        height: nodeHeight,
        attrs: {
          body: {
            label: nodeData.label,
          },
        },
        data: {
          level,
          parentId: level > 0 ? nodes[nodes.length - 1]?.id : null,
        },
      });

      nodes.push(node);
      nodeMap.set(nodeData.id, { x, y });

      // 创建边
      if (level > 0 && nodes.length > 1) {
        const parentNode = nodes.find(n => n.id === node.data?.parentId);
        if (parentNode) {
          const edge = graph.createEdge({
            source: parentNode.id,
            target: nodeData.id,
            attrs: {
              line: {
                stroke: '#667eea',
                strokeWidth: 2,
              },
            },
          });
          edges.push(edge);
        }
      }

      // 处理子节点
      if (nodeData.children && nodeData.children.length > 0) {
        nodeData.children.forEach((child, index) => {
          createNodes(child, x, y, level + 1, index, nodeData.children!.length);
        });
      }
    };

    createNodes(data, 0, 0, 0, 0, 1);

    graph.addCells([...nodes, ...edges]);
    graph.zoomToFit({ padding: 50 });
  }, []);

  // 添加子节点
  const addNode = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const selected = graph.getSelectedCells();
    if (selected.length === 0) {
      alert('请先选择一个节点');
      return;
    }

    const parentNode = selected[0] as Node;
    const newNodeId = `node-${Date.now()}`;

    const newNode = graph.createNode({
      id: newNodeId,
      shape: 'mind-map-node',
      x: parentNode.getPosition().x + 200,
      y: parentNode.getPosition().y,
      width: 120,
      height: 50,
      attrs: {
        body: {
          label: '新节点',
        },
      },
      data: {
        level: (parentNode.getData()?.level || 0) + 1,
        parentId: parentNode.id,
      },
    });

    const newEdge = graph.createEdge({
      source: parentNode.id,
      target: newNodeId,
      attrs: {
        line: {
          stroke: '#667eea',
          strokeWidth: 2,
        },
      },
    });

    graph.addCells([newNode, newEdge]);
    graph.select(newNode);

    // 触发数据更新
    exportData();
  }, []);

  // 删除节点
  const deleteNode = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const selected = graph.getSelectedCells();
    if (selected.length === 0) {
      alert('请先选择要删除的节点');
      return;
    }

    // 不允许删除根节点
    const root = graph.getNodes().find(node => {
      const edges = graph.getIncomingEdges(node);
      return !edges || edges.length === 0;
    });

    if (root && selected.includes(root)) {
      alert('不能删除根节点');
      return;
    }

    // 递归删除子节点
    const cellsToDelete = new Set(selected);

    selected.forEach(cell => {
      if (cell.isNode()) {
        const children = getChildrenNodes(cell as Node);
        children.forEach(child => cellsToDelete.add(child));
      }
    });

    graph.removeCells(Array.from(cellsToDelete));
    exportData();
  }, []);

  // 获取子节点
  const getChildrenNodes = (node: Node): Node[] => {
    const graph = graphRef.current;
    if (!graph) return [];

    const children: Node[] = [];
    const outgoingEdges = graph.getOutgoingEdges(node);

    if (outgoingEdges) {
      outgoingEdges.forEach(edge => {
        const target = edge.getTargetNode();
        if (target) {
          children.push(target);
          children.push(...getChildrenNodes(target));
        }
      });
    }

    return children;
  };

  // 放大
  const zoomIn = useCallback(() => {
    const graph = graphRef.current;
    if (graph) {
      graph.zoom(0.2);
    }
  }, []);

  // 缩小
  const zoomOut = useCallback(() => {
    const graph = graphRef.current;
    if (graph) {
      graph.zoom(-0.2);
    }
  }, []);

  // 适应屏幕
  const fitCenter = useCallback(() => {
    const graph = graphRef.current;
    if (graph) {
      graph.zoomToFit({ padding: 50 });
      graph.centerContent();
    }
  }, []);

  // 导出数据
  const exportData = useCallback((): MindMapData | null => {
    const graph = graphRef.current;
    if (!graph) return null;

    const nodes = graph.getNodes();
    const root = nodes.find(node => {
      const edges = graph.getIncomingEdges(node);
      return !edges || edges.length === 0;
    });

    if (!root) return null;

    const buildTree = (node: Node): MindMapData => {
      const children: MindMapData[] = [];
      const outgoingEdges = graph.getOutgoingEdges(node);

      if (outgoingEdges) {
        outgoingEdges.forEach(edge => {
          const target = edge.getTargetNode();
          if (target) {
            children.push(buildTree(target));
          }
        });
      }

      return {
        id: node.id,
        label: node.getAttrByPath('body/label') || '未命名',
        children: children.length > 0 ? children : undefined,
      };
    };

    const data = buildTree(root);
    onDataChange?.(data);
    return data;
  }, [onDataChange]);

  // 键盘快捷键
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    // Tab 添加子节点
    graph.bindKey('tab', () => {
      addNode();
      return false;
    });

    // Delete/Backspace 删除节点
    graph.bindKey('delete', () => {
      deleteNode();
      return false;
    });

    graph.bindKey('backspace', () => {
      deleteNode();
      return false;
    });

    // Enter 编辑节点
    graph.bindKey('enter', () => {
      const selected = graph.getSelectedCells();
      if (selected.length === 1 && selected[0].isNode()) {
        // 触发编辑
      }
      return false;
    });

    // Ctrl+A 全选
    graph.bindKey('ctrl+a', () => {
      graph.selectCells();
      return false;
    });

    // Ctrl+C 复制
    graph.bindKey('ctrl+c', () => {
      const cells = graph.getSelectedCells();
      if (cells.length > 0) {
        graph.copy(cells);
      }
      return false;
    });

    // Ctrl+V 粘贴
    graph.bindKey('ctrl+v', () => {
      const cells = graph.getClipboard();
      if (cells.length > 0) {
        const pastedCells = graph.paste({ offset: 32 });
        graph.select(pastedCells);
      }
      return false;
    });

    // Ctrl+Z 撤销
    graph.bindKey('ctrl+z', () => {
      // 需要配合 history 插件
      return false;
    });

    return () => {
      graph.unbindKey('tab');
      graph.unbindKey('delete');
      graph.unbindKey('backspace');
      graph.unbindKey('enter');
      graph.unbindKey('ctrl+a');
      graph.unbindKey('ctrl+c');
      graph.unbindKey('ctrl+v');
      graph.unbindKey('ctrl+z');
    };
  }, [addNode, deleteNode]);

  return (
    <div className={styles.container}>
      <Toolbar
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitCenter={fitCenter}
        onExport={() => exportData()}
        selectedCount={selectedCount}
      />
      <div
        ref={containerRef}
        className={styles.graphContainer}
      />
    </div>
  );
};

export default MindMap;
