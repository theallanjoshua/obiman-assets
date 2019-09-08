import * as React from 'react';
import BreadcrumbBar from './breadcrumb-bar';

const page = ({ children }) => <div style={{ width: '100%', padding: '30px' }}>
  <BreadcrumbBar />
  <br />
  {children}
</div>

export default page;