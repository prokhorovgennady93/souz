
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
