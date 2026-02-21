const nodemailer = require('nodemailer');
require('dotenv').config();

const sendConfirmationEmail = async (to, data, type = 'student', isAdmin = false) => {
    try {
        require('dotenv').config();

        const emailUser = process.env.EMAIL_USER?.trim();
        const emailPass = process.env.EMAIL_PASS?.trim();

        if (!emailUser || !emailPass) {
            console.log('❌ Email credentials missing in .env. Skipping email.');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const isStudent = type === 'student';
        const name = isStudent ? data.teamLeaderName : data.name;
        const email = isStudent ? data.leaderEmail : (data.email || to);
        const id = isStudent ? data.studentId : 'WALK-IN';
        const eventDisplay = isStudent ? data.eventName : 'Crossroads 2026';

        // Member list for students
        let memberListHtml = '';
        if (isStudent && data.teamMembers && data.teamMembers.length > 0) {
            memberListHtml = data.teamMembers.map((m, i) => `
                <tr>
                  <td style="padding:10px; border-bottom:1px solid ${isAdmin ? '#e5e7eb' : '#1f2937'};">Member ${i + 1}</td>
                  <td style="padding:10px; border-bottom:1px solid ${isAdmin ? '#e5e7eb' : '#1f2937'};">${m}</td>
                </tr>
            `).join('');
        } else if (isStudent) {
            memberListHtml = `<tr><td colspan="2" style="padding:10px; text-align:center;">Solo Participant</td></tr>`;
        }

        // --- TEMPLATE LOGIC ---
        let subject, html;

        if (isAdmin) {
            // Internal Admin Notification (Different UI: Cleaner/Professional)
            subject = `[ADMIN LOG] New ${isStudent ? 'Student' : 'Audience'} Check-in: ${name}`;
            html = `
<div style="font-family:sans-serif; max-width:650px; margin:auto; background:#ffffff; color:#1f2937; border: 1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
  <div style="background:#0f172a; padding:30px; text-align:center; color:white;">
    <h2 style="margin:0; font-size:24px;">CROSSROADS 2026</h2>
    <p style="margin:5px 0 0; opacity:0.8;">Internal System Notification</p>
  </div>
  <div style="padding:30px;">
    <h3 style="color:#0ea5e9; margin-top:0;">📋 ${isStudent ? 'Student Team' : 'Audience'} Data</h3>
    <table style="width:100%; font-size:14px; border-collapse:collapse;">
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600; width:150px;">Name:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${name}</td></tr>
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600;">Email:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${email}</td></tr>
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600;">ID/Type:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${id}</td></tr>
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600;">College:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${data.college}</td></tr>
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600;">Event:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${eventDisplay}</td></tr>
      <tr><td style="padding:10px; background:#f8fafc; font-weight:600;">Time:</td><td style="padding:10px; border-bottom:1px solid #f1f5f9;">${new Date().toLocaleString('en-IN')}</td></tr>
    </table>

    ${isStudent ? `
    <h3 style="color:#fb923c; margin-top:25px;">👥 Team Members</h3>
    <table style="width:100%; font-size:14px; border-collapse:collapse; border:1px solid #e5e7eb;">
      <tr style="background:#f8fafc;">
        <th style="padding:12px; text-align:left;">Role</th>
        <th style="padding:12px; text-align:left;">Name</th>
      </tr>
      <tr>
        <td style="padding:12px; border-bottom:1px solid #e5e7eb;">Leader</td>
        <td style="padding:12px; border-bottom:1px solid #e5e7eb;">${data.teamLeaderName}</td>
      </tr>
      ${memberListHtml}
    </table>
    ` : ''}

    <div style="margin-top:40px; border-top:1px solid #e5e7eb; padding-top:20px; font-size:12px; color:#94a3b8; text-align:center;">
      This is an automated system log for Crossroads 2026 Attendance Management.
    </div>
  </div>
</div>
            `;
        } else {
            // Standard User Confirmation (Premium Dark UI)
            subject = isStudent
                ? `Attendance Confirmed – ${data.teamName} (${data.studentId})`
                : `Welcome to Crossroads 2026! – ${data.name}`;
            html = `
<div style="font-family:'Segoe UI',sans-serif; max-width:720px; margin:auto; background:#0b1120; color:#e2e8f0; padding:0; border-radius:20px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.5);">
  <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1,#9333ea); padding:55px 30px; text-align:center; color:white; position:relative;">
    <h1 style="margin:0; font-size:42px; letter-spacing:1px;">CROSSROADS 2026</h1>
    <p style="margin:12px 0 0; font-size:18px; opacity:0.95;">✨ ${isStudent ? 'Attendance Successfully Marked' : 'Registration Successfully Confirmed'} ✨</p>
    <div style="margin-top:25px; background:rgba(255,255,255,0.15); backdrop-filter:blur(10px); display:inline-block; padding:12px 28px; border-radius:999px; font-weight:600; font-size:16px; border:1px solid rgba(255,255,255,0.25);">
      🎟 ${isStudent ? 'Student ID' : 'Registration'}: <strong>${id}</strong>
    </div>
  </div>
  <div style="padding:40px 35px; background:#111827;">
    <p style="font-size:18px; line-height:1.7;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:16px; line-height:1.8; color:#cbd5e1;">
      ${isStudent
                    ? `Your team <strong style="color:#38bdf8;">${data.teamName}</strong> has been officially checked in for <strong style="color:#f59e0b;">${eventDisplay}</strong>.`
                    : `You have been officially registered as an audience member for <strong style="color:#f59e0b;">Crossroads 2026</strong>.`
                }
    </p>

    <!-- SUMMARY -->
    <div style="margin:35px 0; padding:28px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid rgba(255,255,255,0.08);">
      <h3 style="margin-top:0; font-size:22px; color:#0ea5e9;">📋 Details</h3>
      <table style="width:100%; font-size:15.5px; border-collapse:collapse;">
        ${isStudent ? `<tr><td style="padding:12px 0; font-weight:600; color:#94a3b8;">Team Name</td><td>${data.teamName}</td></tr>` : ''}
        <tr><td style="padding:12px 0; font-weight:600; color:#94a3b8;">Name</td><td>${name}</td></tr>
        <tr><td style="padding:12px 0; font-weight:600; color:#94a3b8;">College</td><td>${data.college}</td></tr>
        <tr><td style="padding:12px 0; font-weight:600; color:#94a3b8;">Event/Type</td><td><strong style="color:#f59e0b;">${isStudent ? eventDisplay : 'Audience / Walk-in'}</strong></td></tr>
      </table>
    </div>

    ${isStudent ? `
    <!-- TEAM MEMBERS -->
    <div style="margin:35px 0; padding:28px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid rgba(255,255,255,0.08);">
      <h3 style="margin-top:0; font-size:20px; color:#fb923c;">👥 Team List</h3>
      <table style="width:100%; font-size:15px; border-collapse:collapse;">
        <tr style="background:#1f2937;">
          <th style="padding:14px; text-align:left;">Role</th>
          <th style="padding:14px; text-align:left;">Name</th>
        </tr>
        <tr>
          <td style="padding:12px; border-bottom:1px solid #1f2937;">Leader</td>
          <td style="padding:12px; border-bottom:1px solid #1f2937;">${data.teamLeaderName}</td>
        </tr>
        ${memberListHtml}
      </table>
    </div>
    ` : ''}

    <div style="margin:35px 0; padding:24px; background:#0f172a; border-left:5px solid #38bdf8; border-radius:10px;">
      <h3 style="margin-top:0; color:#38bdf8;">🚀 Next Steps</h3>
      <ul style="padding-left:22px; line-height:1.9; color:#cbd5e1;">
        <li>Monitor your email for further updates & schedules</li>
        <li>Contact <strong>crossroads20255@gmail.com</strong> for assistance</li>
      </ul>
    </div>

    <div style="text-align:center; margin:45px 0;">
      <a href="https://hiet-crossroads.online/"
         style="display:inline-block; background:linear-gradient(135deg,#0ea5e9,#6366f1); color:white; padding:18px 45px; border-radius:999px; text-decoration:none; font-weight:600; font-size:17px; box-shadow:0 12px 30px rgba(14,165,233,0.4);">
        🌐 Visit Official Website
      </a>
    </div>

    <hr style="border:none; border-top:1px solid #1f2937; margin:45px 0;">
    <div style="text-align:center; font-size:14px; color:#94a3b8;">
      <p style="margin:0;">Warm Regards,</p>
      <p style="margin:6px 0 0; font-size:16px; font-weight:600; color:#38bdf8;">CROSSROADS 2026 Team</p>
      <p style="margin:8px 0;">© 2026 CROSSROADS | Hi-Tech Institute of Engineering & Technology</p>
    </div>
  </div>
</div>
            `;
        }

        const mailOptions = {
            from: `"CROSSROADS 2026" <${emailUser}>`,
            to,
            subject,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${result.messageId}`);
        return result;
    } catch (err) {
        console.error('❌ Email Error:', err.message);
        return null;
    }
};

module.exports = { sendConfirmationEmail };
