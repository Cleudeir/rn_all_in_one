import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const BomberMan = () => {
  const _baseUrl: string =
    'https://www.retrogames.cc/embed/9293-neo-bomberman.html';
  const _whitelist: string[] = [];
  return <CustomWebView baseUrl={_baseUrl} whitelist={_whitelist} isIframe />;
};
