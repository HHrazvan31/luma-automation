import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductListPage extends BasePage {
  readonly productGrid: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly filterSidebar: Locator;
  readonly paginationToolbar: Locator;
  readonly viewModeButtons: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.productGrid = page.locator('.products-grid');
    this.productItems = page.locator('.product-item');
    this.sortDropdown = page.locator('#sorter');
    this.filterSidebar = page.locator('.sidebar-main');
    this.paginationToolbar = page.locator('.toolbar-products');
    this.viewModeButtons = page.locator('.modes');
    this.productTitles = page.locator('.product-item-link');
    this.productPrices = page.locator('.price');
    this.addToCartButtons = page.locator('button[title="Add to Cart"]');
  }

  async selectProduct(productName: string) {
    await this.productTitles.filter({ hasText: productName }).first().click();
    await this.waitForPageLoad();
  }

  async selectProductByIndex(index: number) {
    await this.productTitles.nth(index).click();
    await this.waitForPageLoad();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async sortBy(sortOption: string) {
    await this.sortDropdown.selectOption({ label: sortOption });
    await this.waitForPageLoad();
  }

  async applyPriceFilter(minPrice: string, maxPrice: string) {
    const priceFilter = this.filterSidebar.locator('[data-role="priceSlider"]');
    await priceFilter.locator('input').first().fill(minPrice);
    await priceFilter.locator('input').last().fill(maxPrice);
    await priceFilter.locator('button').click();
    await this.waitForPageLoad();
  }

  async getFirstProductName(): Promise<string> {
    return await this.productTitles.first().textContent() || '';
  }

  async getFirstProductPrice(): Promise<string> {
    return await this.productPrices.first().textContent() || '';
  }
}