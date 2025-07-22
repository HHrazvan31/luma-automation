import { Page, expect } from '@playwright/test';

export class TestHelpers {
  static async waitForUrl(page: Page, urlPattern: string | RegExp, timeout: number = 30000) {
    await page.waitForURL(urlPattern, { timeout });
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  static async scrollToBottom(page: Page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async scrollToTop(page: Page) {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  static async waitForNetworkIdle(page: Page, timeout: number = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => localStorage.clear());
  }

  static async clearSessionStorage(page: Page) {
    await page.evaluate(() => sessionStorage.clear());
  }

  static async acceptCookies(page: Page) {
    try {
      const cookieButton = page.locator('button:has-text("Accept"), button:has-text("OK"), button:has-text("Got it")');
      if (await cookieButton.isVisible({ timeout: 5000 })) {
        await cookieButton.click();
      }
    } catch (error) {
      // Cookie banner not present, continue
    }
  }

  static parsePrice(priceText: string): number {
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static generateUniqueId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async retryAction(action: () => Promise<void>, maxRetries: number = 3) {
    let attempt = 1;
    while (attempt <= maxRetries) {
      try {
        await action();
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  static async waitForElementToBeStable(page: Page, selector: string, timeout: number = 10000) {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    
    let previousBoundingBox = await element.boundingBox();
    let stableCount = 0;
    const requiredStableCount = 3;
    
    while (stableCount < requiredStableCount) {
      await page.waitForTimeout(100);
      const currentBoundingBox = await element.boundingBox();
      
      if (this.boundingBoxEqual(previousBoundingBox, currentBoundingBox)) {
        stableCount++;
      } else {
        stableCount = 0;
        previousBoundingBox = currentBoundingBox;
      }
    }
  }

  private static boundingBoxEqual(box1: any, box2: any): boolean {
    if (!box1 || !box2) return false;
    return box1.x === box2.x && box1.y === box2.y && 
           box1.width === box2.width && box1.height === box2.height;
  }
}