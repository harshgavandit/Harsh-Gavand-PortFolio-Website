import { motion, useInView } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const resumeUrl = "/Harsh_Gavand_Resume.pdf";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "harshgavand2@gmail.com",
    href: "mailto:harshgavand2@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Mumbai, India",
    href: null,
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/harshgavandit" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/harsh-gavand" },
];

export const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Message ready",
        description: "Thanks for reaching out. I will get back to you within 24 hours.",
      });
      setIsSubmitting(false);
      e.target.reset();
    }, 1100);
  };

  const fieldClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#52525B] focus:border-indigo-300/50 focus:bg-white/[0.065]";

  return (
    <section id="contact" className="section-shell">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(99,102,241,0.14),transparent_55%)]" aria-hidden="true" />
      <div className="section-container relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="section-kicker mb-3">Contact</p>
          <h2 className="section-title text-balance mb-4">Have a role, product, or build in mind?</h2>
          <p className="section-copy">
            I am open to full-time, contract, and freelance opportunities across full-stack development,
            AI applications, SaaS dashboards, and automation-focused products.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.62, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-border glass-card rounded-[2rem] p-6"
          >
            <div className="mb-8 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
              <div className="mb-2 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                </span>
                <span className="font-heading text-lg font-bold text-white">Available now</span>
              </div>
              <p className="text-sm leading-7 text-[#A1A1AA]">
                Best fit: full-stack roles, SaaS products, AI tooling, backend APIs, and fast-moving product teams.
              </p>
            </div>

            <div className="space-y-4">
              {contactLinks.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-400/10 text-[#A5B4FC]">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#71717A]">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1 block text-sm font-semibold text-white">
                        {value}
                      </a>
                    ) : (
                      <span className="mt-1 block text-sm font-semibold text-white">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
                >
                  <Icon size={15} /> {label}
                </a>
              ))}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#09090B]"
              >
                <Download size={15} /> Resume
              </a>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.62, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="premium-card rounded-[2rem] p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">Name</span>
                  <input type="text" name="name" required placeholder="Your name" className={fieldClass} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">Email</span>
                  <input type="email" name="email" required placeholder="your@email.com" className={fieldClass} />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">Subject</span>
                <input type="text" name="subject" placeholder="Full-stack role, AI product, freelance build..." className={fieldClass} />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#71717A]">Message</span>
                <textarea name="message" required rows={6} placeholder="Tell me what you are building or hiring for..." className={`${fieldClass} resize-none`} />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="magnetic-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#09090B] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#09090B]/20 border-t-[#09090B]" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-8 flex justify-center"
        >
          <a href="#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#A5B4FC]">
            Review project evidence first <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
