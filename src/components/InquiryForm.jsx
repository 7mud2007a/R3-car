import React, { useState } from 'react';
import { Send, Mail, User, Car, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import './InquiryForm.css';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    carInterest: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form submission processing
    const recipient = 'bznsman77@gmail.com';
    const subject = encodeURIComponent(`Luxury Car Inquiry: ${formData.carInterest || 'General Inquiry'} - ${formData.name}`);
    const body = encodeURIComponent(
      `Customer Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Car Interested In: ${formData.carInterest}\n\n` +
      `Message:\n${formData.message}`
    );

    // Trigger user mail client fallback
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', carInterest: '', message: '' });
    setSubmitted(false);
  };

  return (
    <section id="inquiry" className="inquiry-section">
      <div className="container">

        <div className="inquiry-wrapper">

          {/* Left Column: Info Box */}
          <div className="inquiry-info-column">
            <span className="section-tag">Direct Inquiry</span>
            <h2 className="section-title">Schedule a Private Viewing</h2>
            <p className="inquiry-info-desc">
              Whether acquiring a flagship super sports car or seeking bespoke automotive consultation, our concierge specialists are at your service.
            </p>

            <div className="inquiry-contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={22} color="#FF6D1F" />
                </div>
                <div>
                  <span className="contact-label">Direct Concierge Email</span>
                  <a href="mailto:bznsman77@gmail.com" className="contact-value">
                    bznsman77@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <ShieldCheck size={22} color="#FF6D1F" />
                </div>
                <div>
                  <span className="contact-label">Confidential & Secure</span>
                  <span className="contact-value-text">
                    All communications remain strictly private.
                  </span>
                </div>
              </div>
            </div>

            <div className="showroom-hours-card">
              <h4 className="hours-title">Private Showroom Hours</h4>
              <p>Monday - Saturday: 09:00 AM - 07:00 PM</p>
              <p>Sunday: By Confidential Appointment Only</p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="inquiry-form-column">
            {submitted ? (
              <div className="form-success-card">
                <CheckCircle size={60} className="success-icon" />
                <h3>Inquiry Transmitted</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Your inquiry regarding <strong>{formData.carInterest || 'our luxury inventory'}</strong> has been initiated to <code>bznsman77@gmail.com</code>.
                </p>
                <p className="success-sub">
                  A representative will reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <button onClick={resetForm} className="btn-secondary" style={{ marginTop: '1.5rem' }}>
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="luxury-form">

                {/* Field: Name */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <User size={16} color="#FF6D1F" />
                    <span>Customer Name *</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g., Lord Alexander Vance"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Field: Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={16} color="#FF6D1F" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g., alexander@vance-holdings.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Field: Car interested in */}
                <div className="form-group">
                  <label htmlFor="carInterest" className="form-label">
                    <Car size={16} color="#FF6D1F" />
                    <span>Car Interested In *</span>
                  </label>
                  <input
                    type="text"
                    id="carInterest"
                    name="carInterest"
                    required
                    placeholder="e.g., 2024 Aston Martin DBS / Ferrari SF90 Stradale"
                    value={formData.carInterest}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Field: Message */}
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    <MessageSquare size={16} color="#FF6D1F" />
                    <span>Message / Special Requests *</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    placeholder="Please specify any specific trim preferences, trade-in considerations, or viewing dates..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary form-submit-btn">
                  <span>Submit Confidential Inquiry</span>
                  <Send size={18} />
                </button>

                <p className="form-footnote">
                  Inquiries target <strong>bznsman77@gmail.com</strong>
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default InquiryForm;
