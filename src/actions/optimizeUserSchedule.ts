'use server'

import { Task } from "@/lib/types";

export async function optimizeUserSchedule(tasks: Task[]): Promise<Task[]> {
    // logic:
    // 1. Identify "Free Slots" (simplified: find gaps between scheduled tasks)
    // 2. "Productivity First" algorithm: move Backlog items into slots
    // 3. Auto-Backlog move: if time passed and not Done, move to Backlog

    const now = new Date();

    // Clone tasks to avoid mutation issues
    let updatedTasks = [...tasks];

    // 1. Auto-Backlog: Move past overdue tasks to Backlog
    updatedTasks = updatedTasks.map(t => {
        if (t.startTime) {
            const endTime = new Date(t.startTime.getTime() + t.duration * 60000);
            if (endTime < now && t.status !== 'Done') {
                return { ...t, status: 'Backlog', startTime: undefined };
            }
        }
        return t;
    });

    // 2. Fill Free Slots with Backlog items
    // Simple heuristic: Schedule first backlog item at next available slot (e.g. now or next hour)

    const backlogTasks = updatedTasks.filter(t => t.status === 'Backlog');

    if (backlogTasks.length > 0) {
        // Find a slot. Let's say "next hour starting at 00"
        const nextSlot = new Date();
        nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);

        // Check if slot is taken (very naive check)
        const isTaken = updatedTasks.some(t => {
            if (!t.startTime) return false;
            // check overlap
            return Math.abs(t.startTime.getTime() - nextSlot.getTime()) < 60000;
        });

        if (!isTaken) {
            const taskToMove = backlogTasks[0];
            updatedTasks = updatedTasks.map(t =>
                t.id === taskToMove.id
                    ? { ...t, status: 'Upcoming', startTime: nextSlot }
                    : t
            );
        }
    }

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return updatedTasks;
}
