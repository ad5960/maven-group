"use client"
import { Button, FormControl, FormGroup, InputLabel, OutlinedInput } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation"

export default function page() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const router = useRouter()

    async function handleSubmit() {
        try {
            const res = await axios.post("/admin/add_agent/api", {
                "name": name,
                "email": email,
                "phoneNumber": phoneNumber,
                "licenseNumber": licenseNumber,
                "photo": "#"
            });
            console.log("Agent added:", res.data);
            router.push("/admin/dashboard");
        } catch (error) {
            console.error("Error adding agent:", error);
        }
    }
    return (<>
        <div className="flex w-full h-full justify-center">
            <div className="flex flex-col items-center">
                <p className="text-4xl font-semibold my-10">Add an Agent</p>
                <FormGroup className="mx-2 space-y-4">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="name-input">Name</InputLabel>
                        <OutlinedInput
                            id="name-input"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="email-input">Email</InputLabel>
                        <OutlinedInput
                            id="email-input"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
                        <OutlinedInput
                            id="phone-input"
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="license-input">License Number</InputLabel>
                        <OutlinedInput
                            id="license-input"
                            label="License Number"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </FormGroup>
            </div>
        </div>
    </>)
}