export enum OfferType {
    All = "All",
    ForSale = "For Sale",
    ForLease = "For Lease",
    ForSaleOrLease = "For Sale or Lease",
    Sold = "Sold"
}

export default interface Property {
    id: string;
    offer: OfferType;
    askingPrice: number;
    pricePerSF: number;
    propertyType: string;
    buildingSize: string;
    landSize: string;
    imageUrl: string;
    imageUrls: string[];
    pdfUrls: string[];             
    yearBuilt: number;
    frontage: string;
    leaseAmount: string;
    parking: string;
    name: string;
    description: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
}


