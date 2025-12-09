import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();

// Configure API key authorization: api-key
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || 'dummy');

const sender = {
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@resumebuilder.com',
    name: process.env.BREVO_SENDER_NAME || 'ATS Resume',
};

export async function sendPasswordResetEmail(email: string, token: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Reset your password';
    sendSmtpEmail.htmlContent = `<html><body><p>Click the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p></body></html>`;
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = [{ email: email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Password reset email sent successfully. Returned data: ' + JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error };
    }
}

export async function sendVerificationEmail(email: string, token: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/verify-email?token=${token}`;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Verify your email';
    sendSmtpEmail.htmlContent = `<html><body><p>Click the link to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p></body></html>`;
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = [{ email: email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Verification email sent successfully. Returned data: ' + JSON.stringify(data));
        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error };
    }
}
