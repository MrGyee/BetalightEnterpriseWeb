"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { buildWhatsAppLink, defaultWhatsAppMessage } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 hidden md:block">
      <Tooltip>
        <TooltipTrigger
          render={
            <motion.a
              href={buildWhatsAppLink(defaultWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="size-7" fill="white" strokeWidth={0} />
            </motion.a>
          }
        />
        <TooltipContent side="left">Need Help? Chat with Us</TooltipContent>
      </Tooltip>
    </div>
  );
}
