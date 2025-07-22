import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

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

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#customer-email');
    this.firstNameInput = page.locator('input[name="firstname"]');
    this.lastNameInput = page.locator('input[name="lastname"]');
    this.streetAddressInput = page.locator('input[name="street[0]"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateDropdown = page.locator('select[name="region_id"]');
    this.zipCodeInput = page.locator('input[name="postcode"]');
    this.countryDropdown = page.locator('select[name="country_id"]');
    this.phoneInput = page.locator('input[name="telephone"]');
    this.shippingMethodOptions = page.locator('.shipping-method');
    this.nextButton = page.locator('.continue');
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
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  }) {
    await this.emailInput.fill(addressData.email);
    await this.firstNameInput.fill(addressData.firstName);
    await this.lastNameInput.fill(addressData.lastName);
    await this.streetAddressInput.fill(addressData.street);
    await this.cityInput.fill(addressData.city);
    await this.stateDropdown.selectOption(addressData.state);
    await this.zipCodeInput.fill(addressData.zipCode);
    await this.countryDropdown.selectOption(addressData.country);
    await this.phoneInput.fill(addressData.phone);
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
}