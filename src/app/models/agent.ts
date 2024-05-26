export default interface Agent {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    photo: string; // Assuming the photo is stored as a URL or file path
}