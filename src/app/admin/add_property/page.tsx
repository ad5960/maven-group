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
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [leaseAmount, setLeaseAmount] = useState("")
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>([]);
    const router = useRouter();

    // useEffect(() => {
    //     const verifyToken = async () => {
    //       try {
    //         const response = await fetch('/api/verifyToken');
    
    //           if (!response.ok) {
    //               console.error('Token verification failed, redirecting to login');
    //               throw new Error('Failed to authenticate');
    //           }

    //       } catch (error) {
    //         console.error('Error during token verification or data fetching:', error);
    //         router.push('/admin/login');
    //       }
    //     };
    
    //     verifyToken();
    //   }, [router]);

    // Function to handle adding a new custom field
    const addCustomField = () => {
        setCustomFields([...customFields, { key: "", value: "" }]);
    };

    // Function to update custom field value
    const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
        const updatedFields = [...customFields];
        updatedFields[index][field] = value;
        setCustomFields(updatedFields);
    };

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
        formData.append("street", street);
        formData.append("city", city);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("state", state);
        formData.append("zipCode", zipCode);
        formData.append("leaseAmount", leaseAmount);
    
        imageFiles.forEach((file) => formData.append(`files`, file));
        pdfFiles.forEach((file) => formData.append(`pdfs`, file));
    
        // Log the custom fields
        console.log("Custom Fields:", customFields);
    
        // Append custom fields
        customFields.forEach((field, index) => {
            formData.append(`customFields[${index}][key]`, field.key);
            formData.append(`customFields[${index}][value]`, field.value);
        });
    
        // Convert formData entries to an array and log them
        Array.from(formData.entries()).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
        
        try {
            const res = await axios.post("/api/properties/", formData, {
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
                            label="Offer"
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
                        <InputLabel htmlFor="files-input">Upload Images</InputLabel>
                        <OutlinedInput
                            id="files-input"
                            type="file"
                            inputProps={{ accept: "image/*", multiple: true }}
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files) {
                                    setImageFiles(Array.from(target.files));
                                }
                            }}
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="pdfs-input">Upload PDFs</InputLabel>
                        <OutlinedInput
                            id="pdfs-input"
                            type="file"
                            inputProps={{ accept: "application/pdf", multiple: true }}
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files) {
                                    setPdfFiles(Array.from(target.files));
                                }
                            }}
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
                    {customFields.map((field, index) => (
                        <div key={index} className="flex space-x-4">
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor={`customFieldKey-${index}`}>Custom Field Key</InputLabel>
                                <OutlinedInput
                                    id={`customFieldKey-${index}`}
                                    label="Key"
                                    value={field.key}
                                    onChange={(e) => updateCustomField(index, "key", e.target.value)}
                                />
                            </FormControl>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor={`customFieldValue-${index}`}>Custom Field Value</InputLabel>
                                <OutlinedInput
                                    id={`customFieldValue-${index}`}
                                    label="Value"
                                    value={field.value}
                                    onChange={(e) => updateCustomField(index, "value", e.target.value)}
                                />
                            </FormControl>
                        </div>
                    ))}

<Button type="button" onClick={addCustomField} variant="outlined">
                        Add Custom Field
                    </Button>
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