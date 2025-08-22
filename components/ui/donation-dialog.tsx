"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface DonationDialogProps {
  mosqueId: number;
  mosqueName: string;
}

export function DonationDialog({ mosqueId, mosqueName }: DonationDialogProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: "",
    amount: "",
    payment_method: t("mosques.details.donation.paymentMethods.cash"),
    receipt_url: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("mosque_id", mosqueId.toString());
      formDataToSend.append("donor_name", formData.donor_name);
      formDataToSend.append("amount", formData.amount);
      // Convert payment method to Arabic before sending
      const arabicPaymentMethod =
        formData.payment_method === "Cash"
          ? "كاش"
          : formData.payment_method === "Transfer"
          ? "حوالة"
          : formData.payment_method === "Card"
          ? "بطاقة"
          : formData.payment_method === "CashSham"
          ? "كاش شام"
          : "أخرى";
      formDataToSend.append("payment_method", arabicPaymentMethod);
      if (formData.receipt_url) {
        formDataToSend.append("receipt_url", formData.receipt_url);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/donations`,
        {
          method: "POST",
          headers: {
            Accept: "multipart/form-data",
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit donation");
      }

      toast.success(t("mosques.details.donation.success"));
      setIsOpen(false);
      setFormData({
        donor_name: "",
        amount: "",
        payment_method: "كاش",
        receipt_url: null,
      });
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast.error(t("mosques.details.donation.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, receipt_url: e.target.files[0] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
          <Heart className="w-4 h-4 ml-2" />
          {t("mosques.details.sidebar.donateToMosque")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("mosques.details.donation.title")}</DialogTitle>
          <DialogDescription>
            {t("mosques.details.donation.description", { mosqueName })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="donor_name" className="text-right">
                {t("mosques.details.donation.donorName")}
              </Label>
              <Input
                id="donor_name"
                value={formData.donor_name}
                onChange={(e) =>
                  setFormData({ ...formData, donor_name: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                {t("mosques.details.donation.amount")}
              </Label>
              <Input
                id="amount"
                min={1}
                type="number"
                value={formData.amount}
                onChange={
                  (e) => {
                    if (parseFloat(e.target.value) <= 0) {
                      toast.error(t("mosques.details.donation.error"));
                      return;
                    } else {
                      setFormData({ ...formData, amount: e.target.value });
                    }
                  }
                  // setFormData({ ...formData, amount: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment_method" className="text-right">
                {t("mosques.details.donation.paymentMethod")}
              </Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_method: value })
                }
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={t("mosques.details.donation.paymentMethods.cash")}
                  >
                    {t("mosques.details.donation.paymentMethods.cash")}
                  </SelectItem>
                  <SelectItem
                    value={t(
                      "mosques.details.donation.paymentMethods.transfer"
                    )}
                  >
                    {t("mosques.details.donation.paymentMethods.transfer")}
                  </SelectItem>
                  <SelectItem
                    value={t("mosques.details.donation.paymentMethods.card")}
                  >
                    {t("mosques.details.donation.paymentMethods.card")}
                  </SelectItem>
                  <SelectItem
                    value={t(
                      "mosques.details.donation.paymentMethods.cashSham"
                    )}
                  >
                    {t("mosques.details.donation.paymentMethods.cashSham")}
                  </SelectItem>
                  <SelectItem
                    value={t("mosques.details.donation.paymentMethods.other")}
                  >
                    {t("mosques.details.donation.paymentMethods.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receipt" className="text-right">
                {t("mosques.details.donation.receipt")}
              </Label>
              <Input
                id="receipt"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
                accept="image/*,.pdf"
                required
              />
            </div>
            {/* previwe image */}
          </div>
          {formData.receipt_url && (
            <div className="col-span-3 my-4">
              <img
                src={URL.createObjectURL(formData.receipt_url)}
                alt="preview"
                className="w-full h-24 object-cover rounded-md"
              />
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("mosques.details.donation.submitting")
                : t("mosques.details.donation.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
