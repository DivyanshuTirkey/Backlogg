export type TaskStatus = 'Upcoming' | 'Ongoing' | 'Done' | 'Backlog';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    date?: Date; // For timeline view
}

export interface Task {
    id: string;
    title: string;
    duration: number; // in minutes
    startTime?: Date;
    deadline?: Date;
    status: TaskStatus;
    subtasks: Subtask[];
}

export interface Objective {
    id: string;
    title: string;
    tasks: Task[];
    progress: number; // 0-100 derived from tasks
}
