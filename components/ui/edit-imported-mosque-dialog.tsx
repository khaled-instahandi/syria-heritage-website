"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { ImportedMosque } from "@/types/imported-mosques"
import { ImportedMosquesService } from "@/lib/services/imported-mosques"
import { Save, X, Loader2 } from "lucide-react"

interface EditImportedMosqueDialogProps {
    mosque: ImportedMosque | null
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

export function EditImportedMosqueDialog({
    mosque,
    isOpen,
    onClose,
    onUpdate
}: EditImportedMosqueDialogProps) {
    const [formData, setFormData] = useState({
        batch_id: "",
        name_ar: "",
        name_en: "",
        governorate: "",
        district: "",
        sub_district: "",
        neighborhood: "",
        address_text: "",
        damage_level: "",
        estimated_cost: "",
        is_reconstruction: false,
        committee_name: "",
        notes: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when mosque changes
    useEffect(() => {
        if (mosque) {
            setFormData({
                batch_id: mosque.batch_id.toString(),
                name_ar: mosque.name_ar,
                name_en: mosque.name_en,
                governorate: mosque.governorate,
                district: mosque.district,
                sub_district: mosque.sub_district,
                neighborhood: mosque.neighborhood,
                address_text: mosque.address_text,
                damage_level: mosque.damage_level,
                estimated_cost: mosque.estimated_cost,
                is_reconstruction: mosque.is_reconstruction === 1,
                committee_name: mosque.committee_name,
                notes: mosque.notes
            })
        }
    }, [mosque])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mosque) return

        setIsSubmitting(true)
        try {
            const updateData = {
                batch_id: parseInt(formData.batch_id),
                name_ar: formData.name_ar,
                name_en: formData.name_en,
                governorate: formData.governorate,
                district: formData.district,
                sub_district: formData.sub_district,
                neighborhood: formData.neighborhood,
                address_text: formData.address_text,
                damage_level: formData.damage_level,
                estimated_cost: formData.estimated_cost,
                is_reconstruction: formData.is_reconstruction ? 1 : 0,
                committee_name: formData.committee_name,
                notes: formData.notes
            }

            await ImportedMosquesService.updateImportedMosque(mosque.id, updateData)

            toast({
                title: "تم التحديث",
                description: "تم تحديث بيانات المسجد بنجاح",
            })

            onUpdate()
            onClose()
        } catch (error) {
            console.error('Error updating mosque:', error)
            toast({
                title: "خطأ في التحديث",
                description: "فشل في تحديث بيانات المسجد، يرجى المحاولة مرة أخرى",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (!mosque) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        تعديل بيانات المسجد المستورد
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="batch_id">رقم الدفعة</Label>
                            <Input
                                id="batch_id"
                                type="number"
                                value={formData.batch_id}
                                onChange={(e) => handleInputChange("batch_id", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name_ar">اسم المسجد (عربي)</Label>
                            <Input
                                id="name_ar"
                                value={formData.name_ar}
                                onChange={(e) => handleInputChange("name_ar", e.target.value)}
                                required
                                placeholder="أدخل اسم المسجد بالعربية"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name_en">اسم المسجد (إنجليزي)</Label>
                            <Input
                                id="name_en"
                                value={formData.name_en}
                                onChange={(e) => handleInputChange("name_en", e.target.value)}
                                placeholder="أدخل اسم المسجد بالإنجليزية"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="committee_name">اسم اللجنة</Label>
                            <Input
                                id="committee_name"
                                value={formData.committee_name}
                                onChange={(e) => handleInputChange("committee_name", e.target.value)}
                                placeholder="أدخل اسم اللجنة المسؤولة"
                            />
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">معلومات الموقع</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="governorate">المحافظة</Label>
                                <Input
                                    id="governorate"
                                    value={formData.governorate}
                                    onChange={(e) => handleInputChange("governorate", e.target.value)}
                                    required
                                    placeholder="أدخل اسم المحافظة"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district">المنطقة</Label>
                                <Input
                                    id="district"
                                    value={formData.district}
                                    onChange={(e) => handleInputChange("district", e.target.value)}
                                    required
                                    placeholder="أدخل اسم المنطقة"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sub_district">الناحية</Label>
                                <Input
                                    id="sub_district"
                                    value={formData.sub_district}
                                    onChange={(e) => handleInputChange("sub_district", e.target.value)}
                                    required
                                    placeholder="أدخل اسم الناحية"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="neighborhood">الحي</Label>
                                <Input
                                    id="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                                    required
                                    placeholder="أدخل اسم الحي"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address_text">العنوان التفصيلي</Label>
                            <Textarea
                                id="address_text"
                                value={formData.address_text}
                                onChange={(e) => handleInputChange("address_text", e.target.value)}
                                placeholder="أدخل العنوان التفصيلي (اختياري)"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Project Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">معلومات المشروع</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="damage_level">مستوى الضرر</Label>
                                <Select
                                    value={formData.damage_level}
                                    onValueChange={(value) => handleInputChange("damage_level", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر مستوى الضرر" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="جزئي">جزئي</SelectItem>
                                        <SelectItem value="كامل">كامل</SelectItem>
                                        {/* <SelectItem value="متوسط">متوسط</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimated_cost">التكلفة التقديرية (دولار)</Label>
                                <Input
                                    id="estimated_cost"
                                    type="number"
                                    step="0.01"
                                    value={formData.estimated_cost}
                                    onChange={(e) => handleInputChange("estimated_cost", e.target.value)}
                                    placeholder="أدخل التكلفة التقديرية"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <Label htmlFor="is_reconstruction" className="text-base font-medium">
                                    نوع المشروع
                                </Label>
                                <p className="text-sm text-slate-600">
                                    {formData.is_reconstruction ? "إعادة إعمار" : "ترميم"}
                                </p>
                            </div>
                            <Switch
                                className="custom-switch"
                                id="is_reconstruction"
                                checked={formData.is_reconstruction}
                                onCheckedChange={(checked) => handleInputChange("is_reconstruction", checked)}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            placeholder="أدخل أي ملاحظات إضافية (اختياري)"
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            <X className="w-4 h-4 ml-2" />
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 ml-2" />
                                    حفظ التغييرات
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
