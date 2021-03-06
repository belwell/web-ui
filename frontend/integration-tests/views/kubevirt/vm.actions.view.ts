import { $, $$, browser, ExpectedConditions as until } from 'protractor';
import { rowForName, confirmAction } from '../crud.view';

export const detailViewVmStatus = $('#details-column-1 .kubevirt-vm-status__link');
export const detailViewVmIcon = (statusIcon: string) => $('#details-column-1').$(statusIcon);

export const listViewVmStatus = (name: string) => rowForName(name).$('.kubevirt-vm-status__link');
export const listViewVmIcon = (name: string, statusIcon: string) => rowForName(name).$(statusIcon);

export const statusIcon = '.kubevirt-vm-status__icon';
export const runningIcon = '.pficon-on-running';
export const offIcon = '.pficon-off';
export const pendingIcon = '.pficon-pending';

const listViewKebabDropdown = '.co-kebab__button';
const listViewKebabDropdownMenu = '.co-kebab__dropdown';
const detailViewDropdown = '.co-m-nav-title  button';
const detailViewDropdownMenu = '.dropdown-menu-right';

/**
 * Selects option link from given dropdown element.
 */
const selectDropdownItem = (getActionsDropdown, getActionsDropdownMenu) => async(action) => {
  await getActionsDropdown().click();
  await getActionsDropdownMenu().$$('a').filter(link => link.getText().then(text => text.startsWith(action))).first().click();
};

/**
 * Performs action for VM via list view kebab menu.
 */
export const listViewAction = (name) => async(action) => {
  const getActionsDropdown = () => rowForName(name).$$(listViewKebabDropdown).first();
  const getActionsDropdownMenu = () => rowForName(name).$(listViewKebabDropdownMenu);
  await selectDropdownItem(getActionsDropdown, getActionsDropdownMenu)(action);
  await confirmAction();
  await browser.wait(until.not(until.presenceOf(rowForName(name).$(listViewKebabDropdownMenu))));
};

/**
 * Performs action for VM on its detail page.
 */
export const detailViewAction = async(action) => {
  const getActionsDropdown = () => $$(detailViewDropdown).first();
  const getActionsDropdownMenu = () => $(detailViewDropdownMenu);
  await selectDropdownItem(getActionsDropdown, getActionsDropdownMenu)(action);
  await confirmAction();
  await browser.wait(until.not(until.presenceOf($(detailViewDropdownMenu))));
};

