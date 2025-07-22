# Luma E-commerce Automation Tests

A comprehensive test automation suite for the Luma e-commerce website (https://magento.softwaretestingboard.com/) built with TypeScript and Playwright, focusing on order placement regression testing.

## 🎯 Project Overview

This project contains automated test scripts for regression testing of the order placement process on the Luma website. The tests are designed to validate critical e-commerce functionality including product selection, cart management, and checkout flows.

## 🏗️ Project Structure

```
luma-automation-tests/
├── tests/                     # Test specifications
│   ├── order-placement.spec.ts
│   └── cart-functionality.spec.ts
├── pages/                     # Page Object Models
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── ProductListPage.ts
│   ├── ProductDetailPage.ts
│   ├── ShoppingCartPage.ts
│   ├── CheckoutPage.ts
│   └── OrderConfirmationPage.ts
├── utils/                     # Utility classes
│   ├── TestDataGenerator.ts
│   └── TestHelpers.ts
├── test-data/                 # Test data files
│   ├── products.json
│   └── customers.json
└── test-results/             # Test execution results
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd luma-automation-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install:browsers
```

### Running Tests

#### Run all tests:
```bash
npm test
```

#### Run tests in headed mode:
```bash
npm run test:headed
```

#### Run tests in debug mode:
```bash
npm run test:debug
```

#### Run tests with UI mode:
```bash
npm run test:ui
```

#### View test report:
```bash
npm run test:report
```

## 🧪 Test Scenarios

### Order Placement Tests
- Complete order placement flow with single product
- Add multiple products to cart and complete order
- Modify cart contents before checkout
- Test checkout with guest user account creation
- Verify order totals and pricing calculations

### Cart Functionality Tests
- Add single product to cart
- Update product quantity in cart
- Remove product from cart
- Add multiple different products to cart
- Verify cart persistence across sessions
- Cart total calculations validation
- Continue shopping from cart

## 🛠️ Key Features

### Page Object Model Pattern
- Maintainable and reusable page objects
- Clear separation of test logic and page interactions
- Consistent element locators and methods

### Dynamic Test Data
- Random test data generation for realistic testing
- Configurable customer and product data
- Support for multiple test environments

### Comprehensive Reporting
- HTML reports with screenshots and videos
- JSON reports for CI/CD integration
- JUnit XML format for test management tools

### Cross-Browser Testing
- Chrome, Firefox, and Safari support
- Mobile responsive testing
- Parallel test execution

### CI/CD Integration
- GitHub Actions workflow
- Automatic test execution on push/PR
- Scheduled regression testing

## 🔧 Configuration

### Playwright Configuration
The `playwright.config.ts` file contains:
- Browser configurations
- Test timeouts and retries
- Reporting settings
- Base URL and other global settings

### Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

## 📊 Test Reporting

After test execution, reports are available in:
- `test-results/html-report/` - HTML report
- `test-results/test-results.json` - JSON report
- `test-results/junit.xml` - JUnit XML report
- `test-results/screenshots/` - Screenshots on failure

## 🚀 CI/CD Pipeline

The project includes a GitHub Actions workflow that:
- Runs tests on multiple browsers
- Executes on push/PR to main/develop branches
- Runs scheduled regression tests daily
- Uploads test artifacts and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Best Practices

- Tests are independent and can run in any order
- Use Page Object Model for maintainability
- Generate dynamic test data to avoid conflicts
- Include proper error handling and logging
- Maintain clear and descriptive test names

## 🐛 Troubleshooting

### Common Issues

1. **Browser installation**: Ensure browsers are installed with `npm run install:browsers`
2. **Network timeouts**: Increase timeout values in `playwright.config.ts`
3. **Element not found**: Update selectors in page objects if website changes
4. **Flaky tests**: Add appropriate waits and stability checks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please open an issue in the repository.