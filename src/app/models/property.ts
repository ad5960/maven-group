export enum OfferType {
    All = "All",
    ForSale = "For Sale",
    ForLease = "For Lease",
    ForSaleOrLease = "For Sale or Lease",
    Sold = "Sold"
}

export default interface Property {
    id: string;
    offer: OfferType;            // Offer type
    askingPrice: number;         // Asking Price
    pricePerSF: number;
    propertyType: string;        // Property type
    buildingSize: string;        // Building size in square feet
    landSize: string;            // Land size in square feet
    imageUrl: string;
    imageUrls: string[];
    yearBuilt: number;           // Year the property was built
    frontage: string;            // Frontage along a street
    parking: string;             // Parking details
    downloads: {                 // Links to download files
        attachments: string[]; // Link to the marketing brochure
    };
    address: {
        street: string;          // Street address
        city: string;            // City
        state: string;           // State
        zipCode: string;         // Zip code
    };
}

