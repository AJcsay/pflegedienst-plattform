import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Email-Konfiguration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true für 465, false für 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

// Transporter erstellen
const transporter = nodemailer.createTransport(emailConfig);

// Email-Template laden und mit Variablen ersetzen
function loadTemplate(templateName: string, variables: Record<string, string>): string {
  const templatePath = path.join(__dirname, "email-templates", `${templateName}.html`);
  let template = fs.readFileSync(templatePath, "utf-8");

  // Alle Variablen ersetzen
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, value);
  });

  return template;
}

// Termin-Bestätigungsemail versenden
export async function sendAppointmentConfirmation(appointmentData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: Date;
  careNeeds?: string;
}) {
  try {
    // Termin-Details formatieren
    const appointmentDate = new Date(appointmentData.preferredDate).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentTime = new Date(appointmentData.preferredDate).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Termintyp übersetzen
    const appointmentTypeLabels: Record<string, string> = {
      initial_consultation: "Erstberatung",
      home_visit: "Hausbesuch",
      care_planning: "Pflegeplanung",
      follow_up: "Nachfolgetermin",
    };

    const appointmentTypeLabel = appointmentTypeLabels[appointmentData.appointmentType] || appointmentData.appointmentType;

    // Template laden und mit Variablen ersetzen
    const htmlContent = loadTemplate("appointment-confirmation", {
      firstName: appointmentData.firstName,
      lastName: appointmentData.lastName,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentTypeLabel,
      email: appointmentData.email,
      phone: appointmentData.phone,
      companyPhone: process.env.COMPANY_PHONE || "+49 (0) 123 456789",
      companyEmail: process.env.COMPANY_EMAIL || "info@curamain.de",
      companyWebsite: process.env.COMPANY_WEBSITE || "https://www.curamain.de",
    });

    // Email versenden
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: appointmentData.email,
      subject: `Terminbestätigung - CuraMain Pflegedienst`,
      html: htmlContent,
      replyTo: process.env.COMPANY_EMAIL || "info@curamain.de",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Terminbestätigungsemail an ${appointmentData.email} versendet`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Fehler beim Versenden der Terminbestätigungsemail:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unbekannter Fehler" };
  }
}

// Admin-Benachrichtigung bei neuer Terminbuchung
export async function sendAdminAppointmentNotification(appointmentData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: Date;
  careNeeds?: string;
}) {
  try {
    const appointmentDate = new Date(appointmentData.preferredDate).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentTime = new Date(appointmentData.preferredDate).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const appointmentTypeLabels: Record<string, string> = {
      initial_consultation: "Erstberatung",
      home_visit: "Hausbesuch",
      care_planning: "Pflegeplanung",
      follow_up: "Nachfolgetermin",
    };

    const appointmentTypeLabel = appointmentTypeLabels[appointmentData.appointmentType] || appointmentData.appointmentType;

    const htmlContent = `
      <h2>Neue Terminbuchung</h2>
      <p><strong>Termin:</strong> ${appointmentDate} um ${appointmentTime}</p>
      <p><strong>Termintyp:</strong> ${appointmentTypeLabel}</p>
      <p><strong>Name:</strong> ${appointmentData.firstName} ${appointmentData.lastName}</p>
      <p><strong>Email:</strong> ${appointmentData.email}</p>
      <p><strong>Telefon:</strong> ${appointmentData.phone}</p>
      ${appointmentData.careNeeds ? `<p><strong>Pflegebedarf:</strong> ${appointmentData.careNeeds}</p>` : ""}
      <p><a href="${process.env.COMPANY_WEBSITE || "https://www.curamain.de"}/admin/appointments">Zur Terminverwaltung</a></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.COMPANY_EMAIL || "admin@curamain.de",
      subject: `Neue Terminbuchung - ${appointmentData.firstName} ${appointmentData.lastName}`,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Admin-Benachrichtigung versendet`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Fehler beim Versenden der Admin-Benachrichtigung:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unbekannter Fehler" };
  }
}

// Email-Verbindung testen
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("✓ Email-Verbindung erfolgreich");
    return true;
  } catch (error) {
    console.error("✗ Email-Verbindung fehlgeschlagen:", error);
    return false;
  }
}

// Password Reset Email
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const htmlContent = `
      <h2>Passwort zurücksetzen</h2>
      <p>Hallo,</p>
      <p>Sie haben eine Anforderung zum Zurücksetzen Ihres Passworts gestellt.</p>
      <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Passwort zurücksetzen</a></p>
      <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
      <p><code>${resetLink}</code></p>
      <p><strong>Wichtig:</strong> Dieser Link verfällt in 24 Stunden.</p>
      <p>Wenn Sie diese Anforderung nicht gestellt haben, ignorieren Sie diese Email.</p>
      <hr>
      <p>CuraMain Pflegedienst<br>
      ${process.env.COMPANY_PHONE || "+49 (0) 123 456789"}<br>
      ${process.env.COMPANY_EMAIL || "info@curamain.de"}</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Passwort zurücksetzen - CuraMain Pflegedienst",
      html: htmlContent,
      replyTo: process.env.COMPANY_EMAIL || "info@curamain.de",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Password Reset Email an ${email} versendet`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Fehler beim Versenden der Password Reset Email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unbekannter Fehler" };
  }
}


// Appointment Reminder Email - 24 hours before
export async function sendAppointmentReminder24h(appointmentData: {
  firstName: string;
  lastName: string;
  email: string;
  appointmentType: string;
  preferredDate: Date;
  careNeeds?: string;
}) {
  try {
    const appointmentDate = new Date(appointmentData.preferredDate).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentTime = new Date(appointmentData.preferredDate).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const appointmentTypeLabels: Record<string, string> = {
      initial_consultation: "Erstberatung",
      home_visit: "Hausbesuch",
      care_planning: "Pflegeplanung",
      follow_up: "Nachfolgetermin",
    };

    const appointmentTypeLabel = appointmentTypeLabels[appointmentData.appointmentType] || appointmentData.appointmentType;

    const htmlContent = loadTemplate("appointment-reminder", {
      firstName: appointmentData.firstName,
      lastName: appointmentData.lastName,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentTypeLabel,
      careNeeds: appointmentData.careNeeds || "",
      companyPhone: process.env.COMPANY_PHONE || "+49 (0) 123 456789",
      companyEmail: process.env.COMPANY_EMAIL || "info@curamain.de",
      companyWebsite: process.env.COMPANY_WEBSITE || "https://www.curamain.de",
      is24hReminder: "true",
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: appointmentData.email,
      subject: `Erinnerung: Ihr Termin bei CuraMain am ${appointmentDate}`,
      html: htmlContent,
      replyTo: process.env.COMPANY_EMAIL || "info@curamain.de",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ 24h Reminder Email an ${appointmentData.email} versendet`);
    return true;
  } catch (error) {
    console.error("Fehler beim Versenden der 24h Reminder Email:", error);
    return false;
  }
}

// Appointment Reminder Email - 1 hour before
export async function sendAppointmentReminder1h(appointmentData: {
  firstName: string;
  lastName: string;
  email: string;
  appointmentType: string;
  preferredDate: Date;
  careNeeds?: string;
}) {
  try {
    const appointmentDate = new Date(appointmentData.preferredDate).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const appointmentTime = new Date(appointmentData.preferredDate).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const appointmentTypeLabels: Record<string, string> = {
      initial_consultation: "Erstberatung",
      home_visit: "Hausbesuch",
      care_planning: "Pflegeplanung",
      follow_up: "Nachfolgetermin",
    };

    const appointmentTypeLabel = appointmentTypeLabels[appointmentData.appointmentType] || appointmentData.appointmentType;

    const htmlContent = loadTemplate("appointment-reminder", {
      firstName: appointmentData.firstName,
      lastName: appointmentData.lastName,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentTypeLabel,
      careNeeds: appointmentData.careNeeds || "",
      companyPhone: process.env.COMPANY_PHONE || "+49 (0) 123 456789",
      companyEmail: process.env.COMPANY_EMAIL || "info@curamain.de",
      companyWebsite: process.env.COMPANY_WEBSITE || "https://www.curamain.de",
      is1hReminder: "true",
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: appointmentData.email,
      subject: `Erinnerung: Ihr Termin bei CuraMain in 1 Stunde`,
      html: htmlContent,
      replyTo: process.env.COMPANY_EMAIL || "info@curamain.de",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ 1h Reminder Email an ${appointmentData.email} versendet`);
    return true;
  } catch (error) {
    console.error("Fehler beim Versenden der 1h Reminder Email:", error);
    return false;
  }
}

// Feedback Survey Email
export async function sendFeedbackSurveyEmail(appointmentData: {
  firstName: string;
  lastName: string;
  email: string;
  appointmentType: string;
}, surveyToken: string, surveyUrl: string) {
  try {
    const appointmentTypeLabels: Record<string, string> = {
      initial_consultation: "Erstberatung",
      home_visit: "Hausbesuch",
      care_planning: "Pflegeplanung",
      follow_up: "Nachfolgetermin",
    };

    const appointmentTypeLabel = appointmentTypeLabels[appointmentData.appointmentType] || appointmentData.appointmentType;

    const htmlContent = loadTemplate("feedback-survey", {
      firstName: appointmentData.firstName,
      lastName: appointmentData.lastName,
      appointmentType: appointmentTypeLabel,
      surveyUrl,
      companyPhone: process.env.COMPANY_PHONE || "+49 (0) 123 456789",
      companyEmail: process.env.COMPANY_EMAIL || "info@curamain.de",
      companyWebsite: process.env.COMPANY_WEBSITE || "https://www.curamain.de",
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CuraMain" <${process.env.EMAIL_USER}>`,
      to: appointmentData.email,
      subject: "Ihre Meinung ist uns wichtig - Feedback zu Ihrem Termin",
      html: htmlContent,
      replyTo: process.env.COMPANY_EMAIL || "info@curamain.de",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✓ Feedback Survey Email an ${appointmentData.email} versendet`);
    return true;
  } catch (error) {
    console.error("Fehler beim Versenden der Feedback Survey Email:", error);
    return false;
  }
}
