"use client";

import { useState } from 'react';
import { Card, Button, Modal } from "flowbite-react";
import Image from "next/image";
import axios from 'axios';

export function CardComponent() {
  const [isOpen, setIsOpen] = useState(false);
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

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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
      closeModal();
      alert('Email sent successfully');
    } catch (error) {
      alert('Failed to send email bc');
    }
  };

  return (
    <>
      <Card className="max-w-sm mt-5">
        <div className="flex flex-col items-center pb-10 mt-10">
          <div className="w-36 h-36 mb-3 shadow-lg rounded-full overflow-hidden relative">
            <Image
              alt="Bonnie image"
              src="/Profile.jpg"
              layout="fill"
              className="object-cover"
            />
          </div>
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
           Christopher Mavian
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
          </span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <Button
              onClick={openModal}
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Contact
            </Button>
          </div>
        </div>
      </Card>

      <Modal show={isOpen} onClose={closeModal}>
        <Modal.Header>
          Contact Form
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
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
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} className="w-full bg-cyan-700 text-white hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300">
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
