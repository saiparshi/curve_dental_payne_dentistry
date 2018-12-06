import { browser, by, element } from 'protractor';

export class PatientDetailPage {
  async navigateTo(id) {
    return browser.get(`/patients/${id}`);
  }

  async getTitleText() {
    return await element(by.css('drp-patient-detail .title')).getText();
  }
}
