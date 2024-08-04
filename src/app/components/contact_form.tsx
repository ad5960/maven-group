"use client"
import { useEffect, useState } from "react";
import AgentCard from "../agents/[agentId]/page";
import {FormControl, InputLabel, OutlinedInput } from '@mui/material';
import Agent from "../models/agent";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Button } from "flowbite-react";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
      const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        message: false,
      });
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors({ ...errors, [id]: value.trim() === '' });
      };
    
      const handleSubmit = async () => {
        const newErrors = {
          firstName: formData.firstName.trim() === '',
          lastName: formData.lastName.trim() === '',
          email: formData.email.trim() === '',
          phone: formData.phone.trim() === '',
          message: formData.message.trim() === '',
        };
    
        if (Object.values(newErrors).some((error) => error)) {
          setErrors(newErrors);
          return;
        }
    
        try {
          await axios.post('/api/send-email', formData);
          alert('Email sent successfully');
        } catch (error) {
          alert('Failed to send email bc');
        }
      };
    
    return (

        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <form className="space-y-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm`}
                        placeholder="Enter your first name"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm`}
                        placeholder="Enter your last name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm`}
                        placeholder="Enter your email address"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm`}
                        placeholder="Enter your phone number"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm`}
                        placeholder="Write your message here"
                    ></textarea>
                </div>
            </form>
            <Button
                onClick={handleSubmit}
                className="w-full py-2 mt-4 bg-cyan-700 text-white font-semibold rounded-md hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition duration-300 ease-in-out"
            >
                Send
            </Button>
        </div>
    )
}

