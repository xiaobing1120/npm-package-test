import React from 'react'
import { Graph } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const data = {
      nodes: [
        {
          id: 'node1',
          shape: 'rect',
          x: 40,
          y: 40,
          width: 100,
          height: 40,
          label: 'hello',
          attrs: {
            // body 是选择器名称，选中的是 rect 元素
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
        {
          id: 'node2',
          shape: 'rect',
          x: 160,
          y: 180,
          width: 100,
          height: 40,
          label: 'world111222222266333',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
        },
      ],
      edges: [
        {
          shape: 'edge',
          source: 'node1',
          target: 'node2',
          label: 'x6',
          attrs: {
            // line 是选择器名称，选中的边的 path 元素
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    }

    const graph = new Graph({
      container: this.container,
      width: 500,
      height: 300,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
    })

    graph.fromJSON(data) // 渲染元素
    graph.centerContent() // 居中显示
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app-content" ref={this.refContainer} />
    )
  }
}
