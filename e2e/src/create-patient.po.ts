import { browser, by, element } from 'protractor';

export class CreatePatientPage {
  async navigateTo() {
    return browser.get('/patients/new');
  }

  async getParagraphText() {
    return await element(by.css('drp-schedule-day .title')).getText();
  }

  async setFirstName(value) {
    await element(by.css('input[name="firstName"]')).sendKeys(value);
  }

  async setLastName(value) {
    await element(by.css('input[name="lastName"]')).sendKeys(value);
  }

  async setBirthDate(value) {
    await element(by.css('input[name="birthDate"]')).sendKeys(value);
  }

  async submitForm() {
    await element(by.css('button[type="submit"]')).click();
  }
}
