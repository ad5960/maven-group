import PropertyForm from "@/app/components/PropertyForm";

interface PageProps {
    params: {
      propertyId: string;
    };
  }
  
  export default function UpdatePropertyPage({ params }: PageProps) {
    const { propertyId } = params;
  
    console.log("Navigated to update page for property ID:", propertyId);
  
    return <PropertyForm mode="update" propertyId={propertyId} />;
  }