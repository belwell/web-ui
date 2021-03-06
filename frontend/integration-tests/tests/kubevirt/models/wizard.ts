/* eslint-disable no-unused-vars, no-undef */
import { browser, ExpectedConditions as until } from 'protractor';

import { createItemButton } from '../../../views/crud.view';
import { fillInput, PAGE_LOAD_TIMEOUT, selectDropdownOption, tickCheckbox } from '../utils';
import * as wizardView from '../../../views/kubevirt/wizard.view';

export default class Wizard {
  async openWizard() {
    await createItemButton.click().then(() => wizardView.createWithWizardLink.click());
    await browser.wait(until.presenceOf(wizardView.nameInput));
  }

  async close() {
    await wizardView.closeWizard.click();
    await browser.wait(until.invisibilityOf(wizardView.wizardHeader), PAGE_LOAD_TIMEOUT);
  }

  async fillName(name: string) {
    await fillInput(wizardView.nameInput, name);
  }

  async filldescription(description: string) {
    await fillInput(wizardView.description, description);
  }

  async selectNamespace(namespace: string) {
    await selectDropdownOption(wizardView.namespaceDropdownId, namespace);
  }

  async selectTemplate(template: string) {
    await selectDropdownOption(wizardView.templateDropdownId, template);
  }

  async selectOperatingSystem(operatingSystem: string) {
    await selectDropdownOption(wizardView.operatingSystemDropdownId, operatingSystem);
  }

  async selectFlavor(flavor: string) {
    await selectDropdownOption(wizardView.flavorDropdownId, flavor);
  }

  async selectWorkloadProfile(workloadProfile: string) {
    await selectDropdownOption(wizardView.workloadProfileDropdownId, workloadProfile);
  }

  async selectProvisionSource(provisionOptions) {
    await selectDropdownOption(wizardView.provisionSourceDropdownId, provisionOptions.method);
    if (provisionOptions.hasOwnProperty('source')) {
      await fillInput(wizardView.provisionSources[provisionOptions.method], provisionOptions.source);
    }
  }

  async startOnCreation() {
    await tickCheckbox(wizardView.startVMOnCreation);
  }

  async useCloudInit(cloudInitOptions) {
    await tickCheckbox(wizardView.useCloudInit);
    if (cloudInitOptions.useCustomScript) {
      await tickCheckbox(wizardView.useCustomScript);
      await fillInput(wizardView.customCloudInitScript, cloudInitOptions.customScript);
    } else {
      await fillInput(wizardView.cloudInitHostname, cloudInitOptions.hostname);
      await fillInput(wizardView.cloudInitSSH, cloudInitOptions.ssh);
    }
  }

  async next() {
    await wizardView.nextButton.click();
  }

  async addNIC(name: string, mac: string, networkDefinition: string) {
    await wizardView.createNIC.click();
    const rowsCount = await this.getTableRowsCount();
    // Dropdown selection needs to be first due to https://github.com/kubevirt/web-ui-components/issues/9
    await wizardView.selectTableDropdownAttribute(rowsCount, 'network', networkDefinition);
    await wizardView.setTableInputAttribute(rowsCount, 'name', name);
    await wizardView.setTableInputAttribute(rowsCount, 'mac', mac);
    await wizardView.apply.click();
  }

  async selectPxeNIC(networkDefinition: string) {
    await selectDropdownOption(wizardView.pxeNICDropdownId, networkDefinition);
  }

  async getTableRowsCount() {
    return await wizardView.tableRowsCount();
  }

  async addDisk(name: string, size: string, storageClass: string) {
    await wizardView.createDisk.click();
    const rowsCount = await this.getTableRowsCount();
    // Dropdown selection needs to be first due to https://github.com/kubevirt/web-ui-components/issues/9
    await wizardView.selectTableDropdownAttribute(rowsCount, 'storage', storageClass);
    await wizardView.setTableInputAttribute(rowsCount, 'name', name);
    await wizardView.setTableInputAttribute(rowsCount, 'size', size);
    await wizardView.apply.click();
  }

  async editDisk(rowNumber: number, attribute: string, value: string) {
    await wizardView.activateTableRow(rowNumber - 1);
    await wizardView.setTableInputAttribute(rowNumber, attribute, value);
    await wizardView.apply.click();
  }

  async waitForCreation() {
    await browser.wait(until.elementToBeClickable(wizardView.nextButton), PAGE_LOAD_TIMEOUT);
  }
}
