import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShoppingCartPage extends BasePage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly removeButtons: Locator;
  readonly updateCartButton: Locator;
  readonly subtotal: Locator;
  readonly grandTotal: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly discountSection: Locator;
  readonly couponCodeInput: Locator;
  readonly applyCouponButton: Locator;
  readonly estimateShippingSection: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
    this.itemNames = page.locator('.product-item-name a');
    this.itemPrices = page.locator('.cart-price .price');
    this.itemQuantities = page.locator('.qty input');
    this.removeButtons = page.locator('.action-delete');
    this.updateCartButton = page.locator('[name="update_cart_action"]');
    this.subtotal = page.locator('.totals .sub .price');
    this.grandTotal = page.locator('.grand.totals .price');
    this.proceedToCheckoutButton = page.locator('.checkout-methods-items .action.primary.checkout');
    this.continueShoppingButton = page.locator('.continue-shopping-link');
    this.emptyCartMessage = page.locator('.cart-empty');
    this.discountSection = page.locator('#block-discount');
    this.couponCodeInput = page.locator('#coupon_code');
    this.applyCouponButton = page.locator('#discount-coupon-form button');
    this.estimateShippingSection = page.locator('#block-shipping');
  }

  async navigateToCart() {
    await this.goto('/checkout/cart/');
    await this.waitForPageLoad();
  }

  async updateQuantity(itemIndex: number, quantity: number) {
    await this.itemQuantities.nth(itemIndex).clear();
    await this.itemQuantities.nth(itemIndex).fill(quantity.toString());
    await this.updateCartButton.click();
    await this.waitForPageLoad();
  }

  async removeItem(itemIndex: number) {
    await this.removeButtons.nth(itemIndex).click();
    await this.waitForPageLoad();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
    await this.waitForPageLoad();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemName(itemIndex: number): Promise<string> {
    return await this.itemNames.nth(itemIndex).textContent() || '';
  }

  async getSubtotal(): Promise<string> {
    return await this.subtotal.textContent() || '';
  }

  async getGrandTotal(): Promise<string> {
    return await this.grandTotal.textContent() || '';
  }

  async applyCouponCode(couponCode: string) {
    await this.couponCodeInput.fill(couponCode);
    await this.applyCouponButton.click();
    await this.waitForPageLoad();
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.waitForPageLoad();
  }
}