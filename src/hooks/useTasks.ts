import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, Subtask } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
} from 'firebase/firestore';

import { useAuth } from '@/context/AuthContext';
import { where } from 'firebase/firestore';

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Real-time sync
    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid)
            // orderBy('createdAt') // Requires index
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Convert Firestore Timestamps to Dates
                const task = {
                    ...data,
                    id: doc.id,
                    startTime: data.startTime?.toDate ? data.startTime.toDate() : (data.startTime ? new Date(data.startTime) : undefined),
                    deadline: data.deadline?.toDate ? data.deadline.toDate() : (data.deadline ? new Date(data.deadline) : undefined),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    subtasks: (data.subtasks || []).map((s: any) => ({
                        ...s,
                        date: s.date?.toDate ? s.date.toDate() : (s.date ? new Date(s.date) : undefined)
                    }))
                } as Task;
                tasksData.push(task);
            });
            setTasks(tasksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch latest task data to avoid depending on 'tasks' state
    const updateTaskSubtasks = useCallback(async (taskId: string, updateFn: (subtasks: Subtask[]) => Subtask[]) => {
        try {
            const taskRef = doc(db, 'tasks', taskId);
            // Dynamic import to avoid circular defaults if any, or just standard import usage
            const { getDoc } = await import('firebase/firestore');
            const taskSnap = await getDoc(taskRef);

            if (taskSnap.exists()) {
                const data = taskSnap.data();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const currentSubtasks = (data.subtasks || []).map((s: any) => ({
                    ...s,
                    date: s.date?.toDate ? s.date.toDate() : (s.date ? new Date(s.date) : undefined)
                }));
                const newSubtasks = updateFn(currentSubtasks);
                await updateDoc(taskRef, { subtasks: newSubtasks });
            }
        } catch (e) {
            console.error("Error updating subtasks", e);
        }
    }, []);

    const moveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { status: newStatus });
    }, []);

    const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
        await updateTaskSubtasks(taskId, (subtasks) =>
            subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
        );
    }, [updateTaskSubtasks]);

    const addSubtask = useCallback(async (taskId: string, title: string, date?: Date) => {
        await updateTaskSubtasks(taskId, (subtasks) => [
            ...subtasks,
            {
                id: Math.random().toString(36).substr(2, 9),
                title,
                completed: false,
                date: date || new Date()
            }
        ]);
    }, [updateTaskSubtasks]);

    const reorderSubtasks = useCallback(async (taskId: string, newSubtasks: Subtask[]) => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { subtasks: newSubtasks });
    }, []);

    const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { ...updates });
    }, []);

    const updateSubtask = useCallback(async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
        await updateTaskSubtasks(taskId, (subtasks) =>
            subtasks.map(s => s.id === subtaskId ? { ...s, ...updates } : s)
        );
    }, [updateTaskSubtasks]);

    const deleteSubtask = useCallback(async (taskId: string, subtaskId: string) => {
        await updateTaskSubtasks(taskId, (subtasks) =>
            subtasks.filter(s => s.id !== subtaskId)
        );
    }, [updateTaskSubtasks]);

    const deleteTask = useCallback(async (taskId: string) => {
        await deleteDoc(doc(db, 'tasks', taskId));
    }, []);

    const addTask = useCallback(async (title: string, initialSubtask?: string) => {
        if (!user) return;

        const newTask = {
            userId: user.uid,
            title,
            duration: 0, // Legacy field
            status: 'Upcoming',
            deadline: new Date(Date.now() + 86400000), // Default to tomorrow
            subtasks: initialSubtask ? [{
                id: Math.random().toString(36).substr(2, 9),
                title: initialSubtask,
                completed: false,
                date: new Date()
            }] : []
        };
        await addDoc(collection(db, 'tasks'), newTask);
    }, [user]);

    // Helper to manually set tasks (mostly for optimistic updates or initial data if needed, 
    // but with Firestore usually we let the listener handle it. 
    // We keep it compatible with existing interface but it might act differently)
    const setTasksManual = () => {
        // console.warn("setTasks called manually. With Firestore enabled, state is managed by the listener.");
    };

    return {
        tasks,
        loading,
        moveTask,
        toggleSubtask,
        addSubtask,
        reorderSubtasks,
        updateTask,
        updateSubtask,
        deleteSubtask,
        addTask,
        deleteTask,
        setTasks: setTasksManual
    };
}
