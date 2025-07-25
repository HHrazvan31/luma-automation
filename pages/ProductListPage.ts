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
    // More reliable product selection using the product-item-info container
    const productItem = this.page.locator('.product-item').nth(index);
    const productLink = productItem.locator('.product-item-link').first();
    
    // Ensure the product is visible and stable before clicking
    await productLink.waitFor({ state: 'visible', timeout: 10000 });
    await productLink.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Brief wait for stability
    
    await productLink.click();
    await this.waitForPageLoad();
  }

  async selectProductByName(productName: string) {
    const productLink = this.page.locator(`.product-item-link[title*="${productName}"]`);
    await productLink.click();
    await this.waitForPageLoad();
  }

  async selectProductFromGrid(index: number) {
    const productItem = this.productItems.nth(index);
    const productLink = productItem.locator('.product-item-link');
    await productLink.click();
    await this.waitForPageLoad();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const productLink = this.productTitles.nth(index);
    return await productLink.textContent() || '';
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    const productItem = this.productItems.nth(index);
    const priceElement = productItem.locator('.price');
    return await priceElement.textContent() || '';
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

  // Enhanced product selection methods
  async selectProductBySku(sku: string) {
    const productForm = this.page.locator(`form[data-product-sku="${sku}"]`);
    const productLink = productForm.locator('.. .product-item-link');
    await productLink.click();
    await this.waitForPageLoad();
  }

  async selectProductById(productId: string) {
    const productItem = this.page.locator('li.product-item').filter({ 
      has: this.page.locator(`[data-product-id="${productId}"]`) 
    });
    const productLink = productItem.locator('.product-item-link');
    await productLink.click();
    await this.waitForPageLoad();
  }

  async getProductListItem(index: number): Promise<Locator> {
    return this.page.locator('li.product-item').nth(index);
  }

  async getProductByText(productName: string): Promise<Locator> {
    return this.page.locator('li.product-item').filter({ hasText: productName });
  }

  async getProductByPriceRange(minPrice: number, maxPrice: number): Promise<Locator[]> {
    const products = this.page.locator('li.product-item');
    const count = await products.count();
    const matchingProducts: Locator[] = [];
    
    for (let i = 0; i < count; i++) {
      const product = products.nth(i);
      const priceText = await product.locator('.price').textContent() || '';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      if (price >= minPrice && price <= maxPrice) {
        matchingProducts.push(product);
      }
    }
    
    return matchingProducts;
  }
}