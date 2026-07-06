import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Github, Linkedin, Send, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/harshgavandit",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "#",
  },
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
        title: "Message sent",
        description: "Thanks for reaching out. I'll get back to you within 24 hours.",
      });
      setIsSubmitting(false);
      e.target.reset();
    }, 1500);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    backgroundColor: "#111113",
    border: "1px solid #27272A",
    color: "#FAFAFA",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(99,102,241,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
          style={{ color: "#6366F1" }}
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-white mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
        >
          Let's work together
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base mb-12 max-w-lg"
          style={{ color: "#71717A" }}
        >
          Have a project in mind, or just want to connect? I'm currently open to
          full-time, contract, and freelance opportunities.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Status */}
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "#111113", border: "1px solid #1F1F23" }}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "#22C55E",
                    boxShadow: "0 0 8px #22C55E",
                    animation: "glow 3s ease-in-out infinite",
                  }}
                />
                <span className="text-sm font-medium" style={{ color: "#FAFAFA" }}>
                  Available
                </span>
              </div>
              <p className="text-xs" style={{ color: "#71717A" }}>
                Open to new opportunities — remote or Mumbai-based.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              {contactLinks.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg shrink-0 mt-0.5"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.12)",
                    }}
                  >
                    <Icon size={14} style={{ color: "#818CF8" }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "#52525B" }}>
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm transition-colors duration-150"
                        style={{ color: "#A1A1AA" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#FAFAFA"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#A1A1AA"; }}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm" style={{ color: "#A1A1AA" }}>
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs mb-3" style={{ color: "#52525B" }}>
                Find me online
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: "#111113",
                      border: "1px solid #1F1F23",
                      color: "#71717A",
                    }}
                    aria-label={label}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6366F1";
                      e.currentTarget.style.color = "#818CF8";
                      e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#1F1F23";
                      e.currentTarget.style.color = "#71717A";
                      e.currentTarget.style.backgroundColor = "#111113";
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: "#111113", border: "1px solid #1F1F23" }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "#71717A" }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#27272A"; }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "#71717A" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#27272A"; }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "#71717A" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#27272A"; }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "#71717A" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#6366F1"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#27272A"; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-200"
                  style={{
                    background: isSubmitting
                      ? "#27272A"
                      : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
