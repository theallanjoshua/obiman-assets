import * as React from 'react';
import { Icon, Input } from 'antd';

const { Search } = Input;

export const PAGE_ERROR = 'Something went wrong! Try refreshing the page. If the issue persists, raise out to us at some@email.com';
export const ADD_BUTTON_TEXT = 'Add';
export const SAVE_BUTTON_TEXT = 'Save';
export const DATE_TIME_FORMAT = 'MMM Do YYYY, h:mm a';
export const OBIMAN_LOGO = <h1
  className='center-align'
  style={{
    fontFamily: 'Megrim',
    fontSize: 'xx-large',
    color: 'inherit',
    background: 'inherit',
    marginBottom: 0,
    width: 'max-content',
    lineHeight: 'initial',
    padding: '5px 0px'
  }}
>
  O b i m a n
</h1>
export const DEFAULT_TABLE_FEATURES = (deriveSortByValue, deriveFilterByText, filterPlaceholder) => ({
  sorter: (a, b) => {
    const derivedA = deriveSortByValue(a);
    const derivedB = deriveSortByValue(b);
    return typeof derivedA === 'string' ? derivedA.localeCompare(derivedB) : derivedA - derivedB;
  },
  sortDirections: ['descend', 'ascend'],
  filterDropdown: ({ setSelectedKeys, confirm }) => <Search
    placeholder={filterPlaceholder}
    onSearch={value => {
      setSelectedKeys(value ? [value] : []);
      confirm();
    }}
  />,
  filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) => deriveFilterByText(record)
    .toString()
    .toLowerCase()
    .includes(value.toLowerCase()),
});