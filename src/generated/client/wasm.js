
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  phone: 'phone',
  password: 'password',
  plainPassword: 'plainPassword',
  fullName: 'fullName',
  role: 'role',
  branchId: 'branchId',
  workTimeStart: 'workTimeStart',
  workTimeEnd: 'workTimeEnd',
  breakTimeStart: 'breakTimeStart',
  breakTimeEnd: 'breakTimeEnd',
  isOffDay: 'isOffDay',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScheduleOverrideScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  branchId: 'branchId',
  workTimeStart: 'workTimeStart',
  workTimeEnd: 'workTimeEnd',
  breakTimeStart: 'breakTimeStart',
  breakTimeEnd: 'breakTimeEnd',
  isOffDay: 'isOffDay'
};

exports.Prisma.BranchScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  phone: 'phone',
  scheduleType: 'scheduleType',
  openTime: 'openTime',
  closeTime: 'closeTime',
  breakStartTime: 'breakStartTime',
  breakEndTime: 'breakEndTime',
  rtspUrl: 'rtspUrl',
  expectedIp: 'expectedIp',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BranchScheduleOverrideScalarFieldEnum = {
  id: 'id',
  branchId: 'branchId',
  date: 'date',
  openTime: 'openTime',
  closeTime: 'closeTime',
  isClosed: 'isClosed'
};

exports.Prisma.ShiftScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  branchId: 'branchId',
  openedAt: 'openedAt',
  closedAt: 'closedAt',
  autoClosed: 'autoClosed',
  latitude: 'latitude',
  longitude: 'longitude'
};

exports.Prisma.ShiftAuditScalarFieldEnum = {
  id: 'id',
  shiftId: 'shiftId',
  actionType: 'actionType',
  imageUrl1: 'imageUrl1',
  imageUrl2: 'imageUrl2',
  imageUrl3: 'imageUrl3',
  clientIp: 'clientIp',
  isMatch: 'isMatch',
  timestamp: 'timestamp'
};

exports.Prisma.ShiftBreakScalarFieldEnum = {
  id: 'id',
  shiftId: 'shiftId',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  reason: 'reason'
};

exports.Prisma.TaskTemplateScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  priority: 'priority',
  category: 'category',
  instructionImageUrl: 'instructionImageUrl',
  creatorId: 'creatorId',
  assignedUserId: 'assignedUserId',
  assignedBranchId: 'assignedBranchId',
  targetRole: 'targetRole',
  targetAllUsers: 'targetAllUsers',
  points: 'points',
  frequency: 'frequency',
  dayOfWeek: 'dayOfWeek',
  dayOfMonth: 'dayOfMonth',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  priority: 'priority',
  category: 'category',
  creatorId: 'creatorId',
  assignedUserId: 'assignedUserId',
  assignedBranchId: 'assignedBranchId',
  targetAllUsers: 'targetAllUsers',
  targetRole: 'targetRole',
  instructionImageUrl: 'instructionImageUrl',
  templateId: 'templateId',
  scheduledAt: 'scheduledAt',
  deadline: 'deadline',
  points: 'points',
  isCompleted: 'isCompleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PenaltyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  reason: 'reason',
  type: 'type',
  taskId: 'taskId',
  createdAt: 'createdAt'
};

exports.Prisma.TaskRequirementScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  templateId: 'templateId',
  type: 'type',
  label: 'label',
  isRequired: 'isRequired',
  order: 'order'
};

exports.Prisma.TaskCompletionScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  userId: 'userId',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.TaskResponseScalarFieldEnum = {
  id: 'id',
  completionId: 'completionId',
  requirementId: 'requirementId',
  value: 'value',
  imageUrl: 'imageUrl'
};

exports.Prisma.NewsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  creatorId: 'creatorId',
  department: 'department',
  imageUrl: 'imageUrl',
  videoUrl: 'videoUrl',
  isImportant: 'isImportant',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NewsConfirmationScalarFieldEnum = {
  id: 'id',
  newsId: 'newsId',
  userId: 'userId',
  readAt: 'readAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LessonScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  title: 'title',
  content: 'content',
  videoUrl: 'videoUrl',
  order: 'order'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  lessonId: 'lessonId',
  text: 'text',
  isOpenEnded: 'isOpenEnded'
};

exports.Prisma.OptionScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  text: 'text',
  isCorrect: 'isCorrect'
};

exports.Prisma.UserCourseProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  completedLessonIds: 'completedLessonIds'
};

exports.Prisma.ExamAttemptScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  score: 'score',
  isPassed: 'isPassed',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  UserScheduleOverride: 'UserScheduleOverride',
  Branch: 'Branch',
  BranchScheduleOverride: 'BranchScheduleOverride',
  Shift: 'Shift',
  ShiftAudit: 'ShiftAudit',
  ShiftBreak: 'ShiftBreak',
  TaskTemplate: 'TaskTemplate',
  Task: 'Task',
  Penalty: 'Penalty',
  TaskRequirement: 'TaskRequirement',
  TaskCompletion: 'TaskCompletion',
  TaskResponse: 'TaskResponse',
  News: 'News',
  NewsConfirmation: 'NewsConfirmation',
  Course: 'Course',
  Lesson: 'Lesson',
  Question: 'Question',
  Option: 'Option',
  UserCourseProgress: 'UserCourseProgress',
  ExamAttempt: 'ExamAttempt'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\автошкола\\Desktop\\souz\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x"
      },
      {
        "fromEnvVar": null,
        "value": "linux-musl-openssl-3.0.x"
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\автошкола\\Desktop\\souz\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "sqlite",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\"]\n  output          = \"../src/generated/client\"\n  binaryTargets   = [\"native\", \"debian-openssl-3.0.x\", \"linux-musl-openssl-3.0.x\"]\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id            String  @id @default(cuid())\n  phone         String  @unique\n  password      String\n  plainPassword String?\n  fullName      String\n  role          String  @default(\"CANDIDATE\") // ADMIN, SENIOR_MANAGER, EMPLOYEE, CANDIDATE\n  branchId      String?\n\n  workTimeStart  String?\n  workTimeEnd    String?\n  breakTimeStart String?\n  breakTimeEnd   String?\n\n  isOffDay Boolean @default(false)\n\n  branch          Branch?            @relation(fields: [branchId], references: [id])\n  tasksCreated    Task[]             @relation(\"TaskCreator\")\n  tasksAssigned   Task[]             @relation(\"TaskAssignee\")\n  taskCompletions TaskCompletion[]\n  newsCreated     News[]\n  newsReads       NewsConfirmation[]\n  shifts          Shift[]\n\n  examAttempts      ExamAttempt[]\n  courseProgress    UserCourseProgress[]\n  penalties         Penalty[]\n  scheduleOverrides UserScheduleOverride[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel UserScheduleOverride {\n  id     String   @id @default(cuid())\n  userId String\n  date   DateTime\n\n  branchId       String?\n  workTimeStart  String?\n  workTimeEnd    String?\n  breakTimeStart String?\n  breakTimeEnd   String?\n  isOffDay       Boolean @default(false)\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  branch Branch? @relation(fields: [branchId], references: [id], onDelete: SetNull)\n\n  @@unique([userId, date])\n}\n\nmodel Branch {\n  id             String  @id @default(cuid())\n  name           String\n  address        String\n  phone          String?\n  scheduleType   String  @default(\"5/2\") // 2/2, 5/2, 3/3\n  openTime       String  @default(\"09:00\")\n  closeTime      String  @default(\"18:00\")\n  breakStartTime String  @default(\"13:00\")\n  breakEndTime   String  @default(\"14:00\")\n\n  rtspUrl    String?\n  expectedIp String?\n\n  users                 User[]\n  shifts                Shift[]\n  scheduleOverrides     BranchScheduleOverride[]\n  userScheduleOverrides UserScheduleOverride[]\n  tasks                 Task[]                   @relation(\"BranchTasks\")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel BranchScheduleOverride {\n  id        String   @id @default(cuid())\n  branchId  String\n  date      DateTime\n  openTime  String?\n  closeTime String?\n  isClosed  Boolean  @default(false)\n\n  branch Branch @relation(fields: [branchId], references: [id], onDelete: Cascade)\n}\n\nmodel Shift {\n  id         String    @id @default(cuid())\n  userId     String\n  branchId   String\n  openedAt   DateTime  @default(now())\n  closedAt   DateTime?\n  autoClosed Boolean   @default(false)\n  latitude   Float?\n  longitude  Float?\n\n  user   User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  branch Branch       @relation(fields: [branchId], references: [id], onDelete: Cascade)\n  breaks ShiftBreak[]\n  audits ShiftAudit[]\n}\n\nmodel ShiftAudit {\n  id         String @id @default(cuid())\n  shiftId    String\n  actionType String // START, BREAK_END\n\n  imageUrl1 String?\n  imageUrl2 String?\n  imageUrl3 String?\n\n  clientIp  String?\n  isMatch   Boolean  @default(false)\n  timestamp DateTime @default(now())\n\n  shift Shift @relation(fields: [shiftId], references: [id], onDelete: Cascade)\n}\n\nmodel ShiftBreak {\n  id        String    @id @default(cuid())\n  shiftId   String\n  startedAt DateTime  @default(now())\n  endedAt   DateTime?\n  reason    String?\n\n  shift Shift @relation(fields: [shiftId], references: [id], onDelete: Cascade)\n}\n\nmodel TaskTemplate {\n  id                  String  @id @default(cuid())\n  title               String\n  description         String?\n  priority            String  @default(\"NORMAL\")\n  category            String  @default(\"REGULAR\")\n  instructionImageUrl String?\n\n  creatorId        String\n  assignedUserId   String?\n  assignedBranchId String?\n  targetRole       String?\n  targetAllUsers   Boolean @default(false)\n  points           Float   @default(0)\n\n  frequency  String // ONCE, DAILY, WEEKLY, MONTHLY\n  dayOfWeek  Int? // 1-7 (Mon-Sun)\n  dayOfMonth Int? // 1-31\n\n  requirements TaskRequirement[]\n  tasks        Task[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Task {\n  id          String  @id @default(cuid())\n  title       String\n  description String? // Markdown support\n  priority    String  @default(\"NORMAL\") // LOW, NORMAL, HIGH, URGENT\n  category    String  @default(\"REGULAR\")\n\n  creatorId String\n  creator   User   @relation(\"TaskCreator\", fields: [creatorId], references: [id])\n\n  assignedUserId String?\n  assignee       User?   @relation(\"TaskAssignee\", fields: [assignedUserId], references: [id])\n\n  assignedBranchId String?\n  branch           Branch? @relation(\"BranchTasks\", fields: [assignedBranchId], references: [id])\n\n  targetAllUsers      Boolean @default(false)\n  targetRole          String? // Optional role targeting (ADMIN, SENIOR_MANAGER, EMPLOYEE)\n  instructionImageUrl String?\n\n  templateId String?\n  template   TaskTemplate? @relation(fields: [templateId], references: [id], onDelete: SetNull)\n\n  scheduledAt DateTime  @default(now())\n  deadline    DateTime?\n  points      Float     @default(0)\n  isCompleted Boolean   @default(false)\n\n  requirements TaskRequirement[]\n  completions  TaskCompletion[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Penalty {\n  id        String   @id @default(cuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  amount    Float\n  reason    String\n  type      String   @default(\"MANUAL\") // MANUAL, TASK_OVERDUE\n  taskId    String?\n  createdAt DateTime @default(now())\n}\n\nmodel TaskRequirement {\n  id         String  @id @default(cuid())\n  taskId     String?\n  templateId String?\n  type       String // CHECKLIST, TEXT, PHOTO\n  label      String // e.g. \"Photo of the counter\"\n  isRequired Boolean @default(true)\n  order      Int     @default(0)\n\n  task      Task?          @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  template  TaskTemplate?  @relation(fields: [templateId], references: [id], onDelete: Cascade)\n  responses TaskResponse[]\n}\n\nmodel TaskCompletion {\n  id      String  @id @default(cuid())\n  taskId  String\n  userId  String\n  comment String?\n\n  responses TaskResponse[]\n\n  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n}\n\nmodel TaskResponse {\n  id            String  @id @default(cuid())\n  completionId  String\n  requirementId String\n  value         String? // Text input or checkbox state\n  imageUrl      String? // Stored in public/uploads/tasks/\n\n  completion  TaskCompletion  @relation(fields: [completionId], references: [id], onDelete: Cascade)\n  requirement TaskRequirement @relation(fields: [requirementId], references: [id], onDelete: Cascade)\n}\n\nmodel News {\n  id          String  @id @default(cuid())\n  title       String\n  content     String // Markdown support\n  creatorId   String\n  department  String? // Бухгалтерия, Учебная часть, Отдел продаж, Архив, Руководство\n  imageUrl    String?\n  videoUrl    String?\n  isImportant Boolean @default(false)\n\n  creator       User               @relation(fields: [creatorId], references: [id])\n  confirmations NewsConfirmation[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel NewsConfirmation {\n  id     String   @id @default(cuid())\n  newsId String\n  userId String\n  readAt DateTime @default(now())\n\n  news News @relation(fields: [newsId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([newsId, userId])\n}\n\nmodel Course {\n  id          String  @id @default(cuid())\n  title       String\n  description String?\n\n  lessons      Lesson[]\n  userProgress UserCourseProgress[]\n  examAttempts ExamAttempt[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Lesson {\n  id       String  @id @default(cuid())\n  courseId String\n  title    String\n  content  String?\n  videoUrl String?\n  order    Int     @default(0)\n\n  course    Course     @relation(fields: [courseId], references: [id], onDelete: Cascade)\n  questions Question[]\n}\n\nmodel Question {\n  id          String  @id @default(cuid())\n  lessonId    String\n  text        String\n  isOpenEnded Boolean @default(false)\n\n  lesson  Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)\n  options Option[]\n}\n\nmodel Option {\n  id         String  @id @default(cuid())\n  questionId String\n  text       String\n  isCorrect  Boolean @default(false)\n\n  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)\n}\n\nmodel UserCourseProgress {\n  id                 String @id @default(cuid())\n  userId             String\n  courseId           String\n  completedLessonIds String\n\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, courseId])\n}\n\nmodel ExamAttempt {\n  id       String  @id @default(cuid())\n  userId   String\n  courseId String\n  score    Int     @default(0)\n  isPassed Boolean @default(false)\n\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n}\n",
  "inlineSchemaHash": "d507374797039e4229d4ddd24badf4006ed81a4e588fbb3fbdbfd79979967ddd",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"plainPassword\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fullName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workTimeStart\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workTimeEnd\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakTimeStart\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakTimeEnd\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isOffDay\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToUser\"},{\"name\":\"tasksCreated\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskCreator\"},{\"name\":\"tasksAssigned\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskAssignee\"},{\"name\":\"taskCompletions\",\"kind\":\"object\",\"type\":\"TaskCompletion\",\"relationName\":\"TaskCompletionToUser\"},{\"name\":\"newsCreated\",\"kind\":\"object\",\"type\":\"News\",\"relationName\":\"NewsToUser\"},{\"name\":\"newsReads\",\"kind\":\"object\",\"type\":\"NewsConfirmation\",\"relationName\":\"NewsConfirmationToUser\"},{\"name\":\"shifts\",\"kind\":\"object\",\"type\":\"Shift\",\"relationName\":\"ShiftToUser\"},{\"name\":\"examAttempts\",\"kind\":\"object\",\"type\":\"ExamAttempt\",\"relationName\":\"ExamAttemptToUser\"},{\"name\":\"courseProgress\",\"kind\":\"object\",\"type\":\"UserCourseProgress\",\"relationName\":\"UserToUserCourseProgress\"},{\"name\":\"penalties\",\"kind\":\"object\",\"type\":\"Penalty\",\"relationName\":\"PenaltyToUser\"},{\"name\":\"scheduleOverrides\",\"kind\":\"object\",\"type\":\"UserScheduleOverride\",\"relationName\":\"UserToUserScheduleOverride\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"UserScheduleOverride\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workTimeStart\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"workTimeEnd\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakTimeStart\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakTimeEnd\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isOffDay\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserScheduleOverride\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToUserScheduleOverride\"}],\"dbName\":null},\"Branch\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"scheduleType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"openTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"closeTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakStartTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"breakEndTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rtspUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expectedIp\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BranchToUser\"},{\"name\":\"shifts\",\"kind\":\"object\",\"type\":\"Shift\",\"relationName\":\"BranchToShift\"},{\"name\":\"scheduleOverrides\",\"kind\":\"object\",\"type\":\"BranchScheduleOverride\",\"relationName\":\"BranchToBranchScheduleOverride\"},{\"name\":\"userScheduleOverrides\",\"kind\":\"object\",\"type\":\"UserScheduleOverride\",\"relationName\":\"BranchToUserScheduleOverride\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"BranchTasks\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"BranchScheduleOverride\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"openTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"closeTime\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isClosed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToBranchScheduleOverride\"}],\"dbName\":null},\"Shift\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"openedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"closedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"autoClosed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"latitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"longitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ShiftToUser\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchToShift\"},{\"name\":\"breaks\",\"kind\":\"object\",\"type\":\"ShiftBreak\",\"relationName\":\"ShiftToShiftBreak\"},{\"name\":\"audits\",\"kind\":\"object\",\"type\":\"ShiftAudit\",\"relationName\":\"ShiftToShiftAudit\"}],\"dbName\":null},\"ShiftAudit\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shiftId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"actionType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl1\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl2\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl3\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clientIp\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isMatch\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"timestamp\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"shift\",\"kind\":\"object\",\"type\":\"Shift\",\"relationName\":\"ShiftToShiftAudit\"}],\"dbName\":null},\"ShiftBreak\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shiftId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"shift\",\"kind\":\"object\",\"type\":\"Shift\",\"relationName\":\"ShiftToShiftBreak\"}],\"dbName\":null},\"TaskTemplate\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"instructionImageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creatorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedUserId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignedBranchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetRole\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"targetAllUsers\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"points\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"frequency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dayOfWeek\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"dayOfMonth\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"requirements\",\"kind\":\"object\",\"type\":\"TaskRequirement\",\"relationName\":\"TaskRequirementToTaskTemplate\"},{\"name\":\"tasks\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskToTaskTemplate\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Task\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creatorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskCreator\"},{\"name\":\"assignedUserId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignee\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskAssignee\"},{\"name\":\"assignedBranchId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"branch\",\"kind\":\"object\",\"type\":\"Branch\",\"relationName\":\"BranchTasks\"},{\"name\":\"targetAllUsers\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"targetRole\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"instructionImageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"templateId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"template\",\"kind\":\"object\",\"type\":\"TaskTemplate\",\"relationName\":\"TaskToTaskTemplate\"},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"deadline\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"points\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"isCompleted\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"requirements\",\"kind\":\"object\",\"type\":\"TaskRequirement\",\"relationName\":\"TaskToTaskRequirement\"},{\"name\":\"completions\",\"kind\":\"object\",\"type\":\"TaskCompletion\",\"relationName\":\"TaskToTaskCompletion\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Penalty\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PenaltyToUser\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taskId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"TaskRequirement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taskId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"templateId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"label\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isRequired\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"task\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskToTaskRequirement\"},{\"name\":\"template\",\"kind\":\"object\",\"type\":\"TaskTemplate\",\"relationName\":\"TaskRequirementToTaskTemplate\"},{\"name\":\"responses\",\"kind\":\"object\",\"type\":\"TaskResponse\",\"relationName\":\"TaskRequirementToTaskResponse\"}],\"dbName\":null},\"TaskCompletion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taskId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"responses\",\"kind\":\"object\",\"type\":\"TaskResponse\",\"relationName\":\"TaskCompletionToTaskResponse\"},{\"name\":\"task\",\"kind\":\"object\",\"type\":\"Task\",\"relationName\":\"TaskToTaskCompletion\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TaskCompletionToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"TaskResponse\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"requirementId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completion\",\"kind\":\"object\",\"type\":\"TaskCompletion\",\"relationName\":\"TaskCompletionToTaskResponse\"},{\"name\":\"requirement\",\"kind\":\"object\",\"type\":\"TaskRequirement\",\"relationName\":\"TaskRequirementToTaskResponse\"}],\"dbName\":null},\"News\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creatorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"department\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"videoUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isImportant\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"creator\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NewsToUser\"},{\"name\":\"confirmations\",\"kind\":\"object\",\"type\":\"NewsConfirmation\",\"relationName\":\"NewsToNewsConfirmation\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"NewsConfirmation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"newsId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"readAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"news\",\"kind\":\"object\",\"type\":\"News\",\"relationName\":\"NewsToNewsConfirmation\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NewsConfirmationToUser\"}],\"dbName\":null},\"Course\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lessons\",\"kind\":\"object\",\"type\":\"Lesson\",\"relationName\":\"CourseToLesson\"},{\"name\":\"userProgress\",\"kind\":\"object\",\"type\":\"UserCourseProgress\",\"relationName\":\"CourseToUserCourseProgress\"},{\"name\":\"examAttempts\",\"kind\":\"object\",\"type\":\"ExamAttempt\",\"relationName\":\"CourseToExamAttempt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Lesson\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courseId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"videoUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"course\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToLesson\"},{\"name\":\"questions\",\"kind\":\"object\",\"type\":\"Question\",\"relationName\":\"LessonToQuestion\"}],\"dbName\":null},\"Question\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lessonId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"text\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isOpenEnded\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"lesson\",\"kind\":\"object\",\"type\":\"Lesson\",\"relationName\":\"LessonToQuestion\"},{\"name\":\"options\",\"kind\":\"object\",\"type\":\"Option\",\"relationName\":\"OptionToQuestion\"}],\"dbName\":null},\"Option\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"questionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"text\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isCorrect\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"question\",\"kind\":\"object\",\"type\":\"Question\",\"relationName\":\"OptionToQuestion\"}],\"dbName\":null},\"UserCourseProgress\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courseId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completedLessonIds\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserCourseProgress\"},{\"name\":\"course\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToUserCourseProgress\"}],\"dbName\":null},\"ExamAttempt\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"courseId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"score\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isPassed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ExamAttemptToUser\"},{\"name\":\"course\",\"kind\":\"object\",\"type\":\"Course\",\"relationName\":\"CourseToExamAttempt\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

