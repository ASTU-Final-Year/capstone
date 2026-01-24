'use client';

export default function ContactPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>

        {/* Header */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Contact Us
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#4b5563',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Get in touch with the ChoiceX team
        </p>

        {/* Contact Info */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Contact Information
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                📞 Phone Support
              </p>
              <p style={{ color: '#4b5563', marginBottom: '4px' }}>
                +251 911 234 567
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Mon-Fri, 8:30 AM - 5:30 PM EAT
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                ✉️ Email Support
              </p>
              <p style={{ color: '#4b5563', marginBottom: '4px' }}>
                support@choicex.gov.et
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Response within 2-4 hours
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{
                fontWeight: '600',
                color: '#111827',
                marginBottom: '8px'
              }}>
                🏛️ Address
              </p>
              <p style={{ color: '#4b5563', marginBottom: '4px' }}>
                Addis Ababa University
              </p>
              <p style={{ color: '#4b5563' }}>
                Main Campus, 4 Kilo, Addis Ababa, Ethiopia
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px'
          }}>
            Send us a Message
          </h2>

          <form style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Message
                </label>
                <textarea
                  placeholder="How can we help you?"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '14px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="/"
            style={{
              display: 'inline-block',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '16px',
              padding: '10px 20px'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            ← Back to Home
          </a>
        </div>

      </div>
    </div>
  )
}