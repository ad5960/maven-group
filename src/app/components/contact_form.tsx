import AgentCard from "./agent_card";
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
export default function ContactForm () {
    return (
        <>
            <div className="flex flex-col  w-1/2 h-[75vh] border border-slate-400 border-x-4 rounded-lg">
                <p className="mx-2 my-4 font-bold text-2xl">Contact an agent</p>
                <AgentCard/>
                <AgentCard />
                <p className="mx-2 my-4 font-bold">Send a Message</p>
                <div className="mx-2 space-y-4">
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="name-input">Full Name</InputLabel>
                        <OutlinedInput id="name-input" label="Full Name" />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
                        <OutlinedInput id="phone-input" label="Phone Number" />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="email-input">Email Address</InputLabel>
                        <OutlinedInput id="email-input" label="Email Address" />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="msg-input">Message</InputLabel>
                        <OutlinedInput id="msg-input" label="Message" minRows={4} multiline />
                    </FormControl>
                </div>
            </div>
        </>
    )
}