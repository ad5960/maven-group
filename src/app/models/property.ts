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
    yearBuilt: number;           // Year the property was built
    tenancy: string;             // Tenancy status
    frontage: string;            // Frontage along a street
    parking: string;             // Parking details
    zoning: string;              // Zoning information
    highlights: string[];        // List of property highlights
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

// Example usage:
const property: Property = {
    id: "1234566",
    offer: OfferType.ForSale,
    askingPrice: 4100000,
    pricePerSF: 7,
    propertyType: "Retail Space",
    buildingSize: "4878 SF",
    landSize: "5000 SF",
    yearBuilt: 1930,
    tenancy: "Single (Building can be divisible by two)",
    frontage: "50’ along Wilshire Boulevard",
    parking: "No dedicated (ample metered street parking along Wilshire & a city metered lot across the street)",
    zoning: "MUB (Mixed-Use Boulevard)",
    highlights: [
        "Excellent, Infill Santa Monica Location",
        "High Traffic Retail Corridor",
        "Excellent Westside Location with Silicon Beach Drivers",
        "Ample Area Amenities"
    ],
    downloads: {
        attachments: ["#", "#"]
    },
    address: {
        street: "1415 Wilshire Blvd",
        city: "Santa Monica",
        state: "CA",
        zipCode: "90402"
    }
};
