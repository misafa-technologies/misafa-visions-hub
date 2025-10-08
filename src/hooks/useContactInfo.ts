import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  id: string;
  key: string;
  value: string;
  label: string;
  category: string;
}

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from("contact_information")
      .select("*")
      .order("category", { ascending: true });

    if (!error && data) {
      setContactInfo(data);
    }
    setLoading(false);
  };

  const getByKey = (key: string) => contactInfo.find(info => info.key === key)?.value || "";
  const getByCategory = (category: string) => contactInfo.filter(info => info.category === category);

  return { contactInfo, loading, getByKey, getByCategory };
}
