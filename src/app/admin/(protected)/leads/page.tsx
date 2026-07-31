import { Download } from "lucide-react";
import { leadsStore } from "@/lib/store/leads.store";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-KE", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ExportLink({ type }: { type: string }) {
  return (
    <a href={`/api/leads/export?type=${type}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
      <Download className="size-3.5" />
      Export CSV
    </a>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-8 text-center text-muted-foreground">
        No entries yet.
      </TableCell>
    </TableRow>
  );
}

export default async function AdminLeadsPage() {
  const leads = await leadsStore.getAll();

  return (
    <div>
      <AdminListHeader title="Leads" description="Quote requests, messages and newsletter signups submitted through the website." />

      <div className="mt-6">
        <Tabs defaultValue="quoteRequests">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
            <TabsTrigger value="quoteRequests">Quote Requests ({leads.quoteRequests.length})</TabsTrigger>
            <TabsTrigger value="contactMessages">Contact Messages ({leads.contactMessages.length})</TabsTrigger>
            <TabsTrigger value="newsletterSubscribers">Newsletter ({leads.newsletterSubscribers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="quoteRequests" className="mt-6">
            <div className="mb-3 flex justify-end">
              <ExportLink type="quoteRequests" />
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.quoteRequests.length === 0 && <EmptyRow colSpan={8} />}
                  {leads.quoteRequests.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.county}</TableCell>
                      <TableCell>{lead.serviceCategory}</TableCell>
                      <TableCell>{lead.productInterest || "—"}</TableCell>
                      <TableCell className="max-w-xs whitespace-normal">{lead.message || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="contactMessages" className="mt-6">
            <div className="mb-3 flex justify-end">
              <ExportLink type="contactMessages" />
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.contactMessages.length === 0 && <EmptyRow colSpan={6} />}
                  {leads.contactMessages.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.subject}</TableCell>
                      <TableCell className="max-w-xs whitespace-normal">{lead.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="newsletterSubscribers" className="mt-6">
            <div className="mb-3 flex justify-end">
              <ExportLink type="newsletterSubscribers" />
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.newsletterSubscribers.length === 0 && <EmptyRow colSpan={2} />}
                  {leads.newsletterSubscribers.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="font-medium text-foreground">{lead.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
