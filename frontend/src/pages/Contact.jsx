import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserAuthContext } from "../AuthProvider";
import { submitContact } from "../services/contactService";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const { success, message, error } = await submitContact(form);
    if (success) {
      setStatus({ type: "success", msg: message });
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus({ type: "error", msg: error });
    }
  };

  return (
    <div className="page contact-page">
      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">We would love to hear from you.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-item"><h3>Email</h3><p>hello@schatzen.com</p></div>
          <div className="contact-item"><h3>Phone</h3><p>+977 (000) 000-0000</p></div>
          <div className="contact-item"><h3>Location</h3><p>Available nationwide</p></div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          {status && <p className={`form-message ${status.type}`}>{status.msg}</p>}
          {["name", "email", "phone"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                onChange={handleChange}
                required={field !== "phone"}
                placeholder={field === "name" ? "Your name" : field === "email" ? "you@example.com" : "+977 (000) 000-0000"}
              />
            </div>
          ))}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Tell us about your project..." value={form.message} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
