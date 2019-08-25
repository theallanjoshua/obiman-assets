import * as React from 'react';

const PageHeader = ({ title, extra }) => <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <h1>{title}</h1>
    <div>{extra}</div>
</div>;

export default PageHeader;