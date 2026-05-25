import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink } from "@/lib/utils";

export function WhatsAppButton({
  phone,
  label = "WhatsApp",
  size = "sm",
}: {
  phone: string;
  label?: string;
  size?: "sm" | "default";
}) {
  if (!phone.trim()) return null;
  return (
    <Button variant="outline" size={size} asChild className="h-8 gap-1.5">
      <a
        href={formatWhatsAppLink(phone)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        {label}
      </a>
    </Button>
  );
}
