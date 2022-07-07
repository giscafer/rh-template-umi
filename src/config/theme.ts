// Theme for antd: https://ant.design/docs/react/customize-theme-cn

const { getThemeVariables } = require('antd/dist/theme');
const theme = getThemeVariables({
  // compact: true,
});

Object.assign(theme, {
  // -------- Colors -----------
  // 'primary-color': '#00B259',
  'info-color': '#3377FF',
  'success-color': '#00B259',
  'warning-color': '#EFC100',
  'error-color': '#E60000',
  'normal-color': '#9EA5B2',
  'text-color-secondary': '#505363',
  'disabled-color': '#C6CCD7',
  // 'primary-disabled-color': '#daf2e6',
  'danger-disabled-color': '#e67373',
  'divider-color': '#EBECEF',
  'border-color-base': '#D4D9E2',
  'border-color-split': '#EBECEF',
  'tabs-background-color': '#f9f9fb',
  // Base Scaffolding Variables
  'font-family': `微软雅黑,苹方-简,宋体,PingFangSC,Microsoft yahei,Simsun,Helvetica Neue,Arial`,

  // -------- Border -----------
  'outline-width': '1px',
  'border-radius-base': '0',
  // -------- Modal -----------
  'modal-header-title-font-size': '20px',
  'modal-header-border-width': '0px',
  'modal-header-padding-vertical': '24px',
  'modal-header-padding-horizontal': '40px',
  'modal-body-padding': '8px 40px',
  'modal-footer-border-width': '0px',
  'modal-footer-padding-vertical': '24px',
  'modal-footer-padding-horizontal': '40px',
  'table-header-cell-split-color': 'transparent',
});

export default theme;

const rhRed = '#e50113'; // '#C6000B'
const rhBlue = '#386BD7';
const greenColor = '#00b259';

export const colorSet = [rhBlue, greenColor, rhRed];
