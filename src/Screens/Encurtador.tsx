import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const Encurtador = () => {
  const _baseUrl: string = 'https://link.apps.tec.br/';
  const _whitelist: string[] = [];
  return <CustomWebView baseUrl={_baseUrl} whitelist={_whitelist} />;
};
