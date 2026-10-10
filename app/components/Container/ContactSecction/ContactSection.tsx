"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

import { createContact } from "@/app/store/slice/contactSlice";
import type { AppDispatch } from "@/app/store/store";
import type { RootState } from "@/app/store/rootReducer";

const ContactSection = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isSubmitting, success, error } = useSelector(
    (state: RootState) => state.contact,
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(createContact(form)).unwrap();

      setForm({
        name: "",
        email: "",
        mobile: "",
        message: "",
      });
    } catch {}
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const leftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const rightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f8f5] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-7xl px-4 md:px-8 "
      >
        <motion.div
          variants={itemVariants}
          className="mb-12 text-center lg:mb-16"
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#003B1F]">
            Get In Touch
          </span>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Let&apos;s Start a Conversation
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Have a question, suggestion, or need help? Send us a message and our
            team will get back to you shortly.
          </p>
        </motion.div>

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] lg:grid-cols-2">
          <motion.div
            variants={leftVariants}
            className="relative min-h-[420px] overflow-hidden lg:min-h-[650px]"
          >
            <Image
              src="/images/contact-bg.jpg"
              alt="Contact us"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/70">
                  We&apos;re here to help
                </p>

                <h3 className="max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
                  Have something to talk about?
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                  Whether you have a question about our products or simply want
                  to say hello, we would love to hear from you.
                </p>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Mail size={17} />
                    </span>
                    <span className="text-sm">hello@example.com</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Phone size={17} />
                    </span>
                    <span className="text-sm">+91 98765 43210</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <MapPin size={17} />
                    </span>
                    <span className="text-sm">Chennai, Tamil Nadu</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={rightVariants}
            className="flex items-center p-6 sm:p-10 lg:p-14"
          >
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-8">
                <p className="text-sm font-medium text-[#003B1F]">Contact Us</p>

                <h3 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                  Send us a message
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Fill in the details below and we&apos;ll get back to you.
                </p>
              </div>

              <div className="space-y-5">
                <motion.div variants={itemVariants}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <motion.input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#003B1F] focus:bg-white focus:ring-4 focus:ring-[#003B1F]/5"
                  />
                </motion.div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <motion.div variants={itemVariants}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email
                    </label>

                    <motion.input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#003B1F] focus:bg-white focus:ring-4 focus:ring-[#003B1F]/5"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mobile
                    </label>

                    <motion.input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="Mobile number"
                      required
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#003B1F] focus:bg-white focus:ring-4 focus:ring-[#003B1F]/5"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Message
                  </label>

                  <motion.textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#003B1F] focus:bg-white focus:ring-4 focus:ring-[#003B1F]/5"
                  />
                </motion.div>

                <AnimatePresence mode="wait">
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                    >
                      Enquiry submitted successfully!
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
                  whileTap={!isSubmitting ? { scale: 0.97 } : undefined}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#003B1F] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#003B1F]/10 transition hover:bg-[#00552d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Submitting...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Submit Enquiry
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
