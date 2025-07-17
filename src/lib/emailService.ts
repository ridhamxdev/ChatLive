import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendInvitationEmail(
  email: string, 
  token: string, 
  inviterName: string = 'Someone'
): Promise<void> {
  const invitationLink = `${process.env.NEXTAUTH_URL}/invite/accept?token=${token}`;
  
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">🎉 You're Invited to Join Our Chat App!</h2>
        
        <p style="color: #666; line-height: 1.6;">
          ${inviterName} has invited you to join our awesome chat application! 
          Connect with friends, share messages, and be part of our community.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${invitationLink}" 
             style="background-color: #0070f3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            🚀 Accept Invitation
          </a>
        </div>
        
        <p style="color: #888; font-size: 14px; margin-top: 30px;">
          <strong>⏰ This invitation will expire in 7 days.</strong><br>
          If you can't click the button above, copy and paste this link into your browser:
        </p>
        
        <p style="word-break: break-all; color: #0070f3; font-size: 12px; background-color: #f0f0f0; padding: 10px; border-radius: 4px;">
          ${invitationLink}
        </p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
  
  const mailOptions: EmailOptions = {
    to: email,
    subject: `🎊 You're invited to join our Chat App!`,
    html: htmlContent,
  };
  
  await transporter.sendMail({
    ...mailOptions,
    from: process.env.EMAIL_FROM,
  });
}
