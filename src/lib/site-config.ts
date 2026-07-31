export const siteConfig = {
  name: "Betalight Enterprises Ltd",
  tagline: "Best Solutions For You",
  description:
    "Betalight Enterprises Ltd supplies premium electrical products, solar energy systems, power control equipment and professional installation services across Kenya.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phones: {
    primary: "+254720100045",
    shop1: "+254727672252",
    shop2: "+254735807904",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254735807904",
  email: "sales.megenterprises@gmail.com",
  address: {
    line1: "Mwangaza Arcade, 1st Floor, Room 101",
    line2: "Charles Rubia Road, Nyamakima",
    city: "Nairobi",
    country: "Kenya",
  },
  hours: [
    { days: "Monday – Saturday", time: "8:00 AM – 6:00 PM" },
    { days: "Sunday", time: "10:00 AM – 4:00 PM" },
  ],
  serviceAreas: ["Nairobi", "Kiambu", "Nakuru", "Mombasa", "Kisumu", "Eldoret", "Thika", "Machakos"],
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
    twitter: "",
  },
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
} as const;
