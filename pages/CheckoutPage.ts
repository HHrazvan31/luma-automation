import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestDataGenerator } from '../utils/TestDataGenerator';

export class CheckoutPage extends BasePage {
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateDropdown: Locator;
  readonly zipCodeInput: Locator;
  readonly countryDropdown: Locator;
  readonly phoneInput: Locator;
  readonly shippingMethodOptions: Locator;
  readonly nextButton: Locator;
  readonly placeOrderButton: Locator;
  readonly orderSummary: Locator;
  readonly paymentMethods: Locator;
  readonly billingAddressSection: Locator;
  readonly sameAsShippingCheckbox: Locator;
  readonly createAccountCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly loadingMask: Locator;
  readonly companyInput: Locator;
  readonly streetAddressLine2Input: Locator;
  readonly streetAddressLine3Input: Locator;
  readonly regionTextInput: Locator;
  readonly shippingForm: Locator;

  constructor(page: Page) {
    super(page);
    
    this.shippingForm = page.locator('#co-shipping-form');
    this.emailInput = page.locator('#co-shipping-form #customer-email').first();
    this.firstNameInput = page.locator('#co-shipping-form input[name="firstname"]');
    this.lastNameInput = page.locator('#co-shipping-form input[name="lastname"]');
    this.companyInput = page.locator('#co-shipping-form input[name="company"]');
    this.streetAddressInput = page.locator('#co-shipping-form input[name="street[0]"]');
    this.streetAddressLine2Input = page.locator('#co-shipping-form input[name="street[1]"]');
    this.streetAddressLine3Input = page.locator('#co-shipping-form input[name="street[2]"]');
    this.cityInput = page.locator('#co-shipping-form input[name="city"]');
    this.stateDropdown = page.locator('#co-shipping-form select[name="region_id"]');
    this.regionTextInput = page.locator('#co-shipping-form input[name="region"]');
    this.zipCodeInput = page.locator('#co-shipping-form input[name="postcode"]');
    this.countryDropdown = page.locator('#co-shipping-form select[name="country_id"]');
    this.phoneInput = page.locator('#co-shipping-form input[name="telephone"]');
    
    this.shippingMethodOptions = page.locator('.shipping-method');
    this.nextButton = page.locator('button[data-role="opc-continue"]');
    this.placeOrderButton = page.locator('.action.primary.checkout');
    
    this.orderSummary = page.locator('.opc-summary-wrapper');
    this.paymentMethods = page.locator('.payment-methods');
    this.billingAddressSection = page.locator('.billing-address-details');
    this.sameAsShippingCheckbox = page.locator('#billing-address-same-as-shipping-checkmo');
    this.createAccountCheckbox = page.locator('#create_account');
    this.passwordInput = page.locator('#customer-password');
    this.confirmPasswordInput = page.locator('#password-confirmation');
    this.loadingMask = page.locator('.loading-mask');
  }

  async fillShippingAddress(addressData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    streetLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
  }) {
    if (addressData.email) await this.emailInput.fill(addressData.email);
    if (addressData.firstName) await this.firstNameInput.fill(addressData.firstName);
    if (addressData.lastName) await this.lastNameInput.fill(addressData.lastName);
    if (addressData.company) await this.companyInput.fill(addressData.company);
    if (addressData.street) await this.streetAddressInput.fill(addressData.street);
    if (addressData.streetLine2) await this.streetAddressLine2Input.fill(addressData.streetLine2);
    if (addressData.city) await this.cityInput.fill(addressData.city);
    
    if (addressData.country) {
      await this.selectCountry(addressData.country);
    }
    if (addressData.state) {
      await this.selectState(addressData.state);
    }
    
    if (addressData.zipCode) await this.zipCodeInput.fill(addressData.zipCode);
    if (addressData.phone) await this.phoneInput.fill(addressData.phone);
  }

  async selectShippingMethod(methodName: string) {
    await this.shippingMethodOptions.filter({ hasText: methodName }).locator('input').check();
    await this.waitForLoadingToComplete();
  }

  async proceedToPayment() {
    await this.nextButton.click();
    await this.waitForLoadingToComplete();
  }

  async selectPaymentMethod(methodName: string) {
    await this.paymentMethods.locator(`input[value*="${methodName}"]`).check();
    await this.waitForLoadingToComplete();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.waitForPageLoad();
  }

  async enableBillingAddressSameAsShipping(enabled: boolean = true) {
    if (enabled) {
      await this.sameAsShippingCheckbox.check();
    } else {
      await this.sameAsShippingCheckbox.uncheck();
    }
  }

  async enableCreateAccount(enabled: boolean = true, password?: string) {
    if (enabled) {
      await this.createAccountCheckbox.check();
      if (password) {
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
      }
    } else {
      await this.createAccountCheckbox.uncheck();
    }
  }

  async getOrderSummaryTotal(): Promise<string> {
    return await this.orderSummary.locator('.grand.totals .price').textContent() || '';
  }

  async waitForCheckoutPageLoad() {
    await this.page.waitForSelector('#customer-email', { state: 'visible' });
    await this.waitForLoadingToComplete();
  }

  async isPlaceOrderButtonEnabled(): Promise<boolean> {
    return await this.placeOrderButton.isEnabled();
  }

  async fillForm(overrides: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    streetLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
  } = {}) {
    const testData = TestDataGenerator.getTestCustomerData();
    
    const formData = {
      email: overrides.email || testData.email,
      firstName: overrides.firstName || testData.firstName,
      lastName: overrides.lastName || testData.lastName,
      company: overrides.company || '',
      street: overrides.street || testData.street,
      streetLine2: overrides.streetLine2 || '',
      city: overrides.city || testData.city,
      state: overrides.state || testData.state,
      zipCode: overrides.zipCode || testData.zipCode,
      country: overrides.country || testData.country,
      phone: overrides.phone || testData.phone
    };

    await this.fillShippingAddress(formData);
    return formData;
  }

  async selectCountry(countryName: string) {
    await this.countryDropdown.selectOption({ label: countryName });
    await this.page.waitForTimeout(1000);
  }

  async selectCountryByCode(countryCode: string) {
    await this.countryDropdown.selectOption({ value: countryCode });
    await this.page.waitForTimeout(1000);
  }

  async selectState(stateName: string) {
    await this.page.waitForSelector('select[name="region_id"] option:not([value=""])', { timeout: 5000 });
    await this.stateDropdown.selectOption({ label: stateName });
  }

  async selectStateByValue(stateValue: string) {
    await this.stateDropdown.selectOption({ value: stateValue });
  }

  async selectRomania() {
    await this.selectCountry('Romania');
  }

  async selectRomaniaState(stateName: string) {
    await this.selectRomania();
    await this.selectState(stateName);
  }

  async selectClujState() {
    await this.selectRomaniaState('Cluj');
  }

  async fillFormWithRomanianData(overrides: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    streetLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
  } = {}) {
    return await this.fillForm({
      ...overrides,
      country: 'Romania',
      state: overrides.state || 'Cluj'
    });
  }

  async waitForShippingFormReady() {
    try {
      await this.page.waitForURL('**/checkout/**', { timeout: 10000 });
      await this.shippingForm.waitFor({ state: 'visible', timeout: 15000 });
      await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      console.log('Error waiting for shipping form, checking if elements are available:', error);
      if (this.page.url().includes('checkout')) {
        console.log('On checkout page, proceeding despite form visibility issues');
      } else {
        throw error;
      }
    }
  }

  async testMethod() {
    return 'test';
  }
}