const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// =============================================
// USER MANAGEMENT FUNCTIONS
// =============================================

// Auto-create user profile on signup
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, phoneNumber } = user;
  const defaultProfile = {
    uid,
    email: email || '',
    name: displayName || '',
    phone: phoneNumber || '',
    role: 'student',
    isApproved: false,
    isActive: true,
    schoolId: '',
    class: '',
    section: '',
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    notificationPreferences: { email: true, push: true, sms: false },
    privacySettings: { showProfile: true, showAchievements: true, allowParentAccess: true }
  };
  return db.collection('users').doc(uid).set(defaultProfile);
});

// Delete user profile on auth delete
exports.deleteUserProfile = functions.auth.user().onDelete(async (user) => {
  return db.collection('users').doc(user.uid).delete();
});

// =============================================
// NOTIFICATION FUNCTIONS
// =============================================

// Send notification on homework creation
exports.notifyHomeworkCreated = functions.firestore
  .document('homework/{hwId}')
  .onCreate(async (snap, context) => {
    const hw = snap.data();
    const studentsQuery = await db.collection('users')
      .where('class', '==', hw.class)
      .where('section', '==', hw.section)
      .where('role', '==', 'student')
      .get();

    const notifications = [];
    studentsQuery.forEach((doc) => {
      notifications.push({
        userId: doc.id,
        type: 'homework',
        title: 'New Homework',
        message: `${hw.subject}: ${hw.title}`,
        data: { homeworkId: context.params.hwId },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    if (notifications.length > 0) {
      const batch = db.batch();
      notifications.forEach((n) => {
        const ref = db.collection('notifications').doc();
        batch.set(ref, n);
      });
      await batch.commit();
    }
  });

// Send notification on result publication
exports.notifyResultPublished = functions.firestore
  .document('results/{resultId}')
  .onCreate(async (snap) => {
    const result = snap.data();
    const userDoc = await db.collection('users').doc(result.studentId).get();
    const user = userDoc.data();

    await db.collection('notifications').add({
      userId: result.studentId,
      type: 'result',
      title: 'New Result Published',
      message: `Your ${result.examName} results are now available`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Also notify parents
    if (user && user.parentIds) {
      const parentNotifs = user.parentIds.map((pid) => ({
        userId: pid,
        type: 'result',
        title: 'Child Result Published',
        message: `Results for ${user.name} are now available`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }));
      const batch = db.batch();
      parentNotifs.forEach((n) => {
        const ref = db.collection('notifications').doc();
        batch.set(ref, n);
      });
      await batch.commit();
    }
  });

// =============================================
// GAMIFICATION FUNCTIONS
// =============================================

// Award XP on homework submission
exports.awardHomeworkXp = functions.firestore
  .document('submissions/{submissionId}')
  .onCreate(async (snap) => {
    const submission = snap.data();
    const xpAward = 50;
    const userRef = db.collection('users').doc(submission.studentId);

    return db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) return;

      const user = userDoc.data();
      const newXp = (user.xp || 0) + xpAward;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const today = new Date().toDateString();
      const lastActive = user.lastActiveDate ? user.lastActiveDate.toDate().toDateString() : null;
      const newStreak = lastActive === today ? user.streak : lastActive === new Date(Date.now() - 86400000).toDateString() ? (user.streak || 0) + 1 : 1;

      transaction.update(userRef, {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActiveDate: admin.firestore.FieldValue.serverTimestamp()
      });

      // Check level up for badge
      if (newLevel > (user.level || 1)) {
        await db.collection('achievements').add({
          userId: submission.studentId,
          type: 'level_up',
          title: `Level ${newLevel} Achieved!`,
          description: `Congratulations! You've reached Level ${newLevel}`,
          icon: '⭐',
          earnedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      // Check streak milestones
      if (newStreak > 0 && newStreak % 7 === 0) {
        await db.collection('achievements').add({
          userId: submission.studentId,
          type: 'streak',
          title: `${newStreak}-Day Streak!`,
          description: `Amazing consistency! ${newStreak} day study streak`,
          icon: '🔥',
          earnedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  });

// =============================================
// MODERATION FUNCTIONS
// =============================================

// Auto-moderate content for spam/profanity
exports.autoModerateContent = functions.firestore
  .document('groups/{groupId}/posts/{postId}')
  .onCreate(async (snap) => {
    const post = snap.data();
    const blockedWords = ['spam', 'inappropriate', 'offensive']; // Expand from Firestore config
    const content = (post.content || '').toLowerCase();
    const flagged = blockedWords.some((word) => content.includes(word));

    if (flagged) {
      await snap.ref.update({ moderated: true, flaggedAt: admin.firestore.FieldValue.serverTimestamp() });
      await db.collection('moderationLogs').add({
        type: 'auto_flag',
        contentId: context.params.postId,
        reason: 'Flagged by auto-moderation',
        action: 'flagged',
        moderatedBy: 'system',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// =============================================
// ANALYTICS FUNCTIONS
// =============================================

// Update daily active users
exports.trackDailyActivity = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change) => {
    const after = change.after.data();
    const before = change.before.data();

    if (after.lastActiveDate !== before.lastActiveDate) {
      const today = new Date().toISOString().split('T')[0];
      const analyticsRef = db.collection('analytics').doc('daily_' + today);

      return analyticsRef.set({
        date: today,
        activeUsers: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  });

// =============================================
// CLOUD FUNCTIONS API
// =============================================

// Generate study plan using AI (placeholder)
exports.generateStudyPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { subjects, examDate, dailyHours } = data;
  // AI-powered study plan generation logic here
  const studyPlan = {
    subjects: subjects || [],
    duration: dailyHours || 2,
    recommendations: [
      'Review math formulas daily',
      'Practice science problems',
      'Read English literature'
    ],
    schedule: []
  };

  return { success: true, studyPlan };
});

// Grammar check (placeholder for AI integration)
exports.grammarCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { text } = data;
  // Integrate with NLP/grammar API here
  return {
    success: true,
    corrections: [],
    suggestions: ['Your text looks grammatically correct!'],
    score: 95
  };
});

// Generate quiz using AI
exports.generateQuiz = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { subject, topic, difficulty, count } = data;
  // AI quiz generation logic
  return {
    success: true,
    quiz: {
      title: `${topic} Quiz`,
      questions: [
        {
          question: 'Sample question?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 0
        }
      ]
    }
  };
});

// =============================================
// SCHEDULED FUNCTIONS
// =============================================

// Daily attendance reminder (runs at 9 AM)
exports.dailyAttendanceReminder = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const teachers = await db.collection('users')
      .where('role', '==', 'teacher')
      .where('isActive', '==', true)
      .get();

    const batch = db.batch();
    teachers.forEach((doc) => {
      const ref = db.collection('notifications').doc();
      batch.set(ref, {
        userId: doc.id,
        type: 'attendance',
        title: 'Mark Attendance',
        message: 'Please mark today\'s attendance for your classes',
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  });

// Weekly fee reminder (runs every Monday at 10 AM)
exports.weeklyFeeReminder = functions.pubsub
  .schedule('0 10 * * 1')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const parents = await db.collection('users')
      .where('role', '==', 'parent')
      .where('isActive', '==', true)
      .get();

    const batch = db.batch();
    parents.forEach((doc) => {
      const ref = db.collection('notifications').doc();
      batch.set(ref, {
        userId: doc.id,
        type: 'fee',
        title: 'Fee Reminder',
        message: 'This is a reminder to check any pending fees',
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();
  });
