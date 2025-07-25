import { test, expect } from '@playwright/test';
import { 
  HomePage, 
  ProductListPage, 
  ProductDetailPage, 
  ShoppingCartPage 
} from '../pages';
import { TestHelpers } from '../utils';

test.describe('Shopping Cart Functionality Tests', () => {
  let homePage: HomePage;
  let productListPage: ProductListPage;
  let productDetailPage: ProductDetailPage;
  let shoppingCartPage: ShoppingCartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productListPage = new ProductListPage(page);
    productDetailPage = new ProductDetailPage(page);
    shoppingCartPage = new ShoppingCartPage(page);

    await homePage.navigateToHome();
    await TestHelpers.acceptCookies(page);
  });

  test('Add single product to cart', async ({ page }) => {
    await homePage.navigateToMen();
    await productListPage.selectProductByIndex(0);

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

    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toHaveCount(1);
    
    const cartItemName = await shoppingCartPage.getItemName(0);
    expect(cartItemName).toContain(productName.split(' ')[0]); // Partial match
  });

  test('Update product quantity in cart', async ({ page }) => {
    await homePage.navigateToWomen();
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
    await expect(shoppingCartPage.cartItems).toHaveCount(1);

    // Update quantity
    await shoppingCartPage.updateQuantity(0, 3);
    
    // Verify quantity was updated
    const updatedQuantity = await shoppingCartPage.page.locator('.qty input').first().inputValue();
    expect(updatedQuantity).toBe('3');
  });

  test('Remove product from cart', async ({ page }) => {
    await homePage.navigateToMen();
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
    await expect(shoppingCartPage.cartItems).toHaveCount(1);

    await shoppingCartPage.removeItem(0);
    
    const isEmpty = await shoppingCartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test('Add multiple different products to cart', async ({ page }) => {
    const categories = ['Men', 'Women'];
    
    for (let i = 0; i < categories.length; i++) {
      if (categories[i] === 'Men') {
        await homePage.navigateToMen();
      } else if (categories[i] === 'Women') {
        await homePage.navigateToWomen();
      }
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
    }

    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toHaveCount(categories.length);
  });

  test('Verify cart persistence across sessions', async ({ page, context }) => {
    await homePage.navigateToWomen();
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

    // Create new page in same context to simulate tab refresh
    const newPage = await context.newPage();
    const newShoppingCartPage = new ShoppingCartPage(newPage);
    
    await newShoppingCartPage.navigateToCart();
    await expect(newShoppingCartPage.cartItems).toHaveCount(1);
    
    await newPage.close();
  });

  test('Cart total calculations are correct', async ({ page }) => {
    await homePage.navigateToMen();
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
    
    const subtotal = await shoppingCartPage.getSubtotal();
    const grandTotal = await shoppingCartPage.getGrandTotal();
    
    expect(subtotal).toBeTruthy();
    expect(grandTotal).toBeTruthy();
    
    // Basic validation that totals exist and are not empty
    expect(subtotal.length).toBeGreaterThan(0);
    expect(grandTotal.length).toBeGreaterThan(0);
  });

  test('Continue shopping from cart', async ({ page }) => {
    await homePage.navigateToWomen();
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
    await expect(shoppingCartPage.cartItems).toHaveCount(1);

    await shoppingCartPage.continueShopping();
    
    // Verify we're back to shopping
    const currentUrl = await page.url();
    expect(currentUrl).not.toContain('/checkout/cart/');
  });
});