"use client";
import { Button, FormControl, FormGroup, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [offer, setOffer] = useState("");
    const [askingPrice, setAskingPrice] = useState("");
    const [pricePerSF, setPricePerSF] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [buildingSize, setBuildingSize] = useState("");
    const [landSize, setLandSize] = useState("");
    const [yearBuilt, setYearBuilt] = useState("");
    const [frontage, setFrontage] = useState("");
    const [parking, setParking] = useState("");
    const [attachments, setAttachments] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();

    async function handleSubmit() {
        const formData = new FormData();
        formData.append("offer", offer);
        formData.append("askingPrice", askingPrice);
        formData.append("pricePerSF", pricePerSF);
        formData.append("propertyType", propertyType);
        formData.append("buildingSize", buildingSize);
        formData.append("landSize", landSize);
        formData.append("yearBuilt", yearBuilt);
        formData.append("frontage", frontage);
        formData.append("parking", parking);
        formData.append("attachments", attachments);
        formData.append("street", street);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("zipCode", zipCode);
        files.forEach((file, index) => {
            formData.append(`files`, file);
        });

        try {
            const res = await axios.post("/admin/add_property/api", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Property added:", res.data);
            router.push("/admin/dashboard");
        } catch (error) {
            console.error("Error adding property:", error);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md p-4">
                <p className="text-2xl sm:text-4xl font-semibold my-6 text-center">Add a Property</p>
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
                        <InputLabel htmlFor="askingPrice-input">Asking Price</InputLabel>
                        <OutlinedInput
                            id="askingPrice-input"
                            label="Asking Price"
                            value={askingPrice}
                            onChange={(e) => setAskingPrice(e.target.value)}
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
                        <InputLabel htmlFor="attachments-input">Attachments (comma separated)</InputLabel>
                        <OutlinedInput
                            id="attachments-input"
                            label="Attachments"
                            value={attachments}
                            onChange={(e) => setAttachments(e.target.value)}
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
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="files-input" >Upload Images</InputLabel>
                        <OutlinedInput
                           
                            id="files-input"
                            type="file"
                            inputProps={{ accept: "image/*", multiple: true }}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(Array.from(e.target.files));
                                }
                            }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        className=" mt-6"
                    >
                        Submit
                    </Button>
                </FormGroup>
            </div>
        </div>
    );
}
