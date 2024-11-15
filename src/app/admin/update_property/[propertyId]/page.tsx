"use client";
import { useState, useEffect } from "react";
import { Button, FormControl, FormGroup, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
interface UpdatePropertyFormProps {
    propertyId: string;
    params: {
        propertyId: string;
      };
}
export default function UpdatePropertyForm({ params }: UpdatePropertyFormProps) {
    const [offer, setOffer] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [askingPrice, setAskingPrice] = useState("");
    const [pricePerSF, setPricePerSF] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [buildingSize, setBuildingSize] = useState("");
    const [landSize, setLandSize] = useState("");
    const [yearBuilt, setYearBuilt] = useState("");
    const [frontage, setFrontage] = useState("");
    const [parking, setParking] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [leaseAmount, setLeaseAmount] = useState("");
    const router = useRouter();
    const { propertyId } = params;

    // Load existing property data
    useEffect(() => {
        const fetchProperty = async () => {
          try {
            console.log("Fetching property with ID:", propertyId);
    
            const response = await axios.get(`/api/properties/${propertyId}`);
            const property = response.data;
            console.log("Fetched property data:", property);
    
            // Set the state variables with the fetched data
            setOffer(property.offer || "");
            setName(property.name || "");
            setDescription(property.description || "");
            setAskingPrice(property.askingPrice || "");
            setPricePerSF(property.pricePerSF || "");
            setPropertyType(property.propertyType || "");
            setBuildingSize(property.buildingSize || "");
            setLandSize(property.landSize || "");
            setYearBuilt(property.yearBuilt || "");
            setFrontage(property.frontage || "");
            setParking(property.parking || "");
            setLeaseAmount(property.leaseAmount || "");
    
            // Handle nested address object
            if (property.address) {
              setStreet(property.address.street || "");
              setCity(property.address.city || "");
              setState(property.address.state || "");
              setZipCode(property.address.zipCode || "");
            }
          } catch (error) {
            console.error("Error fetching property data:", error);
          }
        };
    
        fetchProperty();
      }, [propertyId]);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const formData = {
                offer,
                name,
                description,
                askingPrice,
                pricePerSF,
                propertyType,
                buildingSize,
                landSize,
                yearBuilt,
                frontage,
                parking,
                leaseAmount,
                address: { street, city, state, zipCode },
            };

            const res = await axios.patch(`/api/properties/${propertyId}`, formData);

            console.log("Property updated:", res.data);
            router.push("/admin/dashboard");
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md p-4">
                <p className="text-2xl sm:text-4xl font-semibold my-6 text-center">Update Property</p>
                <FormGroup className="space-y-4">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="offer-input">Offer</InputLabel>
                        <OutlinedInput
                            id="offer-input"
                            label="Offer"
                            value={offer}
                            onChange={(e) => setOffer(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <OutlinedInput
                            id="name"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <OutlinedInput
                            id="description"
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="askingPrice-input">Asking Price</InputLabel>
                        <OutlinedInput
                            id="askingPrice-input"
                            label="Asking Price"
                            value={askingPrice}
                            onChange={(e) => setAskingPrice(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="leaseAmount-input">Lease Amount</InputLabel>
                        <OutlinedInput
                            id="leaseAmount-input"
                            label="Lease Amount"
                            value={leaseAmount}
                            onChange={(e) => setLeaseAmount(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="pricePerSF-input">Price per SF</InputLabel>
                        <OutlinedInput
                            id="pricePerSF-input"
                            label="Price per SF"
                            value={pricePerSF}
                            onChange={(e) => setPricePerSF(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="propertyType-input">Property Type</InputLabel>
                        <OutlinedInput
                            id="propertyType-input"
                            label="Property Type"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="buildingSize-input">Building Size</InputLabel>
                        <OutlinedInput
                            id="buildingSize-input"
                            label="Building Size"
                            value={buildingSize}
                            onChange={(e) => setBuildingSize(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="landSize-input">Land Size</InputLabel>
                        <OutlinedInput
                            id="landSize-input"
                            label="Land Size"
                            value={landSize}
                            onChange={(e) => setLandSize(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="yearBuilt-input">Year Built</InputLabel>
                        <OutlinedInput
                            id="yearBuilt-input"
                            label="Year Built"
                            value={yearBuilt}
                            onChange={(e) => setYearBuilt(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="frontage-input">Frontage</InputLabel>
                        <OutlinedInput
                            id="frontage-input"
                            label="Frontage"
                            value={frontage}
                            onChange={(e) => setFrontage(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="parking-input">Parking</InputLabel>
                        <OutlinedInput
                            id="parking-input"
                            label="Parking"
                            value={parking}
                            onChange={(e) => setParking(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="street-input">Street</InputLabel>
                        <OutlinedInput
                            id="street-input"
                            label="Street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="city-input">City</InputLabel>
                        <OutlinedInput
                            id="city-input"
                            label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="state-input">State</InputLabel>
                        <OutlinedInput
                            id="state-input"
                            label="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="zipCode-input">Zip Code</InputLabel>
                        <OutlinedInput
                            id="zipCode-input"
                            label="Zip Code"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        className="mt-6"
                    >
                        Update Property
                    </Button>
                </FormGroup>
            </div>
        </div>
    );
}
