import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  visible: boolean | null;
  display_order: number | null;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services_offered")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  return { services, loading };
}
