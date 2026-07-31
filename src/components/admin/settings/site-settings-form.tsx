"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SiteSettingsAdminValues } from "@/lib/validation/admin";
import { updateSiteSettingsAction } from "@/app/actions/admin/settings";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function SiteSettingsForm({ defaultValues }: { defaultValues: SiteSettingsAdminValues }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<SiteSettingsAdminValues>({ defaultValues });

  async function onSubmit(values: SiteSettingsAdminValues) {
    setIsSubmitting(true);
    try {
      const result = await updateSiteSettingsAction(values);
      if (result.success) {
        toast.success("Settings updated.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. The site_settings table may not exist yet — see setup instructions.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 pb-16 lg:max-w-2xl">
      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Phones &amp; Email</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Primary Phone" htmlFor="phonePrimary">
            <Input id="phonePrimary" {...register("phonePrimary")} />
          </FormField>
          <FormField label="WhatsApp Number (no +, e.g. 2547...)" htmlFor="whatsappNumber">
            <Input id="whatsappNumber" {...register("whatsappNumber")} />
          </FormField>
          <FormField label="Shop Phone 1 (optional)" htmlFor="phoneShop1">
            <Input id="phoneShop1" {...register("phoneShop1")} />
          </FormField>
          <FormField label="Shop Phone 2 (optional)" htmlFor="phoneShop2">
            <Input id="phoneShop2" {...register("phoneShop2")} />
          </FormField>
        </div>
        <FormField label="Email" htmlFor="email">
          <Input id="email" type="email" {...register("email")} />
        </FormField>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Address Line 1" htmlFor="addressLine1">
            <Input id="addressLine1" {...register("addressLine1")} />
          </FormField>
          <FormField label="Address Line 2 (optional)" htmlFor="addressLine2">
            <Input id="addressLine2" {...register("addressLine2")} />
          </FormField>
          <FormField label="City" htmlFor="addressCity">
            <Input id="addressCity" {...register("addressCity")} />
          </FormField>
          <FormField label="Country" htmlFor="addressCountry">
            <Input id="addressCountry" {...register("addressCountry")} />
          </FormField>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Hours &amp; Service Areas</h2>
        <FormField label="Business Hours (one entry per line, as: Days | Time)" htmlFor="hoursText">
          <Textarea
            id="hoursText"
            rows={3}
            placeholder="Monday – Saturday | 8:00 AM – 6:00 PM"
            {...register("hoursText")}
          />
        </FormField>
        <FormField label="Service Areas (comma-separated)" htmlFor="serviceAreasText">
          <Textarea id="serviceAreasText" rows={2} {...register("serviceAreasText")} />
        </FormField>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Facebook URL" htmlFor="socialFacebook">
            <Input id="socialFacebook" placeholder="https://facebook.com/..." {...register("socialFacebook")} />
          </FormField>
          <FormField label="Instagram URL" htmlFor="socialInstagram">
            <Input id="socialInstagram" placeholder="https://instagram.com/..." {...register("socialInstagram")} />
          </FormField>
          <FormField label="TikTok URL" htmlFor="socialTiktok">
            <Input id="socialTiktok" placeholder="https://tiktok.com/@..." {...register("socialTiktok")} />
          </FormField>
          <FormField label="Twitter / X URL" htmlFor="socialTwitter">
            <Input id="socialTwitter" placeholder="https://x.com/..." {...register("socialTwitter")} />
          </FormField>
          <FormField label="LinkedIn URL" htmlFor="socialLinkedin">
            <Input id="socialLinkedin" placeholder="https://linkedin.com/company/..." {...register("socialLinkedin")} />
          </FormField>
        </div>
      </section>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
