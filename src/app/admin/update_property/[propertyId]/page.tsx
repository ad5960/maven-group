import UpdatePropertyForm from "@/app/components/updatePropertyForm";

interface PageProps {
    params: {
      propertyId: string;
    };
  }
  
  export default function UpdatePropertyPage({ params }: PageProps) {
    const { propertyId } = params;
  
    console.log("Navigated to update page for property ID:", propertyId);
  
    return <UpdatePropertyForm propertyId={propertyId} />;
  }