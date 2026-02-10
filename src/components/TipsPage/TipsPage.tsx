import React from 'react';
import { Result } from 'antd';

import { useSearchParams  } from 'react-router-dom';


const TipsPage: React.FC = () => {
  let [searchParams] = useSearchParams();

  return (
    <Result
      className="not-found-page"
      status={(searchParams.get("status") as any) || "error"}
      title={decodeURIComponent((searchParams.get("title") || '') as string)}
      subTitle={decodeURIComponent((searchParams.get("subTitle") ||'') as string)}
    />
  );
};

export default TipsPage;
