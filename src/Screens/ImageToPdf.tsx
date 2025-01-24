import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const ImageToPdf = () => {
  const _baseUrl: string = 'https://imagetopdf.apps.tec.br/';
  const _whitelist: string[] = [];
  return <CustomWebView baseUrl={_baseUrl} whitelist={_whitelist} />;
};
