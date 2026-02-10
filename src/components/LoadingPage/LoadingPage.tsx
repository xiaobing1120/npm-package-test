import React from 'react';
import PomeloJump from '@/assets/pomelo-jump.png';

import './index.less';

const LoadingPage: React.FC = () => {
  return (
    <div>
      <div className="loading-container">
        <img
          src={PomeloJump}
          style={{ width: '80px', height: '80px' }}
          alt="loading.gif"
        />
        <div className="loading-text">&nbsp;加载中...</div>
      </div>
    </div>
  );
};

export default LoadingPage;
