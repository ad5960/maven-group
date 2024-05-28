import { Button, FormControl, FormGroup, InputLabel, OutlinedInput } from "@mui/material";

export default function page() {
    return (<>
        <div className="flex w-full h-full justify-center">
            <div className="flex flex-col items-center">
                <p className="text-4xl font-semibold my-10">Add a Property</p>
                <FormGroup className="mx-2 space-y-4">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="name-input">Name</InputLabel>
                        <OutlinedInput id="name-input" label="Name" />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="email-input">Email</InputLabel>
                        <OutlinedInput id="email-input" label="Email" />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
                        <OutlinedInput id="phone-input" label="Phone Number" />
                    </FormControl>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="license-input">License Number</InputLabel>
                        <OutlinedInput id="license-input" label="License Number" />
                    </FormControl>
                    <Button type="submit" name="Submit" variant="contained" color="primary">Submit</Button>
                </FormGroup>
            </div>
        </div>
    </>)
}