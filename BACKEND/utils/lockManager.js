const RegisteredStudent = require('../models/RegisteredStudent');
const { sendLockedAttendanceEmail } = require('./emailService');
require('dotenv').config();

let isChecking = false;

const runLockCheck = async () => {
    if (isChecking) return;
    isChecking = true;

    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'ag902065@gmail.com';
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

        // Find all students whose attendance was marked more than 4 hours ago, but are not locked yet.
        const studentsToLock = await RegisteredStudent.find({
            attendanceMarkedAt: { $ne: null, $lte: fourHoursAgo },
            isLocked: { $ne: true }
        });

        if (studentsToLock.length === 0) {
            isChecking = false;
            return;
        }

        // Group by teamId
        const teams = {};
        for (const student of studentsToLock) {
            if (!teams[student.teamId]) {
                teams[student.teamId] = {
                    teamId: student.teamId,
                    teamName: student.teamName,
                    members: []
                };
            }
            teams[student.teamId].members.push(student);
        }

        console.log(`[LOCK CHECKER] Found ${Object.keys(teams).length} teams that need to be locked.`);

        for (const teamId of Object.keys(teams)) {
            const team = teams[teamId];
            
            // Mark all members of this team in the database as locked
            await RegisteredStudent.updateMany(
                { teamId: team.teamId },
                { $set: { isLocked: true, emailedAdmin: true } }
            );

            // Fetch the updated team list (with all members) to compile the final email Excel
            const allTeamMembers = await RegisteredStudent.find({ teamId: team.teamId });

            // Send email
            await sendLockedAttendanceEmail(
                adminEmail,
                team.teamId,
                team.teamName,
                allTeamMembers
            );

            console.log(`[LOCK CHECKER] Team ${team.teamName} (${team.teamId}) has been locked and emailed to admin.`);
        }
    } catch (err) {
        console.error('[LOCK CHECKER ERROR]:', err);
    } finally {
        isChecking = false;
    }
};

module.exports = { runLockCheck };
