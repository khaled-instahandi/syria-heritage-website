"use client";

import { useState } from "react";
import { DonationsService } from "@/lib/services";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";
import Image from "next/image";

interface DonationStatusDialogProps {
  donationId: number;
  receipt_url: string | null;
  status: string;
  onStatusChange: (newStatus: string) => void;
}

export function DonationStatusDialog({
  donationId,
  receipt_url,
  status,
  onStatusChange,
}: DonationStatusDialogProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleStatusChange = async (newStatus: "approve" | "reject") => {
    setLoading(true);

    try {
      const response = await DonationsService.update(donationId, { status: newStatus });

      if (response.status === 'success') {
        toast.success(
          t(newStatus === "approve" ? "donations.approved" : "donations.rejected")
        );
        onStatusChange(newStatus === "approve" ? "approved" : "rejected");
        setIsOpen(false);
      } else {
        throw new Error(response.message || `Failed to ${newStatus} donation`);
      }
    } catch (error: any) {
        console.error(`Error ${newStatus}ing donation:`, error);
        
        // عرض رسالة الخطأ المناسبة
        if (error.status === 403) {
          toast.error(t("common.unauthorized"));
        } else if (error.status === 404) {
          toast.error(t("common.notFound"));
        } else if (error.errors) {
          // عرض أخطاء التحقق
          Object.values(error.errors).forEach((messages: any) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(msg));
            }
          });
        } else {
          toast.error(error.message || t("donations.statusUpdateError"));
        }
      } finally {
        setLoading(false);
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("donations.reviewTitle")}</DialogTitle>
          <DialogDescription>
            {t("donations.reviewDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {receipt_url ? (
            <div className="relative w-full h-64">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              )}
              <Image
                src={receipt_url}
                alt="Receipt"
                fill
                className="object-contain rounded-lg"
                onLoadingComplete={() => setImageLoading(false)}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              {t("donations.noReceipt")}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {status === "pending" && (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleStatusChange("reject")}
                disabled={loading}
              >
                {loading ? t("donations.processing") : t("donations.reject")}
              </Button>
              <Button
                type="button"
                onClick={() => handleStatusChange("approve")}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? t("donations.processing") : t("donations.approve")}
              </Button>
            </>
          )}
          {status === "approved" && (
            <div className="text-emerald-600 font-medium">
              {t("donations.alreadyApproved")}
            </div>
          )}
          {status === "rejected" && (
            <div className="text-red-600 font-medium">
              {t("donations.alreadyRejected")}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}