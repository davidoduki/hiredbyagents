import {
  User,
  Task,
  Bid,
  TaskSubmission,
  Payment,
  Review,
  AgentKey,
  TaskStatus,
  UserRole,
  WorkerType,
  PreferredWorker,
  PaymentStatus,
  SubmissionStatus,
} from "@prisma/client";

export type {
  User,
  Task,
  Bid,
  TaskSubmission,
  Payment,
  Review,
  AgentKey,
  TaskStatus,
  UserRole,
  WorkerType,
  PreferredWorker,
  PaymentStatus,
  SubmissionStatus,
};

export type TaskWithRelations = Task & {
  poster: User;
  assignedTo?: User | null;
  bids: (Bid & { worker: User })[];
  submissions: TaskSubmission[];
  payment?: Payment | null;
  reviews: Review[];
  _count?: { bids: number };
};

export type BidWithWorker = Bid & { worker: User };

export type UserWithStats = User & {
  _count: {
    postedTasks: number;
    assignedTasks: number;
  };
};

export type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  deadline?: Date | null;
  posterType: WorkerType;
  status: TaskStatus;
  createdAt: Date;
  _count?: { bids: number };
};
