"use client";

import { useState } from 'react';
import { Card, Button, Modal } from "flowbite-react";
import Image from "next/image";
import axios from 'axios';

export function CardComponent({ agentName }: { agentName: string }) {
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
      alert('Failed to send email.');
    }
  };

  return (
    <>
      <Card className="max-w-sm mt-5">
        <div className="flex flex-col items-center pb-10 mt-10">
          <div className="w-36 h-36 mb-3 shadow-lg rounded-full overflow-hidden relative">
            <Image
              alt="Agent image"
              src="/Profile.jpg"
              layout="fill"
              className="object-cover"
            />
          </div>
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {agentName}
          </h5>
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
        <Modal.Header>Contact Form</Modal.Header>
        <Modal.Body>
          {/* Contact form fields */}
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

