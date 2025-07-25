import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly navigationMenu: Locator;
  readonly shoppingCartIcon: Locator;
  readonly accountIcon: Locator;
  readonly createAccountLink: Locator;
  readonly signInLink: Locator;
  readonly hotSellersSection: Locator;
  
  // Navigation menu items
  readonly whatsNewNav: Locator;
  readonly womenNav: Locator;
  readonly menNav: Locator;
  readonly gearNav: Locator;
  readonly trainingNav: Locator;
  readonly saleNav: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('.hero');
    this.searchBox = page.locator('#search');
    this.searchButton = page.locator('button[title="Search"]');
    this.navigationMenu = page.locator('.navigation');
    this.shoppingCartIcon = page.locator('.showcart');
    this.accountIcon = page.locator('.customer-welcome');
    this.createAccountLink = page.locator('a[href*="customer/account/create"]');
    this.signInLink = page.locator('a[href*="customer/account/login"]');
    this.hotSellersSection = page.locator('.home-main .products-grid');
    
    // Navigation menu items by ID and text
    this.whatsNewNav = page.locator('#ui-id-3');
    this.womenNav = page.locator('#ui-id-4');
    this.menNav = page.locator('#ui-id-5');
    this.gearNav = page.locator('#ui-id-6');
    this.trainingNav = page.locator('#ui-id-7');
    this.saleNav = page.locator('#ui-id-8');
  }

  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async searchForProduct(productName: string) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async navigateToWhatsNew() {
    await this.whatsNewNav.click();
    await this.waitForPageLoad();
  }

  async navigateToWomen() {
    await this.womenNav.click();
    await this.waitForPageLoad();
  }

  async navigateToMen() {
    // Try to handle any remaining cookie consent before clicking
    try {
      const cookieModal = this.page.locator('.fc-consent-root, [role="dialog"]').first();
      if (await cookieModal.isVisible({ timeout: 1000 })) {
        const consentButton = this.page.locator('button:has-text("Consent"), button:has-text("Accept")');
        if (await consentButton.isVisible({ timeout: 1000 })) {
          await consentButton.click();
          await this.page.waitForTimeout(1000);
        }
      }
    } catch (error) {
      // Continue if no consent modal
    }
    
    await this.menNav.click();
    await this.waitForPageLoad();
  }

  async navigateToGear() {
    await this.gearNav.click();
    await this.waitForPageLoad();
  }

  async navigateToTraining() {
    await this.trainingNav.click();
    await this.waitForPageLoad();
  }

  async navigateToSale() {
    await this.saleNav.click();
    await this.waitForPageLoad();
  }

  // Submenu navigation methods
  async navigateToWomenTops() {
    await this.womenNav.hover();
    await this.page.locator('#ui-id-9').click();
    await this.waitForPageLoad();
  }

  async navigateToWomenBottoms() {
    await this.womenNav.hover();
    await this.page.locator('#ui-id-10').click();
    await this.waitForPageLoad();
  }

  async navigateToMenTops() {
    await this.menNav.hover();
    await this.page.locator('#ui-id-17').click();
    await this.waitForPageLoad();
  }

  async navigateToMenBottoms() {
    await this.menNav.hover();
    await this.page.locator('#ui-id-18').click();
    await this.waitForPageLoad();
  }

  // Specific category navigation
  async navigateToWomenJackets() {
    await this.womenNav.hover();
    await this.page.locator('#ui-id-9').hover();
    await this.page.locator('#ui-id-11').click();
    await this.waitForPageLoad();
  }

  async navigateToMenJackets() {
    await this.menNav.hover();
    await this.page.locator('#ui-id-17').hover();
    await this.page.locator('#ui-id-19').click();
    await this.waitForPageLoad();
  }

  async navigateToGearBags() {
    await this.gearNav.hover();
    await this.page.locator('#ui-id-25').click();
    await this.waitForPageLoad();
  }

  // Alternative navigation using text selectors
  async navigateToNavByText(text: string) {
    await this.page.locator(`text="${text}"`).first().click();
    await this.waitForPageLoad();
  }

  // Legacy method kept for backward compatibility
  async navigateToMenCategory() {
    await this.navigateToMen();
  }

  async goToSignIn() {
    await this.signInLink.click();
    await this.waitForPageLoad();
  }

  async goToCreateAccount() {
    await this.createAccountLink.click();
    await this.waitForPageLoad();
  }

  async openShoppingCart() {
    await this.shoppingCartIcon.click();
  }
}