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
    await this.sizeOptions.filter({ hasText: size }).click();
  }

  async selectColor(color: string) {
    await this.colorOptions.locator(`[aria-label*="${color}"]`).click();
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async addToCartWithOptions(size?: string, color?: string, quantity?: number) {
    if (size) await this.selectSize(size);
    if (color) await this.selectColor(color);
    if (quantity) await this.setQuantity(quantity);
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
    const sizes = await this.sizeOptions.allTextContents();
    return sizes.filter(size => size.trim() !== '');
  }

  async addToWishlist() {
    await this.addToWishlistButton.click();
  }
}