# Firebase Firestore Schema

## Collections Structure

### `users`
| Field | Type | Description |
|-------|------|-------------|
| uid | string | User ID (matches auth UID) |
| email | string | Email address |
| name | string | Full name |
| phone | string | Phone number |
| role | string | super_admin / school_admin / principal / teacher / student / parent |
| isApproved | boolean | Account approval status |
| isActive | boolean | Account active status |
| schoolId | string | Associated school ID |
| class | string | Class (students) |
| section | string | Section (students) |
| parentIds | array | Linked parent IDs (students) |
| childrenIds | array | Linked child IDs (parents) |
| xp | number | Experience points |
| level | number | Gamification level |
| streak | number | Daily streak count |
| lastActiveDate | timestamp | Last activity timestamp |
| notificationPreferences | map | Email/push/SMS preferences |
| privacySettings | map | Profile/achievement visibility |
| loginHistory | array | Device login records |
| createdAt | timestamp | Account creation date |

### `schools`
| Field | Type | Description |
|-------|------|-------------|
| name | string | School name |
| code | string | Unique school code |
| address | string | School address |
| phone | string | Contact number |
| email | string | School email |
| plan | string | Subscription plan |
| verified | boolean | Verification status |
| isActive | boolean | Active status |
| customization | map | Theme/branding settings |
| adSettings | map | Advertisement controls |
| createdAt | timestamp | Creation date |

### `classes`
| Field | Type | Description |
|-------|------|-------------|
| name | string | Class name (e.g. "Class 10") |
| schoolId | string | School reference |
| sections | array | Available sections |
| classTeacher | string | Teacher ID |
| subjects | array | Subject IDs |

### `sections`
| Field | Type | Description |
|-------|------|-------------|
| name | string | Section name (e.g. "A") |
| classId | string | Parent class reference |
| schoolId | string | School reference |

### `subjects`
| Field | Type | Description |
|-------|------|-------------|
| name | string | Subject name |
| code | string | Subject code |
| schoolId | string | School reference |
| teacherId | string | Assigned teacher |
| class | string | Class level |

### `homework`
| Field | Type | Description |
|-------|------|-------------|
| title | string | Homework title |
| class | string | Target class |
| section | string | Target section |
| subject | string | Subject name |
| description | string | Homework details |
| dueDate | timestamp | Submission deadline |
| priority | string | High/Medium/Low |
| attachments | array | File URLs |
| teacherId | string | Creator teacher |
| schoolId | string | School reference |
| createdAt | timestamp | Creation date |

### `attendance`
| Field | Type | Description |
|-------|------|-------------|
| studentId | string | Student reference |
| class | string | Class |
| section | string | Section |
| date | timestamp | Attendance date |
| status | string | Present/Absent/Late |
| markedBy | string | Teacher ID |
| schoolId | string | School reference |

### `results`
| Field | Type | Description |
|-------|------|-------------|
| studentId | string | Student reference |
| examName | string | Exam/term name |
| class | string | Class |
| section | string | Section |
| subject | string | Subject |
| marksObtained | number | Score |
| maxMarks | number | Maximum score |
| grade | string | Letter grade |
| percentage | number | Percentage |
| examDate | timestamp | Exam date |
| published | boolean | Visibility status |

### `assignments`
| Field | Type | Description |
|-------|------|-------------|
| title | string | Assignment title |
| class | string | Target class |
| section | string | Target section |
| subject | string | Subject |
| description | string | Details |
| dueDate | timestamp | Deadline |
| attachments | array | Reference files |
| teacherId | string | Creator |
| schoolId | string | School |

### `groups`
| Field | Type | Description |
|-------|------|-------------|
| name | string | Group name |
| description | string | Group description |
| visibility | string | public/private/hidden |
| joinType | string | open/approval/invite |
| schoolId | string | School reference |
| createdBy | string | Creator ID |
| moderators | array | Moderator IDs |
| members | array | Member IDs |
| memberCount | number | Member count |
| category | string | Group category |
| createdAt | timestamp | Creation date |

### `groupPosts`
| Field | Type | Description |
|-------|------|-------------|
| groupId | string | Group reference |
| authorId | string | Author user ID |
| content | string | Post content |
| attachments | array | File URLs |
| likes | array | User IDs who liked |
| comments | array | Comment objects |
| moderated | boolean | Moderation status |
| flaggedAt | timestamp | Flag timestamp |
| createdAt | timestamp | Post date |

### `messages`
| Field | Type | Description |
|-------|------|-------------|
| senderId | string | Sender user ID |
| receiverId | string | Receiver user ID |
| content | string | Message text |
| attachments | array | File URLs |
| read | boolean | Read status |
| readAt | timestamp | Read timestamp |
| timestamp | timestamp | Send time |

### `notifications`
| Field | Type | Description |
|-------|------|-------------|
| userId | string | Target user |
| type | string | homework/attendance/fee/exam/group/message/achievement |
| title | string | Notification title |
| message | string | Notification body |
| data | map | Additional data payload |
| read | boolean | Read status |
| createdAt | timestamp | Creation date |

### `fees`
| Field | Type | Description |
|-------|------|-------------|
| studentId | string | Student reference |
| schoolId | string | School reference |
| feeType | string | tuition/transport/library/etc |
| amount | number | Fee amount |
| dueDate | timestamp | Due date |
| paid | boolean | Payment status |
| paidAt | timestamp | Payment date |
| receipt | string | Receipt URL |

### `achievements`
| Field | Type | Description |
|-------|------|-------------|
| userId | string | Student reference |
| type | string | level_up/streak/quiz/project/certificate |
| title | string | Achievement title |
| description | string | Achievement description |
| icon | string | Emoji icon |
| earnedAt | timestamp | Earned date |

### `quizzes`
| Field | Type | Description |
|-------|------|-------------|
| title | string | Quiz title |
| class | string | Target class |
| section | string | Target section |
| subject | string | Subject |
| timeLimit | number | Minutes allowed |
| questions | array | Question objects |
| createdBy | string | Teacher ID |
| published | boolean | Published status |
| scheduledDate | timestamp | Quiz date |

### `notices`
| Field | Type | Description |
|-------|------|-------------|
| title | string | Notice title |
| content | string | Notice content |
| type | string | school/class/urgent |
| targetAudience | array | Target roles/classes |
| priority | string | high/medium/low |
| createdBy | string | Author ID |
| pinned | boolean | Pin status |
| createdAt | timestamp | Creation date |

### `moderationLogs`
| Field | Type | Description |
|-------|------|-------------|
| type | string | Report type |
| contentId | string | Reported content ID |
| reason | string | Report reason |
| action | string | Action taken |
| moderatedBy | string | Moderator ID |
| createdAt | timestamp | Log date |

### `reports`
| Field | Type | Description |
|-------|------|-------------|
| reporterId | string | Reporter user ID |
| contentType | string | Content type |
| contentId | string | Content reference |
| reason | string | Report reason |
| status | string | pending/reviewing/resolved |
| resolvedBy | string | Moderator ID |
| createdAt | timestamp | Report date |

## Storage Structure

```
/profiles/{userId}/avatar.jpg
/schools/{schoolId}/logo.png
/homework/{homeworkId}/{filename}
/assignments/{assignmentId}/{filename}
/notes/{noteId}/{filename}
/groups/{groupId}/{filename}
/messages/{messageId}/{filename}
/achievements/{achievementId}/{filename}
