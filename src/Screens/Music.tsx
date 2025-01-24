import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const Music = () => {
  const baseUrl: string = 'https://music.apps.tec.br/';
  const whitelist: string[] = [];

  return <CustomWebView baseUrl={baseUrl} whitelist={whitelist} />;
};
