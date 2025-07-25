import { Page } from '@playwright/test';

export class CookieConsentHandler {
  constructor(private page: Page) {}

  async handleCookieConsent(): Promise<void> {
    try {
      // Wait for any consent modal to appear
      const consentModalSelectors = [
        '.fc-consent-root',
        '[role="dialog"]',
        '.cookie-consent',
        '.consent-banner',
        '.gdpr-modal',
        'div[class*="consent"]',
        'div[class*="cookie"]'
      ];

      let modalFound = false;
      let consentModal;

      // Check for any consent modal
      for (const selector of consentModalSelectors) {
        consentModal = this.page.locator(selector).first();
        if (await consentModal.isVisible({ timeout: 2000 })) {
          console.log(`Cookie consent modal detected: ${selector}`);
          modalFound = true;
          break;
        }
      }

      if (modalFound) {
        // Try different consent button selectors with more variations
        const consentSelectors = [
          'button:has-text("Consent")',
          'button:has-text("Accept")', 
          'button:has-text("Accept All")',
          'button:has-text("I Agree")',
          'button:has-text("OK")',
          'button:has-text("Got it")',
          '.fc-button.fc-cta-consent',
          '.fc-button[data-testid="uc-accept-all-button"]',
          '[data-testid="consent-accept"]',
          '[data-testid="uc-accept-all-button"]',
          'button[class*="consent"]',
          'button[class*="accept"]',
          '.consent-accept',
          '.accept-all',
          '.btn-consent'
        ];

        let buttonClicked = false;
        for (const selector of consentSelectors) {
          const button = this.page.locator(selector);
          if (await button.isVisible({ timeout: 1000 })) {
            await button.click();
            buttonClicked = true;
            console.log(`Successfully clicked consent button: ${selector}`);
            break;
          }
        }

        if (buttonClicked) {
          // Wait for modal to disappear
          await consentModal.waitFor({ state: 'hidden', timeout: 10000 });
          console.log('Cookie consent accepted successfully');
          
          // Additional wait to ensure page is stable after consent
          await this.page.waitForTimeout(1000);
        } else {
          console.log('No consent button found, trying alternative approaches');
          
          // Try to press Escape key
          await this.page.keyboard.press('Escape');
          
          // Try to find and click close button
          const closeSelectors = [
            '.fc-close',
            '[aria-label="Close"]',
            'button:has-text("×")',
            '.close',
            '.modal-close'
          ];
          
          for (const closeSelector of closeSelectors) {
            const closeButton = this.page.locator(closeSelector);
            if (await closeButton.isVisible({ timeout: 1000 })) {
              await closeButton.click();
              console.log(`Closed modal using: ${closeSelector}`);
              break;
            }
          }
        }
      } else {
        console.log('No cookie consent modal found');
      }
    } catch (error) {
      console.log('Error handling cookie consent:', error);
    }
  }

  async handleCookieConsentWithManageOptions(): Promise<void> {
    try {
      const consentModal = this.page.locator('.fc-consent-root, [role="dialog"]').first();
      
      if (await consentModal.isVisible({ timeout: 3000 })) {
        // Click "Manage options" if available
        const manageButton = this.page.locator('button:has-text("Manage options"), .fc-button.fc-secondary-button');
        if (await manageButton.isVisible({ timeout: 2000 })) {
          await manageButton.click();
          await this.page.waitForTimeout(1000);
        }
        
        // Then click consent
        const consentButton = this.page.locator('button:has-text("Consent"), .fc-button.fc-cta-consent');
        if (await consentButton.isVisible({ timeout: 2000 })) {
          await consentButton.click();
        }
        
        await consentModal.waitFor({ state: 'hidden', timeout: 10000 });
        console.log('Cookie preferences managed and consent given');
      }
    } catch (error) {
      console.log('Cookie consent modal not found');
    }
  }

  async blockConsentScripts(): Promise<void> {
    // Block consent-related scripts and resources
    await this.page.route('**/consent**', route => route.abort());
    await this.page.route('**/cookie-banner**', route => route.abort());
    await this.page.route('**/gdpr**', route => route.abort());
    await this.page.route('**/cookielaw**', route => route.abort());
    
    // Block by domain patterns
    await this.page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('consent') || 
          url.includes('cookie-banner') || 
          url.includes('gdpr') ||
          url.includes('cookielaw')) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  async dismissAnyConsentModal(): Promise<boolean> {
    const modalSelectors = [
      '.fc-consent-root',
      '[role="dialog"]',
      '.cookie-consent',
      '.gdpr-modal',
      '.privacy-modal',
      '.consent-banner'
    ];

    const buttonSelectors = [
      'button:has-text("Consent")',
      'button:has-text("Accept")',
      'button:has-text("Accept All")',
      'button:has-text("I Agree")',
      'button:has-text("OK")',
      '.fc-button.fc-cta-consent',
      '[data-testid="consent-accept"]',
      '.consent-accept'
    ];

    try {
      // Check if any consent modal is visible
      for (const modalSelector of modalSelectors) {
        const modal = this.page.locator(modalSelector);
        if (await modal.isVisible({ timeout: 2000 })) {
          console.log(`Found consent modal: ${modalSelector}`);
          
          // Try to click any consent button
          for (const buttonSelector of buttonSelectors) {
            const button = this.page.locator(buttonSelector);
            if (await button.isVisible({ timeout: 1000 })) {
              await button.click();
              console.log(`Clicked consent button: ${buttonSelector}`);
              
              // Wait for modal to disappear
              await modal.waitFor({ state: 'hidden', timeout: 5000 });
              return true;
            }
          }
        }
      }
      return false;
    } catch (error) {
      console.log('Error handling consent modal:', error);
      return false;
    }
  }
}

// Static utility function for easy use
export async function dismissCookieConsent(page: Page, strategy: 'accept' | 'manage' | 'block' = 'accept'): Promise<void> {
  const handler = new CookieConsentHandler(page);
  
  switch (strategy) {
    case 'accept':
      await handler.handleCookieConsent();
      break;
    case 'manage':
      await handler.handleCookieConsentWithManageOptions();
      break;  
    case 'block':
      await handler.blockConsentScripts();
      break;
  }
}