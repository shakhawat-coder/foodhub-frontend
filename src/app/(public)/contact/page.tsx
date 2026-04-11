"use client";

import React from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { contactsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/common/MotionWrapper";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await contactsAPI.create(values);
      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-blue-500" />,
      title: "Phone Number",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    },
    {
      icon: <Mail className="w-6 h-6 text-emerald-500" />,
      title: "Email Address",
      details: ["support@foodhub.com", "info@foodhub.com"],
    },
    {
      icon: <MapPin className="w-6 h-6 text-rose-500" />,
      title: "Our Location",
      details: ["123 Foodie Street, Gourmet City", "New York, NY 10001, USA"],
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", color: "hover:text-blue-600" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:text-sky-500" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:text-pink-500" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", color: "hover:text-blue-700" },
  ];

  return (
    <main className="min-h-screen pt-20 md:pt-32 pb-20 bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Get in Touch"
          title="We'd Love to Hear From You"
          description="Have questions about our service, restaurants, or anything else? Our team is ready to help."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <StaggerContainer className="space-y-6">
              {contactInfo.map((info, index) => (
                <StaggerItem key={index}>
                  <Card className="border-none shadow-sm bg-background hover:bg-muted/30 transition-colors">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-xs shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeInUp className="pt-6">
              <h3 className="font-bold text-xl mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center transition-all ${social.color} hover:-translate-y-1 hover:shadow-md`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </FadeInUp>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FadeInUp>
              <Card className="border-none shadow-2xl shadow-muted/20 overflow-hidden bg-background">
                <CardContent className="p-8 md:p-12">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2">Send us a message</h3>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className="bg-muted/30 border-none h-12 focus-visible:ring-primary/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} className="bg-muted/30 border-none h-12 focus-visible:ring-primary/20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help you?" {...field} className="bg-muted/30 border-none h-12 focus-visible:ring-primary/20" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="State your requirements..."
                                className="min-h-[150px] bg-muted/30 border-none resize-none focus-visible:ring-primary/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto h-12 px-8 text-base font-semibold transition-all hover:scale-[1.02]">
                        {isSubmitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>
        </div>

        {/* Map Placeholder */}
        <FadeInUp className="mt-20">
          <div className="w-full h-[450px] rounded-3xl overflow-hidden bg-muted relative group shadow-lg">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" />
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-1000" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 text-center max-w-sm transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-xl mb-2">Our Headquarters</h4>
                <p className="text-muted-foreground mb-6 leading-relaxed">123 Foodie Street, Gourmet City, NY 10001, United States</p>
                <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all">Get Directions</Button>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </main>
  );
}
