import { $, $$ } from 'protractor';
import { selectDropdownOption } from '../../tests/kubevirt/utils';

// Wizard Common
export const closeWizard = $('.close');
export const wizardContent = $('.wizard-pf-contents');
export const wizardHeader = $('.modal-header');
export const provisionResult = $('.wizard-pf-body h3');
export const nextButton = $('.wizard-pf-footer > button:last-child');
export const apply = $('.inline-edit-buttons > button:first-child');
export const cancelButton = $('.inline-edit-buttons > button:last-child');

// Basic Settings tab
export const createWithWizardLink = $('#wizard-link');
export const createWithYAMLLink = $('#yaml-link');

export const nameInput = $('#vm-name');
export const description = $('#vm-description');

const provisionSourceURL = $('#provision-source-url');
const provisionSourceContainerImage = $('#provision-source-container');
export const provisionSources = {
  'URL': provisionSourceURL,
  'Container': provisionSourceContainerImage,
};

export const namespaceDropdownId = '#namespace-dropdown';
export const provisionSourceDropdownId = '#image-source-type-dropdown';
export const operatingSystemDropdownId = '#operating-system-dropdown';
export const templateDropdownId = '#template-dropdown';
export const flavorDropdownId = '#flavor-dropdown';
export const workloadProfileDropdownId = '#workload-profile-dropdown';

export const startVMOnCreation = $('#start-vm');
export const useCloudInit = $('#use-cloud-init');
export const useCustomScript = $('#use-cloud-init-custom-script');
export const customCloudInitScript = $('#cloud-init-custom-script');
export const cloudInitHostname = $('#cloud-init-hostname');
export const cloudInitSSH = $('#cloud-init-ssh');

// Networking tab
export const createNIC = $('#create-network-btn');
export const pxeNICDropdownId = '#pxe-nic-dropdown';

// Storage tab
export const attachDisk = $('#attach-disk-btn');
export const createDisk = $('#create-storage-btn');

// Tables
export const tableRowsCount = () => $$('.kubevirt-editable-table tbody tr').count();
export const activateTableRow = (rowNumber: number) => $$('.kubevirt-editable-table tbody tr').get(rowNumber).click();
/**
 * Sets an attribute of a disk (name, size) on a given row.
 * @param  {number}    rowNumber     Number of row to select, indexed from 1 for the first row.
 * @param  {string}    attribute     Attribute name - size or name.
 * @param  {string}    value         Value to set.
 * @throws {Error}                   Will throw an Error when input for selected attribute doesn't exist.
 */
export const setTableInputAttribute = async(rowNumber: number, attribute: string, value: string) => {
  const attributeField = `#${attribute}-edit-${rowNumber}-row`;
  if (!await $(attributeField).isPresent()) {
    throw new Error(`Element ${attributeField} is not present.`);
  }
  await $(attributeField).clear().then(() => $(attributeField).sendKeys(value));
};

/**
 * Selects an dropdown attribute of an entity (disk, NIC) on a given row.
 * @param {number}    rowNumber     Number of row to select, indexed from 1 for the first row.
 * @param {string}    tableType     Type of resource table (network, storage, ...).
 * @param {string}    attribute     Attribute name - size, name, mac.
 * @param {string}    value         Value to set.
 */
export const selectTableDropdownAttribute = async(rowNumber: number, tableType: string, value: string) => {
  await selectDropdownOption(`#${tableType}-edit-${rowNumber.toString()}-row`, value);
};

// VMs List view
export const firstRowVMStatus = $('div.co-m-row:first-child > div:first-child > div:nth-child(3)');
