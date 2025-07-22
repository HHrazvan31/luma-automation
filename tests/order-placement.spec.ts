import { test, expect } from '@playwright/test';
import { 
  HomePage, 
  ProductListPage, 
  ProductDetailPage, 
  ShoppingCartPage, 
  CheckoutPage, 
  OrderConfirmationPage 
} from '../pages';
import { TestDataGenerator, TestHelpers } from '../utils';


test.describe('Order Placement Regression Tests', () => {
  let homePage: HomePage;
  let productListPage: ProductListPage;
  let productDetailPage: ProductDetailPage;
  let shoppingCartPage: ShoppingCartPage;
  let checkoutPage: CheckoutPage;
  let orderConfirmationPage: OrderConfirmationPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productListPage = new ProductListPage(page);
    productDetailPage = new ProductDetailPage(page);
    shoppingCartPage = new ShoppingCartPage(page);
    checkoutPage = new CheckoutPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);

    await homePage.navigateToHome();
    await TestHelpers.acceptCookies(page);
  });

  test('Complete order placement flow with single product', async ({ page }) => {
    // Navigate to Men's section and select a product
    await homePage.navigateToMenCategory();
    await productListPage.selectProductByIndex(0);

    // Configure product and add to cart
    const productName = await productDetailPage.getProductName();
    const availableSizes = await productDetailPage.getAvailableSizes();
    
    if (availableSizes.length > 0) {
      await productDetailPage.selectSize(availableSizes[0]);
    }
    
    const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
    const colorCount = await colorOptions.count();
    if (colorCount > 0) {
      await colorOptions.first().click();
    }

    await productDetailPage.addToCart();
    await expect(productDetailPage.successMessage).toBeVisible();

    // Go to cart
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toHaveCount(1);

    // Proceed to checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    // Fill shipping information
    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    // Select shipping method
    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000); // Wait for shipping methods to load
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    // Proceed to payment
    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000); // Wait for payment section to load

    // Select payment method and place order
    const paymentMethods = page.locator('.payment-methods input[type="radio"]');
    const paymentMethodCount = await paymentMethods.count();
    if (paymentMethodCount > 0) {
      await paymentMethods.first().check();
    }

    await page.waitForTimeout(1000);
    await checkoutPage.placeOrder();

    // Verify order confirmation
    await orderConfirmationPage.waitForConfirmationPage();
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
    
    const orderNumber = await orderConfirmationPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    expect(orderNumber.length).toBeGreaterThan(0);
  });

  test('Add multiple products to cart and complete order', async ({ page }) => {
    const productsToAdd = 3;
    
    // Add multiple products to cart
    for (let i = 0; i < productsToAdd; i++) {
      // Navigate to Women's section (TODO: implement navigateToWomenCategory)
    await homePage.navigationMenu.locator('a:has-text("Women")').click();
    await homePage.waitForPageLoad();
      await productListPage.selectProductByIndex(i);

      const availableSizes = await productDetailPage.getAvailableSizes();
      if (availableSizes.length > 0) {
        await productDetailPage.selectSize(availableSizes[0]);
      }

      const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
      const colorCount = await colorOptions.count();
      if (colorCount > 0) {
        await colorOptions.first().click();
      }

      await productDetailPage.addToCart();
      await expect(productDetailPage.successMessage).toBeVisible();
    }

    // Verify cart contents
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toHaveCount(productsToAdd);

    // Proceed with checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000);
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000);

    const paymentMethods = page.locator('.payment-methods input[type="radio"]');
    const paymentMethodCount = await paymentMethods.count();
    if (paymentMethodCount > 0) {
      await paymentMethods.first().check();
    }

    await page.waitForTimeout(1000);
    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmationPage();
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
    
    const orderNumber = await orderConfirmationPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
  });

  test('Modify cart contents before checkout', async ({ page }) => {
    // Add products to cart
    await homePage.navigateToMenCategory();
    await productListPage.selectProductByIndex(0);

    const availableSizes = await productDetailPage.getAvailableSizes();
    if (availableSizes.length > 0) {
      await productDetailPage.selectSize(availableSizes[0]);
    }

    const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
    const colorCount = await colorOptions.count();
    if (colorCount > 0) {
      await colorOptions.first().click();
    }

    await productDetailPage.setQuantity(2);
    await productDetailPage.addToCart();
    await expect(productDetailPage.successMessage).toBeVisible();

    // Go to cart and verify quantity
    await shoppingCartPage.navigateToCart();
    const initialCount = await shoppingCartPage.getCartItemCount();
    expect(initialCount).toBe(1);

    // Update quantity
    await shoppingCartPage.updateQuantity(0, 3);
    
    // Proceed with checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000);
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000);

    const paymentMethods = page.locator('.payment-methods input[type="radio"]');
    const paymentMethodCount = await paymentMethods.count();
    if (paymentMethodCount > 0) {
      await paymentMethods.first().check();
    }

    await page.waitForTimeout(1000);
    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmationPage();
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });

  test('Test checkout with guest user account creation option', async ({ page }) => {
    // Navigate to Women's section (TODO: implement navigateToWomenCategory)
    await homePage.navigationMenu.locator('a:has-text("Women")').click();
    await homePage.waitForPageLoad();
    await productListPage.selectProductByIndex(0);

    const availableSizes = await productDetailPage.getAvailableSizes();
    if (availableSizes.length > 0) {
      await productDetailPage.selectSize(availableSizes[0]);
    }

    const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
    const colorCount = await colorOptions.count();
    if (colorCount > 0) {
      await colorOptions.first().click();
    }

    await productDetailPage.addToCart();
    await expect(productDetailPage.successMessage).toBeVisible();

    await shoppingCartPage.navigateToCart();
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    // Enable account creation
    await checkoutPage.enableCreateAccount(true, testCustomer.password);

    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000);
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000);

    const paymentMethods = page.locator('.payment-methods input[type="radio"]');
    const paymentMethodCount = await paymentMethods.count();
    if (paymentMethodCount > 0) {
      await paymentMethods.first().check();
    }

    await page.waitForTimeout(1000);
    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmationPage();
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });

  test('Verify order totals and pricing calculations', async ({ page }) => {
    await homePage.navigateToMenCategory();
    await productListPage.selectProductByIndex(0);

    const productPrice = await productDetailPage.getProductPrice();
    
    const availableSizes = await productDetailPage.getAvailableSizes();
    if (availableSizes.length > 0) {
      await productDetailPage.selectSize(availableSizes[0]);
    }

    const colorOptions = page.locator('.swatch-attribute.color .swatch-option');
    const colorCount = await colorOptions.count();
    if (colorCount > 0) {
      await colorOptions.first().click();
    }

    const quantity = 2;
    await productDetailPage.setQuantity(quantity);
    await productDetailPage.addToCart();
    await expect(productDetailPage.successMessage).toBeVisible();

    await shoppingCartPage.navigateToCart();
    const cartSubtotal = await shoppingCartPage.getSubtotal();
    
    // Verify cart calculations
    expect(cartSubtotal).toBeTruthy();

    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000);
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000);

    // Verify order summary totals
    const orderTotal = await checkoutPage.getOrderSummaryTotal();
    expect(orderTotal).toBeTruthy();

    const paymentMethods = page.locator('.payment-methods input[type="radio"]');
    const paymentMethodCount = await paymentMethods.count();
    if (paymentMethodCount > 0) {
      await paymentMethods.first().check();
    }

    await page.waitForTimeout(1000);
    await checkoutPage.placeOrder();

    await orderConfirmationPage.waitForConfirmationPage();
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });
});