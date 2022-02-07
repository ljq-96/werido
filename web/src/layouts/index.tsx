import React from 'react';
import { IRouteComponentProps } from 'umi';

export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  return (
    <React.Fragment>
      <h1>asdf</h1>
      {children}
    </React.Fragment>
  );
}
