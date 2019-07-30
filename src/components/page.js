import * as React from 'react';
import BreadcrumbBar from './breadcrumb-bar';

const page = ({ children }) => <div style={{ width: '100%', padding: '30px 30px 30px 50px' }}>
  <BreadcrumbBar />
  <br />
  {children}
</div>

export default page;