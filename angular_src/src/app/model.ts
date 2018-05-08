export class Harvest {
  public farm: Farm;
  public readonly entries: Array<Entry>;

  public constructor() {
    this.entries = [];
  }
}

export class Entry {
  public crop: Crop;
  public selectedVariety: string;
  public pounds: number;
  public totalValue: number;
  public harvester: Harvester;
  public comments: string;
  public recipient: Organization;

  public constructor() {
  }
}

export class Farm {
  public name: string;
  public latitude: number;
  public longitude: number;

  public constructor() {
  }
}

export class Crop {
  public name: string;
  public variety: string[];
  public pricePerPound: string;

  public constructor() {
  }
}

export enum OrganizationType {
  PURCHASE,
  DONATION
}

export abstract class Organization {
  public readonly organizationType: OrganizationType;
  public name: string;
  public phoneNumber: string;
  public contactName: string;

  public constructor(organizationType) {
    this.organizationType = organizationType;
  }
}

export class PurchaseOrganization extends Organization {
  public constructor() {
    super(OrganizationType.PURCHASE);
  }
}

export class DonationOrganization extends Organization {
  public constructor() {
    super(OrganizationType.DONATION);
  }
}

export enum UserType {
  ADMIN,
  INTERN
}

export abstract class User {
  public readonly userType: UserType;
  public username: string;
  public password: string;

  public constructor(userType: UserType) {
    this.userType = userType;
  }
}

export class AdminUser extends User {
  public constructor() {
    super(UserType.ADMIN);
  }
}

export class InternUser extends User {
  public constructor() {
    super(UserType.INTERN);
  }
}

export class Harvester {
  public fisrtName: string;
  public lastName: string;

  public constructor() {
  }
}
