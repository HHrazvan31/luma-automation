export class TestDataGenerator {
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test.user.${timestamp}.${random}@example.com`;
  }

  static generateRandomName(): { firstName: string; lastName: string } {
    const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return { firstName, lastName };
  }

  static generateRandomPhone(): string {
    const areaCodes = ['555', '123', '456', '789'];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${areaCode}${number}`;
  }

  static generateRandomAddress() {
    const streets = [
      '123 Main Street',
      '456 Oak Avenue',
      '789 Pine Road',
      '321 Elm Street',
      '654 Maple Drive'
    ];
    
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['New York', 'California', 'Illinois', 'Texas', 'Arizona'];
    const zipCodes = ['10001', '90210', '60601', '77001', '85001'];
    
    const index = Math.floor(Math.random() * cities.length);
    
    return {
      street: streets[Math.floor(Math.random() * streets.length)],
      city: cities[index],
      state: states[index],
      zipCode: zipCodes[index],
      country: 'US'
    };
  }

  static generateRandomPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  static getTestCustomerData() {
    const { firstName, lastName } = this.generateRandomName();
    const address = this.generateRandomAddress();
    
    return {
      email: this.generateRandomEmail(),
      firstName,
      lastName,
      password: this.generateRandomPassword(),
      phone: this.generateRandomPhone(),
      ...address
    };
  }
}