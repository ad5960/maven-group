"use client";
import { useState, useEffect } from "react";
import { Button, CircularProgress, FormControl, FormGroup, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Alert, Snackbar, IconButton, Card, CardMedia, Typography, Box } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { OfferType } from "@/app/models/property";
import Agent from "@/app/models/agent";
import { fetchAgents } from "../admin/dashboard/api/helper";

interface PropertyFormProps {
    mode: 'add' | 'update';
    propertyId?: string;
    initialData?: any;
}

export default function PropertyForm({ mode, propertyId, initialData }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(mode === 'update');
    const [submitting, setSubmitting] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Form states
    const [offer, setOffer] = useState<OfferType>(OfferType.ForSale);
    const [selectedAgent, setSelectedAgent] = useState<string>("");
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
    const [escrow, setEscrow] = useState("");

    // File management states
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [existingPdfs, setExistingPdfs] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [pdfsToDelete, setPdfsToDelete] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newPdfFiles, setNewPdfFiles] = useState<File[]>([]);
    const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>([]);

    // Validation states
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Required fields
        if (!name.trim()) newErrors.name = "Property name is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!street.trim()) newErrors.street = "Street address is required";
        if (!city.trim()) newErrors.city = "City is required";
        if (!state.trim()) newErrors.state = "State is required";
        if (!zipCode.trim()) newErrors.zipCode = "Zip code is required";
        if (!propertyType.trim()) newErrors.propertyType = "Property type is required";

        // Agent validation only for add mode
        if (mode === 'add' && !selectedAgent) {
            newErrors.selectedAgent = "Agent selection is required";
        }

        // Conditional validation based on offer type
        if (offer === OfferType.ForSale || offer === OfferType.ForSaleOrLease) {
            if (!askingPrice.trim()) newErrors.askingPrice = "Asking price is required for sale properties";
        }
        if (offer === OfferType.ForLease || offer === OfferType.ForSaleOrLease) {
            if (!pricePerSF.trim()) newErrors.pricePerSF = "Price per SF is required for lease properties";
        }

        // File validation
        const remainingImages = existingImages.length - imagesToDelete.length + newImageFiles.length;
        if (remainingImages === 0) newErrors.imageFiles = "At least one image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const loadData = async () => {
        setLoading(true);
        try {
            if (mode === 'add') {
                const agentsData = await fetchAgents();
                setAgents(agentsData);
            } else if (mode === 'update' && propertyId) {
                const response = await axios.get(`/api/properties/${propertyId}`);
                const property = response.data;
                console.log("Loaded property:", property);

                setOffer(property.offer || OfferType.ForSale);
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
                setEscrow(property.escrow || "");

                // Handle nested address object
                if (property.address) {
                    setStreet(property.address.street || "");
                    setCity(property.address.city || "");
                    setState(property.address.state || "");
                    setZipCode(property.address.zipCode || "");
                }

                // Set existing files
                setExistingImages(property.imageUrls || []);
                setExistingPdfs(property.pdfUrls || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            if (mode === 'add') {
                setAgents([]);
                showSnackbar("Failed to load agents", "error");
            } else {
                showSnackbar("Failed to load property data", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [mode, propertyId]);

    // File management functions
    const handleImageDelete = (imageUrl: string) => {
        setImagesToDelete(prev => [...prev, imageUrl]);
        clearError('imageFiles');
    };

    const handlePdfDelete = (pdfUrl: string) => {
        setPdfsToDelete(prev => [...prev, pdfUrl]);
    };

    const handleNewImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setNewImageFiles(Array.from(files));
            clearError('imageFiles');
        }
    };

    const handleNewPdfs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setNewPdfFiles(Array.from(files));
        }
    };

    const addCustomField = () => {
        setCustomFields([...customFields, { key: "", value: "" }]);
    };

    const removeCustomField = (index: number) => {
        setCustomFields(customFields.filter((_, i) => i !== index));
    };

    const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
        const updatedFields = [...customFields];
        updatedFields[index][field] = value;
        setCustomFields(updatedFields);
    };

    const handleAgentChange = (event: SelectChangeEvent<string>) => {
        setSelectedAgent(event.target.value);
        clearError('selectedAgent');
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            showSnackbar("Please fix the errors before submitting", "error");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            
            // Add form fields
            formData.append("offer", offer);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("askingPrice", askingPrice);
            formData.append("pricePerSF", pricePerSF);
            formData.append("propertyType", propertyType);
            formData.append("buildingSize", buildingSize);
            formData.append("landSize", landSize);
            formData.append("yearBuilt", yearBuilt);
            formData.append("frontage", frontage);
            formData.append("parking", parking);
            formData.append("leaseAmount", leaseAmount);
            formData.append("escrow", escrow);
            formData.append("street", street);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("zipCode", zipCode);

            // Add agent only for add mode
            if (mode === 'add') {
                formData.append("selectedAgent", selectedAgent);
            }

            // Add files to delete (update mode only)
            if (mode === 'update') {
                if (imagesToDelete.length > 0) {
                    formData.append("imagesToDelete", imagesToDelete.join(','));
                }
                if (pdfsToDelete.length > 0) {
                    formData.append("pdfsToDelete", pdfsToDelete.join(','));
                }
            }

            // Add new files
            newImageFiles.forEach((file) => formData.append("files", file));
            newPdfFiles.forEach((file) => formData.append("pdfs", file));

            // Add custom fields (add mode only)
            if (mode === 'add') {
                customFields.forEach((field, index) => {
                    if (field.key && field.value) {
                        formData.append(`customFields[${index}][key]`, field.key);
                        formData.append(`customFields[${index}][value]`, field.value);
                    }
                });
            }

            const url = mode === 'add' ? '/api/properties/' : `/api/properties/${propertyId}`;
            const method = mode === 'add' ? 'post' : 'patch';

            await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const successMessage = mode === 'add' ? 'Property added successfully!' : 'Property updated successfully!';
            showSnackbar(successMessage, "success");
            setTimeout(() => router.push("/admin/dashboard"), 1500);
        } catch (error) {
            console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} property:`, error);
            showSnackbar(`Failed to ${mode === 'add' ? 'add' : 'update'} property. Please try again.`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    const remainingImages = existingImages.length - imagesToDelete.length + newImageFiles.length;
    const isAddMode = mode === 'add';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isAddMode ? 'Add New Property' : 'Update Property'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {isAddMode ? 'Fill in the details below to add a new property listing' : 'Modify the property details below'}
                            </p>
                        </div>
                        <Button
                            variant="outlined"
                            onClick={() => router.push("/admin/dashboard")}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm">
                    <FormGroup className="p-6 space-y-8">
                        {/* Basic Information Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormControl variant="outlined" fullWidth error={!!errors.name}>
                                    <InputLabel htmlFor="name">Property Name *</InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        label="Property Name *"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            clearError('name');
                                        }}
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="offer-select-label">Offer Type</InputLabel>
                                    <Select
                                        labelId="offer-select-label"
                                        value={offer}
                                        onChange={(e) => setOffer(e.target.value as OfferType)}
                                        label="Offer Type"
                                    >
                                        <MenuItem value={OfferType.ForSale}>For Sale</MenuItem>
                                        <MenuItem value={OfferType.ForLease}>For Lease</MenuItem>
                                        <MenuItem value={OfferType.ForSaleOrLease}>For Sale or Lease</MenuItem>
                                        <MenuItem value={OfferType.Sold}>Sold</MenuItem>
                                    </Select>
                                </FormControl>

                                {isAddMode && (
                                    <FormControl variant="outlined" fullWidth error={!!errors.selectedAgent}>
                                        <InputLabel id="agent-select-label">Agent *</InputLabel>
                                        <Select
                                            labelId="agent-select-label"
                                            value={selectedAgent}
                                            onChange={handleAgentChange}
                                            label="Agent *"
                                        >
                                            {agents.map((agent) => (
                                                <MenuItem key={agent.id} value={agent.name}>
                                                    {agent.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.selectedAgent && <div className="text-red-500 text-sm mt-1">{errors.selectedAgent}</div>}
                                    </FormControl>
                                )}

                                <FormControl variant="outlined" fullWidth error={!!errors.propertyType}>
                                    <InputLabel htmlFor="propertyType">Property Type *</InputLabel>
                                    <OutlinedInput
                                        id="propertyType"
                                        label="Property Type *"
                                        value={propertyType}
                                        onChange={(e) => {
                                            setPropertyType(e.target.value);
                                            clearError('propertyType');
                                        }}
                                    />
                                    {errors.propertyType && <div className="text-red-500 text-sm mt-1">{errors.propertyType}</div>}
                                </FormControl>
                            </div>

                            <FormControl variant="outlined" fullWidth error={!!errors.description} className="mt-6">
                                <InputLabel htmlFor="description">Description *</InputLabel>
                                <OutlinedInput
                                    id="description"
                                    label="Description *"
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        clearError('description');
                                    }}
                                    multiline
                                    rows={4}
                                />
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </FormControl>
                        </div>

                        {/* Pricing Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Pricing Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(offer === OfferType.ForSale || offer === OfferType.ForSaleOrLease) && (
                                    <FormControl variant="outlined" fullWidth error={!!errors.askingPrice}>
                                        <InputLabel htmlFor="askingPrice">Asking Price *</InputLabel>
                                        <OutlinedInput
                                            id="askingPrice"
                                            label="Asking Price *"
                                            value={askingPrice}
                                            onChange={(e) => {
                                                setAskingPrice(e.target.value);
                                                clearError('askingPrice');
                                            }}
                                            type="number"
                                        />
                                        {errors.askingPrice && <div className="text-red-500 text-sm mt-1">{errors.askingPrice}</div>}
                                    </FormControl>
                                )}

                                {(offer === OfferType.ForLease || offer === OfferType.ForSaleOrLease) && (
                                    <FormControl variant="outlined" fullWidth error={!!errors.pricePerSF}>
                                        <InputLabel htmlFor="pricePerSF">Price per SF *</InputLabel>
                                        <OutlinedInput
                                            id="pricePerSF"
                                            label="Price per SF *"
                                            value={pricePerSF}
                                            onChange={(e) => {
                                                setPricePerSF(e.target.value);
                                                clearError('pricePerSF');
                                            }}
                                            type="number"
                                        />
                                        {errors.pricePerSF && <div className="text-red-500 text-sm mt-1">{errors.pricePerSF}</div>}
                                    </FormControl>
                                )}

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="leaseAmount">Lease Amount</InputLabel>
                                    <OutlinedInput
                                        id="leaseAmount"
                                        label="Lease Amount"
                                        value={leaseAmount}
                                        onChange={(e) => setLeaseAmount(e.target.value)}
                                        type="number"
                                    />
                                </FormControl>
                            </div>
                        </div>

                        {/* Property Details Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Property Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="buildingSize">Building Size</InputLabel>
                                    <OutlinedInput
                                        id="buildingSize"
                                        label="Building Size"
                                        value={buildingSize}
                                        onChange={(e) => setBuildingSize(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="landSize">Land Size</InputLabel>
                                    <OutlinedInput
                                        id="landSize"
                                        label="Land Size"
                                        value={landSize}
                                        onChange={(e) => setLandSize(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="yearBuilt">Year Built</InputLabel>
                                    <OutlinedInput
                                        id="yearBuilt"
                                        label="Year Built"
                                        value={yearBuilt}
                                        onChange={(e) => setYearBuilt(e.target.value)}
                                        type="number"
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="frontage">Frontage</InputLabel>
                                    <OutlinedInput
                                        id="frontage"
                                        label="Frontage"
                                        value={frontage}
                                        onChange={(e) => setFrontage(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="parking">Parking</InputLabel>
                                    <OutlinedInput
                                        id="parking"
                                        label="Parking"
                                        value={parking}
                                        onChange={(e) => setParking(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="escrow">In Escrow</InputLabel>
                                    <OutlinedInput
                                        id="escrow"
                                        label="In Escrow"
                                        value={escrow}
                                        onChange={(e) => setEscrow(e.target.value)}
                                    />
                                </FormControl>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Address Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormControl variant="outlined" fullWidth error={!!errors.street}>
                                    <InputLabel htmlFor="street">Street Address *</InputLabel>
                                    <OutlinedInput
                                        id="street"
                                        label="Street Address *"
                                        value={street}
                                        onChange={(e) => {
                                            setStreet(e.target.value);
                                            clearError('street');
                                        }}
                                    />
                                    {errors.street && <div className="text-red-500 text-sm mt-1">{errors.street}</div>}
                                </FormControl>

                                <FormControl variant="outlined" fullWidth error={!!errors.city}>
                                    <InputLabel htmlFor="city">City *</InputLabel>
                                    <OutlinedInput
                                        id="city"
                                        label="City *"
                                        value={city}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            clearError('city');
                                        }}
                                    />
                                    {errors.city && <div className="text-red-500 text-sm mt-1">{errors.city}</div>}
                                </FormControl>

                                <FormControl variant="outlined" fullWidth error={!!errors.state}>
                                    <InputLabel htmlFor="state">State *</InputLabel>
                                    <OutlinedInput
                                        id="state"
                                        label="State *"
                                        value={state}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                            clearError('state');
                                        }}
                                    />
                                    {errors.state && <div className="text-red-500 text-sm mt-1">{errors.state}</div>}
                                </FormControl>

                                <FormControl variant="outlined" fullWidth error={!!errors.zipCode}>
                                    <InputLabel htmlFor="zipCode">Zip Code *</InputLabel>
                                    <OutlinedInput
                                        id="zipCode"
                                        label="Zip Code *"
                                        value={zipCode}
                                        onChange={(e) => {
                                            setZipCode(e.target.value);
                                            clearError('zipCode');
                                        }}
                                    />
                                    {errors.zipCode && <div className="text-red-500 text-sm mt-1">{errors.zipCode}</div>}
                                </FormControl>
                            </div>
                        </div>

                        {/* Media & Documents Section */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                Media & Documents
                            </h2>
                            
                            {/* Existing Images (Update mode only) */}
                            {!isAddMode && existingImages.length > 0 && (
                                <div className="mb-6">
                                    <Typography variant="h6" className="mb-3">Current Images ({remainingImages} remaining)</Typography>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {existingImages.map((imageUrl, index) => {
                                            const isMarkedForDeletion = imagesToDelete.includes(imageUrl);
                                            return (
                                                <Card key={index} className={`relative ${isMarkedForDeletion ? 'opacity-50' : ''}`}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={imageUrl}
                                                        alt={`Property image ${index + 1}`}
                                                        className="object-cover"
                                                    />
                                                    <Box className="absolute top-2 right-2">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleImageDelete(imageUrl)}
                                                            disabled={isMarkedForDeletion}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                    {isMarkedForDeletion && (
                                                        <Box className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75">
                                                            <Typography variant="caption" color="error">
                                                                Will be deleted
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Images Upload */}
                            <div className="mb-6">
                                <FormControl variant="outlined" fullWidth error={!!errors.imageFiles}>
                                    <InputLabel htmlFor="images-input">
                                        {isAddMode ? 'Upload Images *' : 'Add New Images'}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="images-input"
                                        type="file"
                                        inputProps={{ accept: "image/*", multiple: true }}
                                        onChange={handleNewImages}
                                    />
                                    {errors.imageFiles && <div className="text-red-500 text-sm mt-1">{errors.imageFiles}</div>}
                                    {newImageFiles.length > 0 && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            {newImageFiles.length} new image(s) selected
                                        </div>
                                    )}
                                </FormControl>
                            </div>

                            {/* Existing PDFs (Update mode only) */}
                            {!isAddMode && existingPdfs.length > 0 && (
                                <div className="mb-6">
                                    <Typography variant="h6" className="mb-3">Current Documents</Typography>
                                    <div className="space-y-2">
                                        {existingPdfs.map((pdfUrl, index) => {
                                            const isMarkedForDeletion = pdfsToDelete.includes(pdfUrl);
                                            const fileName = pdfUrl.split('/').pop() || `Document ${index + 1}`;
                                            return (
                                                <div key={index} className={`flex items-center justify-between p-3 border rounded ${isMarkedForDeletion ? 'opacity-50 bg-red-50' : 'bg-gray-50'}`}>
                                                    <Typography variant="body2" className="flex-1">
                                                        {fileName}
                                                    </Typography>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            href={pdfUrl}
                                                            target="_blank"
                                                            disabled={isMarkedForDeletion}
                                                        >
                                                            View
                                                        </Button>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handlePdfDelete(pdfUrl)}
                                                            disabled={isMarkedForDeletion}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* PDFs Upload */}
                            <div className="mb-6">
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="pdfs-input">
                                        {isAddMode ? 'Upload PDFs' : 'Add New Documents'}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="pdfs-input"
                                        type="file"
                                        inputProps={{ accept: "application/pdf", multiple: true }}
                                        onChange={handleNewPdfs}
                                    />
                                    {newPdfFiles.length > 0 && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            {newPdfFiles.length} new PDF(s) selected
                                        </div>
                                    )}
                                </FormControl>
                            </div>
                        </div>

                        {/* Custom Fields Section (Add mode only) */}
                        {isAddMode && (
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">Custom Fields</h2>
                                    <Button
                                        type="button"
                                        onClick={addCustomField}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Add Field
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {customFields.map((field, index) => (
                                        <div key={index} className="flex space-x-4 items-start">
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel htmlFor={`customFieldKey-${index}`}>Field Name</InputLabel>
                                                <OutlinedInput
                                                    id={`customFieldKey-${index}`}
                                                    label="Field Name"
                                                    value={field.key}
                                                    onChange={(e) => updateCustomField(index, "key", e.target.value)}
                                                />
                                            </FormControl>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel htmlFor={`customFieldValue-${index}`}>Field Value</InputLabel>
                                                <OutlinedInput
                                                    id={`customFieldValue-${index}`}
                                                    label="Field Value"
                                                    value={field.value}
                                                    onChange={(e) => updateCustomField(index, "value", e.target.value)}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                onClick={() => removeCustomField(index)}
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    {customFields.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No custom fields added yet</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Section */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Button
                                variant="outlined"
                                onClick={() => router.push("/admin/dashboard")}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : null}
                            >
                                {submitting 
                                    ? (isAddMode ? "Adding Property..." : "Updating Property...") 
                                    : (isAddMode ? "Add Property" : "Update Property")
                                }
                            </Button>
                        </div>
                    </FormGroup>
                </div>
            </div>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
} 