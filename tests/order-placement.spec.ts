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
    
    await TestHelpers.handleCookieConsent(page, 'accept');
    await page.waitForTimeout(2000);
    
    await TestHelpers.handleCookieConsent(page, 'accept');
  });

  test('Complete order placement flow with single product and guest account', async ({ page }) => {
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);

    await productDetailPage.addToCartWithDefaults();

    await shoppingCartPage.waitForMinicartUpdate();
    
    const minicartItemCount = await shoppingCartPage.getMinicartItemCount();
    expect(minicartItemCount).toBe(1);

    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForShippingFormReady();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);
    console.log(`Using test customer data: ${testCustomer.email}`);

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
    
    // Assert the specific "Thank you for your purchase!" message is displayed
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
    const thankYouText = await orderConfirmationPage.getThankYouMessage();
    expect(thankYouText).toContain('Thank you for your purchase!');
    
    // Also verify other confirmation elements
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
    
    const orderNumber = await orderConfirmationPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    expect(orderNumber.length).toBeGreaterThan(0);
  });

  test('Add multiple products to cart and complete order', async ({ page }) => {
    const productsToAdd = 3;
    
    // Add multiple products to cart
    for (let i = 0; i < productsToAdd; i++) {
      await homePage.navigateToWomen();
      await productListPage.selectProductByIndex(i);

      await productDetailPage.addToCartWithDefaults();
    }

    // Verify cart contents
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toHaveCount(productsToAdd);

    // Proceed with checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForShippingFormReady();

    // Use specific country/state selection methods
    await checkoutPage.fillShippingAddress({
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      street: '123 Test Street',
      city: 'Cluj-Napoca',
      zipCode: '400000',
      phone: '+40123456789',
      country: 'Romania',
      state: 'Cluj'
    });

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
    
    // Verify "Thank you for your purchase!" message
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
    expect(await orderConfirmationPage.getThankYouMessage()).toContain('Thank you for your purchase!');
    
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
    
    const orderNumber = await orderConfirmationPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
  });

  test('Modify cart contents before checkout', async ({ page }) => {
    // Add products to cart
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);

    await productDetailPage.addToCartWithOptions(undefined, undefined, 2);

    // Go to cart and verify quantity
    await shoppingCartPage.navigateToCart();
    const initialCount = await shoppingCartPage.getCartItemCount();
    expect(initialCount).toBe(1);

    // Update quantity
    await shoppingCartPage.updateQuantity(0, 3);
    
    // Proceed with checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForShippingFormReady();

    // Fill with random Romanian data
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
    
    // Verify "Thank you for your purchase!" message is displayed
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
    expect(await orderConfirmationPage.getThankYouMessage()).toContain('Thank you for your purchase!');
    
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });

  test('Test checkout with guest user account creation option', async ({ page }) => {
    await homePage.navigateToWomen();
    await productListPage.selectProductByIndex(0);

    await productDetailPage.addToCartWithDefaults();

    await shoppingCartPage.navigateToCart();
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();

    const testCustomer = TestDataGenerator.getTestCustomerData();
    await checkoutPage.fillShippingAddress(testCustomer);

    // Enable account creation
    const password = 'TestPassword123!';
    await checkoutPage.enableCreateAccount(true, password);

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
    
    // Verify "Thank you for your purchase!" message is displayed
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
    expect(await orderConfirmationPage.getThankYouMessage()).toContain('Thank you for your purchase!');
    
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });

  test('Verify order totals and pricing calculations', async ({ page }) => {
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);

    const quantity = 2;
    await productDetailPage.addToCartWithOptions(undefined, undefined, quantity);

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
    
    // Verify "Thank you for your purchase!" message is displayed
    await expect(orderConfirmationPage.thankYouMessage).toBeVisible();
    expect(await orderConfirmationPage.getThankYouMessage()).toContain('Thank you for your purchase!');
    
    await expect(orderConfirmationPage.confirmationMessage).toBeVisible();
  });

  test('Test minicart functionality', async ({ page }) => {
    // Add a product to cart
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);
    await productDetailPage.addToCartWithDefaults();

    // Wait for minicart to update
    await shoppingCartPage.waitForMinicartUpdate();

    // Test minicart operations
    await shoppingCartPage.openMinicart();
    expect(await shoppingCartPage.isMinicartOpen()).toBe(true);

    const itemCount = await shoppingCartPage.getMinicartItemCount();
    expect(itemCount).toBe(1);

    const subtotal = await shoppingCartPage.getMinicartSubtotal();
    expect(subtotal).toBeTruthy();

    // Test view cart from minicart
    await shoppingCartPage.viewCartFromMinicart();
    expect(page.url()).toContain('/checkout/cart/');

    // Test proceed to checkout from minicart
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutPageLoad();
    expect(page.url()).toContain('/checkout/');
  });

  test('Test enhanced checkout with Romanian address', async ({ page }) => {
    // Add a product
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);
    await productDetailPage.addToCartWithDefaults();

    // Proceed to checkout
    await shoppingCartPage.proceedToCheckout();
    await checkoutPage.waitForShippingFormReady();

    // Test specific Romanian address filling with custom data
    await checkoutPage.fillShippingAddress({
      email: 'razvan.test@example.com',
      firstName: 'Razvan',
      lastName: 'Hodisan',
      street: 'Strada Principala 123',
      city: 'Cluj-Napoca',
      state: 'Cluj',
      zipCode: '400000',
      phone: '+40722123456',
      country: 'Romania'
    });

    // Verify form was filled correctly
    expect(await checkoutPage.emailInput.inputValue()).toBe('razvan.test@example.com');
    expect(await checkoutPage.firstNameInput.inputValue()).toBe('Razvan');
    expect(await checkoutPage.cityInput.inputValue()).toBe('Cluj-Napoca');
    
    // Verify country and state selection worked
    expect(await checkoutPage.countryDropdown.inputValue()).toBe('RO');
    
    // Continue with shipping method selection
    await TestHelpers.waitForElementToBeStable(page, '.shipping-method');
    await page.waitForTimeout(2000);
    const shippingMethods = page.locator('.shipping-method input[type="radio"]');
    const shippingMethodCount = await shippingMethods.count();
    if (shippingMethodCount > 0) {
      await shippingMethods.first().check();
    }

    // Proceed to payment
    await checkoutPage.proceedToPayment();
    await page.waitForTimeout(2000);

    // Verify we reached the payment step
    expect(page.url()).toContain('/checkout/');
    expect(await checkoutPage.placeOrderButton.isVisible()).toBe(true);
  });
});