export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function verificationEmail(code: string, name: string): EmailTemplate {
  return {
    subject: "Vérification de votre email - Nova Studio",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <h1 style="color: #7c3aed;">Bienvenue chez Nova Studio</h1>
        <p>Bonjour ${name},</p>
        <p>Merci pour votre intérêt. Voici votre code de vérification :</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #7c3aed;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Ce code est valable 24 heures. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        <p style="margin-top: 32px; font-size: 12px; color: #999;">Nova Studio - Agence de création digitale</p>
      </div>
    `,
    text: `Bienvenue chez Nova Studio. Bonjour ${name}, votre code de vérification est : ${code}. Ce code est valable 24 heures.`,
  };
}

export function ticketCreatedEmail(ticketCode: string, name: string, type: string): EmailTemplate {
  return {
    subject: `Nouvelle demande reçue - ${ticketCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <h1 style="color: #7c3aed;">Nouvelle demande</h1>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre demande (${type}) sous le code <strong>${ticketCode}</strong>.</p>
        <p>Notre équipe l'examinera sous peu.</p>
        <p style="margin-top: 32px; font-size: 12px; color: #999;">Nova Studio</p>
      </div>
    `,
    text: `Bonjour ${name}, nous avons bien reçu votre demande (${type}) sous le code ${ticketCode}.`,
  };
}

export function statusUpdateEmail(ticketCode: string, name: string, newStatus: string): EmailTemplate {
  return {
    subject: `Mise à jour de votre demande - ${ticketCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <h1 style="color: #7c3aed;">Mise à jour</h1>
        <p>Bonjour ${name},</p>
        <p>Votre demande <strong>${ticketCode}</strong> est maintenant : <strong>${newStatus}</strong>.</p>
        <p style="margin-top: 32px; font-size: 12px; color: #999;">Nova Studio</p>
      </div>
    `,
    text: `Bonjour ${name}, votre demande ${ticketCode} est maintenant : ${newStatus}.`,
  };
}

export function newMessageEmail(ticketCode: string, name: string, sender: string): EmailTemplate {
  return {
    subject: `Nouveau message - ${ticketCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <h1 style="color: #7c3aed;">Nouveau message</h1>
        <p>Bonjour ${name},</p>
        <p>Vous avez reçu un nouveau message de <strong>${sender}</strong> sur la demande <strong>${ticketCode}</strong>.</p>
        <p><a href="https://novastudio.fr/chat?code=${ticketCode}" style="color: #7c3aed;">Accéder au chat</a></p>
        <p style="margin-top: 32px; font-size: 12px; color: #999;">Nova Studio</p>
      </div>
    `,
    text: `Bonjour ${name}, nouveau message de ${sender} sur ${ticketCode}. https://novastudio.fr/chat?code=${ticketCode}`,
  };
}
