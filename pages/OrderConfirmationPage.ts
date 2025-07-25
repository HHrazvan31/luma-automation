import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  readonly orderNumber: Locator;
  readonly confirmationMessage: Locator;
  readonly thankYouMessage: Locator;
  readonly pageTitle: Locator;
  readonly orderDetails: Locator;
  readonly continueShoppingButton: Locator;
  readonly createAccountSection: Locator;
  readonly orderSummary: Locator;
  readonly printOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.orderNumber = page.locator('.checkout-success .order-number');
    this.confirmationMessage = page.locator('.checkout-success h1');
    
    // Specific selector for "Thank you for your purchase!" message
    this.thankYouMessage = page.locator('[data-ui-id="page-title-wrapper"]');
    this.pageTitle = page.locator('.page-title-wrapper h1.page-title');
    
    this.orderDetails = page.locator('.checkout-success .order-details');
    this.continueShoppingButton = page.locator('.checkout-success .continue');
    this.createAccountSection = page.locator('.checkout-success .actions');
    this.orderSummary = page.locator('.checkout-success .order-summary');
    this.printOrderButton = page.locator('.print');
  }

  async getOrderNumber(): Promise<string> {
    const orderNumberText = await this.orderNumber.textContent() || '';
    return orderNumberText.replace(/\D/g, '');
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.confirmationMessage.textContent() || '';
  }

  async getThankYouMessage(): Promise<string> {
    return await this.thankYouMessage.textContent() || '';
  }

  async isThankYouMessageVisible(): Promise<boolean> {
    return await this.thankYouMessage.isVisible();
  }

  async waitForThankYouMessage() {
    await this.thankYouMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.waitForPageLoad();
  }

  async isOrderConfirmed(): Promise<boolean> {
    return await this.confirmationMessage.isVisible() && 
           await this.orderNumber.isVisible();
  }

  async printOrder() {
    await this.printOrderButton.click();
  }

  async waitForConfirmationPage() {
    await this.page.waitForURL('**/checkout/onepage/success/**');
    await this.waitForThankYouMessage();
    await this.confirmationMessage.waitFor({ state: 'visible' });
  }
}