import { browser, by, element } from 'protractor';

export class PatientListPage {
  async navigateTo() {
    return browser.get('/patients');
  }

  async selectPatientByName(firstName, lastName) {
    await element(by.cssContainingText('drp-patient-thumbnail .card-title', `${lastName}, ${firstName}`)).click();
  }
}
