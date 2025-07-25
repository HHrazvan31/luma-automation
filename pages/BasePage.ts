import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('.page-header');
    this.footer = page.locator('.page-footer');
    this.loadingSpinner = page.locator('.loading-mask');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (error) {
      // If networkidle fails, try domcontentloaded as fallback
      console.log('Networkidle timeout, falling back to domcontentloaded');
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    }
  }

  async waitForLoadingToComplete() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}