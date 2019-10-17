import * as React from 'react';

const PageHeader = ({ title, extra }) => <div className='flex-wrap space-between'>
    <h1>{title}</h1>
    <div>{extra}</div>
</div>;

export default PageHeader;