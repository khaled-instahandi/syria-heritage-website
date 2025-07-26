"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Handshake, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const t = useTranslations("contact")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      title: t("office.title"),
      items: [
        {
          icon: MapPin,
          label: t("info.address"),
          value: t("office.address"),
          color: "text-emerald-600",
          bgColor: "bg-emerald-100",
        },
        {
          icon: Phone,
          label: t("info.phone"),
          value: t("office.phone"),
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          icon: Mail,
          label: t("info.email"),
          value: t("office.email"),
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        },
        {
          icon: Clock,
          label: t("info.hours"),
          value: t("office.hours"),
          color: "text-amber-600",
          bgColor: "bg-amber-100",
        },
      ],
    },
  ]

  const departments = [
    {
      title: t("support.title"),
      email: t("support.email"),
      phone: t("support.phone"),
      icon: MessageCircle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("partnerships.title"),
      email: t("partnerships.email"),
      phone: t("partnerships.phone"),
      icon: Handshake,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Mail className="w-4 h-4" />
            {t("badge")}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">{t("title")}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t("form.title")}</h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{t("form.success")}</h3>
                  <p className="text-slate-600">{t("form.successMessage")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("form.name")} *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder={t("form.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("form.email")} *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder={t("form.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("form.phone")}</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full"
                        placeholder={t("form.phonePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("form.subject")} *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder={t("form.subjectPlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t("form.message")} *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full resize-none"
                      placeholder={t("form.messagePlaceholder")}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        {t("form.send")}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Office Info */}
            {contactInfo.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">{section.title}</h3>
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 mb-1">{item.label}</p>
                          <p className="text-slate-600">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Departments */}
            <div className="grid gap-6">
              {departments.map((dept, index) => (
                <Card
                  key={index}
                  className={`shadow-xl border-0 ${dept.bgColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <dept.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{dept.title}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">{dept.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-700">{dept.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t("map.title")}</h3>
              <p className="text-slate-600">{t("map.description")}</p>
            </div>

            {/* Placeholder for Map */}
            <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">{t("map.interactive")}</p>
                <p className="text-slate-500 text-sm">{t("office.address")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">{t("faq.title")}</h3>
            <p className="text-slate-600">{t("faq.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: t("faq.q1.question"),
                answer: t("faq.q1.answer"),
              },
              {
                question: t("faq.q2.question"),
                answer: t("faq.q2.answer"),
              },
              {
                question: t("faq.q3.question"),
                answer: t("faq.q3.answer"),
              },
              {
                question: t("faq.q4.question"),
                answer: t("faq.q4.answer"),
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h4>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <CardContent className="p-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">{t("cta.title")}</h3>
                <p className="text-emerald-100 text-lg mb-8">
                  {t("cta.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                  >
                    <Phone className="w-5 h-5 ml-2" />
                    {t("cta.callNow")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 transition-all duration-300 px-8 py-4 bg-transparent"
                  >
                    <Users className="w-5 h-5 ml-2" />
                    {t("cta.volunteer")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
