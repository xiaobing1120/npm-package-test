import React, { useEffect, useRef, useState } from 'react';
import { useReactNode } from '@antv/x6-react-shape';

interface MindMapNodeProps {
  label: string;
  selected?: boolean;
}

export const MindMapNode: React.FC<MindMapNodeProps> = ({ label, selected }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { node } = useReactNode();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (node && value.trim()) {
      node.setAttrByPath('body/label', value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(label);
      setEditing(false);
    }
  };

  return (
    <div
      className={`mind-map-node ${selected ? 'selected' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="node-input"
        />
      ) : (
        <span className="node-label">{label}</span>
      )}
    </div>
  );
};

export default MindMapNode;
