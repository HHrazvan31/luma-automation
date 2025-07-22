import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly navigationMenu: Locator;
  readonly shoppingCartIcon: Locator;
  readonly accountIcon: Locator;
  readonly createAccountLink: Locator;
  readonly signInLink: Locator;
  readonly hotSellersSection: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('.hero');
    this.searchBox = page.locator('#search');
    this.searchButton = page.locator('button[title="Search"]');
    this.navigationMenu = page.locator('.navigation');
    this.shoppingCartIcon = page.locator('.showcart');
    this.accountIcon = page.locator('.customer-welcome');
    this.createAccountLink = page.locator('a[href*="customer/account/create"]');
    this.signInLink = page.locator('a[href*="customer/account/login"]');
    this.hotSellersSection = page.locator('.home-main .products-grid');
  }

  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async searchForProduct(productName: string) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async navigateToMenCategory() {
    await this.page.locator('#ui-id-5').click();
    await this.waitForPageLoad();
  }

  async goToSignIn() {
    await this.signInLink.click();
    await this.waitForPageLoad();
  }

  async goToCreateAccount() {
    await this.createAccountLink.click();
    await this.waitForPageLoad();
  }

  async openShoppingCart() {
    await this.shoppingCartIcon.click();
  }
}