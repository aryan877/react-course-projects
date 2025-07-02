import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { useTheme } from "@/hooks/useTheme";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const { isDarkMode, typography } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const textColor = isDarkMode ? "text-gray-200" : "text-gray-800";
  const titleColor = isDarkMode ? "text-white" : "text-gray-900";
  const inputStyles = `w-full px-4 py-3 rounded-lg border font-semibold ${
    isDarkMode
      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-300"
      : "bg-white border-gray-500 text-gray-900 placeholder-gray-700"
  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "john.doe@example.com",
      href: "mailto:john.doe@example.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      href: "#",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <Section id="contact" title="Get In Touch">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className={`${typography.bodySize} ${textColor} max-w-2xl mx-auto font-semibold`}
          >
            I&apos;m always interested in hearing about new opportunities and
            interesting projects. Whether you have a question or just want to
            say hi, Ill try my best to get back to you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <h3 className={`text-2xl font-bold mb-6 ${titleColor}`}>
              Send Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-bold mb-2 ${textColor}`}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textColor}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputStyles}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textColor}`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={inputStyles}
                  placeholder="Your message..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card>
              <h3 className={`text-2xl font-bold mb-6 ${titleColor}`}>
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "bg-blue-900/40 text-blue-200"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <info.icon size={20} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${textColor}`}>
                        {info.label}
                      </p>
                      <p className={`font-bold ${titleColor}`}>{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <h3 className={`text-2xl font-bold mb-6 ${titleColor}`}>
                Follow Me
              </h3>

              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      isDarkMode
                        ? "border-gray-500 text-gray-200 hover:border-blue-400 hover:text-blue-300"
                        : "border-gray-500 text-gray-800 hover:border-blue-600 hover:text-blue-700"
                    }`}
                    title={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </Card>

            {/* Availability */}
            <Card>
              <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>
                Availability
              </h3>
              <p
                className={`${typography.bodySize} ${textColor} font-semibold`}
              >
                I&apos;m currently available for freelance projects and
                full-time opportunities. I typically respond to messages within
                24 hours.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm font-semibold ${textColor}`}>
                  Available for new projects
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
