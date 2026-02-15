"use client";

import { useTasks } from "@/hooks/useTasks";
import { PlansBoard } from "@/components/dashboard/PlansBoard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Map } from "lucide-react";
import { optimizeUserSchedule } from "@/actions/optimizeUserSchedule";
import { TaskDetailModal } from "./TaskDetailModal";
import { Task } from "@/lib/types";

export default function Dashboard() {
    const { tasks, loading, moveTask, toggleSubtask, addSubtask, reorderSubtasks, updateTask, updateSubtask, deleteSubtask, deleteTask, addTask } = useTasks();
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const optimizedTasks = await optimizeUserSchedule(tasks);

            // Apply changes to Firestore one by one (or batch if we exposed it)
            // For now, simple iteration is fine for small number of tasks
            for (const optimized of optimizedTasks) {
                const original = tasks.find(t => t.id === optimized.id);
                if (original) {
                    // Check for changes (rudimentary check for demo purposes)
                    const statusChanged = original.status !== optimized.status;
                    const startTimeChanged = original.startTime?.getTime() !== optimized.startTime?.getTime();

                    if (statusChanged || startTimeChanged) {
                        updateTask(optimized.id, {
                            status: optimized.status,
                            startTime: optimized.startTime
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Optimization failed", error);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    // Keep selected task sync'd with state changes (e.g. subtask toggles)
    const currentSelectedTask = selectedTask ? tasks.find(t => t.id === selectedTask.id) || null : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-500">
                Loading tasks...
            </div>
        );
    }

    return (
        <div className="flex bg-background min-h-screen">
            {/* Sidebar - simplified for single view */}
            <div className="w-64 border-r border-border bg-card p-4 flex flex-col gap-4">
                <div className="font-bold text-xl px-4 py-2 flex items-center gap-2">
                    <span className="text-primary">●</span> Backlogg
                </div>
                <nav className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        className="justify-start gap-2 w-full font-medium"
                    >
                        <Map size={18} /> Roadmap
                    </Button>
                </nav>
                <div className="mt-auto flex flex-col gap-2">


                    <Button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        <Sparkles size={16} />
                        {isOptimizing ? "Optimizing..." : "Auto-Plan"}
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-0 overflow-hidden h-screen bg-dots-pattern">
                <div className="h-full">
                    <PlansBoard
                        tasks={tasks}
                        moveTask={moveTask}
                        onTaskClick={handleTaskClick}
                        onAddTask={addTask}
                    />
                </div>
            </main>

            <TaskDetailModal
                task={currentSelectedTask}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={addSubtask}
                onReorderSubtasks={reorderSubtasks}
                onUpdateTask={updateTask}
                onUpdateSubtask={updateSubtask}
                onDeleteSubtask={deleteSubtask}
                onDeleteTask={deleteTask}
            />
        </div>
    );
}
