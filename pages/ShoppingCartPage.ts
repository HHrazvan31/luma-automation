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
  
  // Minicart elements
  readonly minicartToggle: Locator;
  readonly minicartDropdown: Locator;
  readonly minicartProceedToCheckoutButton: Locator;
  readonly minicartViewCartButton: Locator;
  readonly minicartCloseButton: Locator;
  readonly minicartItems: Locator;
  readonly minicartSubtotal: Locator;

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
    
    // Minicart selectors
    this.minicartToggle = page.locator('.minicart-wrapper .action.showcart');
    this.minicartDropdown = page.locator('#ui-id-1');
    this.minicartProceedToCheckoutButton = page.locator('#top-cart-btn-checkout');
    this.minicartViewCartButton = page.locator('.action.viewcart');
    this.minicartCloseButton = page.locator('#btn-minicart-close');
    this.minicartItems = page.locator('#mini-cart .item');
    this.minicartSubtotal = page.locator('.subtotal .amount .price');
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

  async proceedToCheckoutFromCart() {
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

  // Minicart methods
  async openMinicart() {
    // Check if minicart is already open
    if (await this.minicartDropdown.isVisible({ timeout: 1000 })) {
      console.log('Minicart is already open');
      return;
    }
    
    console.log('Opening minicart...');
    await this.minicartToggle.waitFor({ state: 'visible', timeout: 5000 });
    await this.minicartToggle.click();
    await this.minicartDropdown.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Minicart opened successfully');
  }

  async closeMinicart() {
    await this.minicartCloseButton.click();
    await this.minicartDropdown.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async proceedToCheckoutFromMinicart() {
    console.log('Opening minicart for checkout...');
    await this.openMinicart();
    
    // Wait for the checkout button to be visible
    await this.minicartProceedToCheckoutButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Minicart checkout button found, clicking...');
    
    await this.minicartProceedToCheckoutButton.click();
    console.log('Clicked minicart checkout button');
    
    await this.waitForPageLoad();
  }

  async viewCartFromMinicart() {
    await this.openMinicart();
    await this.minicartViewCartButton.click();
    await this.waitForPageLoad();
  }

  async getMinicartItemCount(): Promise<number> {
    await this.openMinicart();
    return await this.minicartItems.count();
  }

  async getMinicartSubtotal(): Promise<string> {
    await this.openMinicart();
    return await this.minicartSubtotal.textContent() || '';
  }

  async isMinicartOpen(): Promise<boolean> {
    return await this.minicartDropdown.isVisible();
  }

  async waitForMinicartUpdate() {
    await this.page.waitForTimeout(1000);
    await this.page.waitForSelector('.minicart-wrapper .counter-number', { timeout: 5000 });
  }

  // Enhanced proceedToCheckout method that uses minicart by default
  async proceedToCheckout() {
    try {
      // First try to use minicart (faster and more common flow)
      console.log('Attempting to proceed to checkout via minicart...');
      await this.proceedToCheckoutFromMinicart();
      console.log('Successfully proceeded to checkout via minicart');
    } catch (error) {
      console.log('Minicart checkout failed, trying full cart page fallback:', error);
      // Fallback to full cart page if minicart fails
      await this.navigateToCart();
      await this.proceedToCheckoutFromCart();
      console.log('Successfully proceeded to checkout via full cart');
    }
  }
}