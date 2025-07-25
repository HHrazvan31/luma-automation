import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;
  readonly sizeOptions: Locator;
  readonly colorOptions: Locator;
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly addToCompareButton: Locator;
  readonly productImages: Locator;
  readonly reviewsSection: Locator;
  readonly moreInformationTab: Locator;
  readonly reviewsTab: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.page-title');
    this.productPrice = page.locator('.price-final_price .price');
    this.productDescription = page.locator('.product-info-main .product-info-price + div');
    this.quantityInput = page.locator('#qty');
    this.sizeOptions = page.locator('.swatch-attribute.size .swatch-option');
    this.colorOptions = page.locator('.swatch-attribute.color .swatch-option');
    this.addToCartButton = page.locator('#product-addtocart-button');
    this.addToWishlistButton = page.locator('.action.towishlist');
    this.addToCompareButton = page.locator('.action.tocompare');
    this.productImages = page.locator('.product-image-main img');
    this.reviewsSection = page.locator('.reviews-wrapper');
    this.moreInformationTab = page.locator('#tab-label-additional');
    this.reviewsTab = page.locator('#tab-label-reviews');
    this.successMessage = page.locator('.message-success');
  }

  async selectSize(size: string) {
    const sizeOption = this.page.locator(`.swatch-attribute.size .swatch-option[option-label="${size}"]`);
    await sizeOption.click();
    await this.page.waitForTimeout(500); // Wait for selection to register
  }

  async selectSizeByIndex(index: number) {
    const sizeOptions = this.page.locator('.swatch-attribute.size .swatch-option');
    await sizeOptions.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async selectColor(color: string) {
    const colorOption = this.page.locator(`.swatch-attribute.color .swatch-option[option-label="${color}"]`);
    await colorOption.click();
    await this.page.waitForTimeout(500);
  }

  async selectColorByIndex(index: number) {
    const colorOptions = this.page.locator('.swatch-attribute.color .swatch-option');
    await colorOptions.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async selectFirstAvailableSize() {
    try {
      const sizeOptions = this.page.locator('.swatch-attribute.size .swatch-option');
      await sizeOptions.first().waitFor({ state: 'visible', timeout: 5000 });
      const count = await sizeOptions.count();
      if (count > 0) {
        await sizeOptions.first().click();
        await this.page.waitForTimeout(1000); // Wait for selection to register
        console.log('Selected first available size');
      }
    } catch (error) {
      console.log('No size options available or already selected');
    }
  }

  async selectFirstAvailableColor() {
    try {
      const colorOptions = this.page.locator('.swatch-attribute.color .swatch-option');
      await colorOptions.first().waitFor({ state: 'visible', timeout: 5000 });
      const count = await colorOptions.count();
      if (count > 0) {
        await colorOptions.first().click();
        await this.page.waitForTimeout(1000); // Wait for selection to register
        console.log('Selected first available color');
      }
    } catch (error) {
      console.log('No color options available or already selected');
    }
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart() {
    // Wait for the add to cart button to be enabled after selecting options
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if button is enabled (might be disabled if required options not selected)
    const isEnabled = await this.addToCartButton.isEnabled();
    if (!isEnabled) {
      console.log('Add to cart button is disabled, checking for missing required options');
      // Try to select any missing required options
      await this.selectFirstAvailableSize();
      await this.selectFirstAvailableColor();
      await this.page.waitForTimeout(1000);
    }
    
    await this.addToCartButton.click();
    console.log('Clicked Add to Cart button');
  }

  async addToCartWithOptions(size?: string, color?: string, quantity?: number) {
    await this.waitForOptionsToLoad();
    
    if (size) {
      await this.selectSize(size);
    } else {
      await this.selectFirstAvailableSize();
    }
    
    if (color) {
      await this.selectColor(color);
    } else {
      await this.selectFirstAvailableColor();
    }
    
    if (quantity) {
      await this.setQuantity(quantity);
    }
    
    await this.addToCart();
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async addToCartWithDefaults() {
    await this.waitForOptionsToLoad();
    await this.selectFirstAvailableSize();
    await this.selectFirstAvailableColor();
    await this.addToCart();
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async isAddToCartButtonEnabled(): Promise<boolean> {
    return await this.addToCartButton.isEnabled();
  }

  async getAvailableSizes(): Promise<string[]> {
    const sizeElements = this.page.locator('.swatch-attribute.size .swatch-option');
    const sizes = await sizeElements.evaluateAll(elements => 
      elements.map(el => el.getAttribute('option-label') || el.textContent?.trim() || '')
    );
    return sizes.filter(size => size !== '');
  }

  async getAvailableColors(): Promise<string[]> {
    const colorElements = this.page.locator('.swatch-attribute.color .swatch-option');
    const colors = await colorElements.evaluateAll(elements => 
      elements.map(el => el.getAttribute('option-label') || el.getAttribute('aria-label') || '')
    );
    return colors.filter(color => color !== '');
  }

  async isSizeSelected(size: string): Promise<boolean> {
    const sizeOption = this.page.locator(`.swatch-attribute.size .swatch-option[option-label="${size}"]`);
    return await sizeOption.getAttribute('class').then(className => 
      className?.includes('selected') || false
    );
  }

  async isColorSelected(color: string): Promise<boolean> {
    const colorOption = this.page.locator(`.swatch-attribute.color .swatch-option[option-label="${color}"]`);
    return await colorOption.getAttribute('class').then(className => 
      className?.includes('selected') || false
    );
  }

  async waitForOptionsToLoad() {
    await this.page.waitForSelector('.swatch-attribute', { timeout: 5000 });
  }

  async addToWishlist() {
    await this.addToWishlistButton.click();
  }
}