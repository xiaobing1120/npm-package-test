import { useEffect, useState } from "react";
import styles from './index.module.less'


interface Props {
  label: string;
  desc: string;
  level: string;
}

const ChildNode =(props: Props) => {
  const { label, desc, level } = props
  const [width, setWidth] = useState(0)

  // 添加文字宽度计算函数
  const calculateTextWidth = (text: string, fontSize = 12) => {
    /*const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // console.log('text', text, fontSize)
    if (ctx) {
      ctx.font = `${fontSize}px`; // Size
      return ctx.measureText(text).width;
    }*/
    return (text || '').length * fontSize; // 简单估算
  };

  useEffect(() => {
    const labelWidth = calculateTextWidth(label, 14);
    const descWidth = calculateTextWidth(desc, 12);
    const levelWidth = calculateTextWidth(level, 12);
    const maxWidth = Math.max(labelWidth, descWidth, levelWidth);
    // const minWidth = Math.min(labelWidth, descWidth, levelWidth);

    console.log('label', label)
    console.log('desc', desc)
    console.log('level', level)
    // console.log(desc, 'desc')
    // console.log(level, 'level')
    // console.log(maxWidth, '1111111111')

    setWidth(maxWidth + 16)
  }, [label, desc, level])


  return (
    <div className={styles.childNode} style={{ width: `${width}px` }}>
      <span className='label'>{label}</span>
      {desc ? <span className='desc'>{desc}</span> : null}
      {level ? <span className='level'>{level}</span> : null}
    </div>
  )
}

export default ChildNode
