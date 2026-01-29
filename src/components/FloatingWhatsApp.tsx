import { MessageCircle } from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";

export function FloatingWhatsApp() {
  const { getByKey } = useContactInfo();
  
  const whatsappNumber = getByKey("whatsapp") || "+1234567890";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
