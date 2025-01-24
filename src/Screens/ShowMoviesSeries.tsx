import React from 'react';
import {CustomWebView} from '../Components/WebView';

export const ShowMoviesSeries = () => {
  const _baseUrl: string = 'https://overflixtv.one/';
  const _whitelist: string[] = [];
  return <CustomWebView baseUrl={_baseUrl} whitelist={_whitelist} />;
};
