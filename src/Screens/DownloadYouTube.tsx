import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const DownloadYouTube = () => {
  const _baseUrl: string = 'https://yt1d.com/';
  const _whitelist: string[] = [
    'https://an18.genyoutube.online/',
    'https://an',
    'https://rr',
  ];

  return <CustomWebView baseUrl={_baseUrl} whitelist={_whitelist} />;
};
