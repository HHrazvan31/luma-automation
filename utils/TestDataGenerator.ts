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

  static generateRomanianPhone(): string {
    const prefix = '+40';
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${prefix}${number}`;
  }

  // Romanian-specific data generators
  static generateRomanianEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test.romania.${timestamp}.${random}@example.com`;
  }

  static generateRomanianName(): { firstName: string; lastName: string } {
    const romanianFirstNames = ['Ion', 'Maria', 'Gheorghe', 'Elena', 'Nicolae', 'Ana', 'Vasile', 'Ioana', 'Constantin', 'Mihaela'];
    const romanianLastNames = ['Popescu', 'Ionescu', 'Popa', 'Radu', 'Stoica', 'Stan', 'Dima', 'Constantin', 'Marin', 'Florescu'];
    
    const firstName = romanianFirstNames[Math.floor(Math.random() * romanianFirstNames.length)];
    const lastName = romanianLastNames[Math.floor(Math.random() * romanianLastNames.length)];
    
    return { firstName, lastName };
  }

  static generateRomanianStreet(): string {
    const streetTypes = ['Strada', 'Bulevardul', 'Calea', 'Aleea', 'Piața'];
    const streetNames = ['Mihai Viteazu', 'Unirii', 'Libertatii', 'Victoriei', 'Republicii', 'Independentei', 'Pacii', 'Florilor'];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${streetType} ${streetName} ${number}`;
  }

  static generateRomanianCity(): string {
    const cities = ['Cluj-Napoca', 'Bucharest', 'Timisoara', 'Constanta', 'Iasi', 'Brasov', 'Galati', 'Ploiesti', 'Craiova', 'Oradea'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  static generateRomanianZipCode(): string {
    // Romanian postal codes are 6 digits
    return (Math.floor(Math.random() * 900000) + 100000).toString();
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

  static generateRomanianAddress() {
    const cityStateMap = {
      'Cluj-Napoca': 'Cluj',
      'Bucharest': 'Bucureşti', 
      'Timisoara': 'Timiş',
      'Constanta': 'Constanţa',
      'Iasi': 'Iaşi',
      'Brasov': 'Braşov',
      'Galati': 'Galaţi',
      'Ploiesti': 'Prahova',
      'Craiova': 'Dolj',
      'Oradea': 'Bihor'
    };
    
    const city = this.generateRomanianCity();
    const state = cityStateMap[city as keyof typeof cityStateMap] || 'Cluj';
    
    return {
      street: this.generateRomanianStreet(),
      city: city,
      state: state,
      zipCode: this.generateRomanianZipCode(),
      country: 'Romania'
    };
  }


  static getTestCustomerData(useRomanianData: boolean = true) {
    if (useRomanianData) {
      const { firstName, lastName } = this.generateRomanianName();
      const address = this.generateRomanianAddress();
      
      return {
        email: this.generateRomanianEmail(),
        firstName,
        lastName,
        phone: this.generateRomanianPhone(),
        ...address
      };
    } else {
      const { firstName, lastName } = this.generateRandomName();
      const address = this.generateRandomAddress();
      
      return {
        email: this.generateRandomEmail(),
        firstName,
        lastName,
        phone: this.generateRandomPhone(),
        ...address
      };
    }
  }

  // Alias for backward compatibility
  static getRomanianTestCustomerData() {
    return this.getTestCustomerData(true);
  }
}