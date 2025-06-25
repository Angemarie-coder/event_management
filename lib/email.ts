// Email service for sending notifications
export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData): Promise<boolean> {
  // In a real application, you would integrate with an email service like:
  // - SendGrid
  // - AWS SES
  // - Nodemailer with SMTP

  console.log("📧 Email would be sent:", { to, subject })
  console.log("📧 Email content:", html)

  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000)
  })
}

export function generateWelcomeEmail(firstName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Event Manager!</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for signing up! Your account is currently pending approval from an administrator.</p>
      <p>You will receive another email once your account has been approved.</p>
      <p>Best regards,<br>Event Manager Team</p>
    </div>
  `
}

export function generateApprovalEmail(firstName: string, approved: boolean): string {
  const status = approved ? "approved" : "rejected"
  const message = approved
    ? "Your account has been approved! You can now log in and start booking events."
    : "Unfortunately, your account application has been rejected. Please contact support for more information."

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${approved ? "#22c55e" : "#ef4444"};">Account ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
      <p>Hi ${firstName},</p>
      <p>${message}</p>
      <p>Best regards,<br>Event Manager Team</p>
    </div>
  `
}

export function generateBookingEmail(firstName: string, eventTitle: string, approved: boolean): string {
  const status = approved ? "approved" : "rejected"
  const message = approved
    ? `Your booking for "${eventTitle}" has been approved! We look forward to seeing you at the event.`
    : `Unfortunately, your booking for "${eventTitle}" has been rejected. Please contact support for more information.`

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${approved ? "#22c55e" : "#ef4444"};">Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
      <p>Hi ${firstName},</p>
      <p>${message}</p>
      <p>Best regards,<br>Event Manager Team</p>
    </div>
  `
}
