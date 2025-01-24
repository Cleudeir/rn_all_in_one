import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const GPT = () => {
  const baseUrl: string = 'https://ai.apps.tec.br/';
  const whitelist: string[] = [];

  return <CustomWebView baseUrl={baseUrl} whitelist={whitelist} />;
};
