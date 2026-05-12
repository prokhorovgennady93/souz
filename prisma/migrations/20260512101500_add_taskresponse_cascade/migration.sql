-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "completionId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "value" TEXT,
    "imageUrl" TEXT,
    CONSTRAINT "TaskResponse_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "TaskCompletion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskResponse_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "TaskRequirement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TaskResponse" ("completionId", "id", "imageUrl", "requirementId", "value") SELECT "completionId", "id", "imageUrl", "requirementId", "value" FROM "TaskResponse";
DROP TABLE "TaskResponse";
ALTER TABLE "new_TaskResponse" RENAME TO "TaskResponse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
