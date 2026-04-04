import { css } from '@emotion/react';

export const disabledBlackStyle = css`
  .ant-input-disabled,
  .ant-input-number-disabled,
  .ant-input-affix-wrapper-disabled,
  .ant-input-disabled input {
    color: rgba(0, 0, 0, 0.88) !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.88) !important;
    background-color: #fff !important;
  }

  .ant-select-disabled,
  .ant-select-selection-item {
    color: rgba(0, 0, 0, 0.88) !important;
    -webkit-text-fill-color: rgba(0, 0, 0, 0.88) !important;
    background-color: #fff !important;
  }
`;
