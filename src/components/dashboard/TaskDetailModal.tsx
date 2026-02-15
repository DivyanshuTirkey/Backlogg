import * as React from "react";
import { Task, Subtask, TaskStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Reorder } from "framer-motion";
import { TimelineItem } from "./TimelineItem";
import { DatePicker } from "@/components/ui/date-picker";

import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onAddSubtask: (taskId: string, title: string, date?: Date) => void;
    onReorderSubtasks: (taskId: string, newSubtasks: Subtask[]) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

export function TaskDetailModal({
    task,
    isOpen,
    onClose,
    onToggleSubtask,
    onAddSubtask,
    onReorderSubtasks,
    onUpdateTask,
    onUpdateSubtask,
    onDeleteSubtask,
    onDeleteTask
}: TaskDetailModalProps) {
    const [newSubtask, setNewSubtask] = useState("");
    const [items, setItems] = useState<Subtask[]>([]);
    const [newSubtaskDate, setNewSubtaskDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        if (task) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setItems(task.subtasks);
        }
    }, [task]);

    const handleReorder = (newOrder: Subtask[]) => {
        setItems(newOrder);
        if (task) {
            onReorderSubtasks(task.id, newOrder);
        }
    };

    if (!task) return null;


    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            const date = newSubtaskDate || new Date();
            // set time to current time if just date selected
            const now = new Date();
            date.setHours(now.getHours(), now.getMinutes());

            onAddSubtask(task.id, newSubtask, date);
            setNewSubtask("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl z-10">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {/* Status Selector */}
                            <select
                                className={cn(
                                    "bg-zinc-900 border border-zinc-800 text-xs font-medium px-2 py-1 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none",
                                    task.status === 'Done' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" :
                                        task.status === 'Ongoing' ? "text-amber-400 border-amber-500/20 bg-amber-500/10" :
                                            task.status === 'Backlog' ? "text-zinc-500" : "text-zinc-300"
                                )}
                                value={task.status}
                                onChange={(e) => onUpdateTask(task.id, { status: e.target.value as TaskStatus })}
                            >
                                <option value="Upcoming">To Do</option>
                                <option value="Ongoing">In Progress</option>
                                <option value="Done">Completed</option>
                                <option value="Backlog">Backlog</option>
                            </select>

                            {/* Date Range Pcker */}
                            <div className="flex items-center gap-2 ml-auto bg-zinc-900/50 rounded-md border border-zinc-800 p-1">
                                <span className="text-[10px] text-zinc-500 uppercase font-semibold px-1">Start</span>
                                <DatePicker
                                    date={task.startTime}
                                    setDate={(date) => {
                                        if (date) {
                                            date.setHours(12, 0, 0, 0);
                                            onUpdateTask(task.id, { startTime: date });
                                        } else {
                                            onUpdateTask(task.id, { startTime: undefined });
                                        }
                                    }}
                                    className="w-[110px] bg-transparent border-none text-xs h-auto p-0 hover:bg-transparent"
                                    label="Pick start"
                                />
                                <span className="text-zinc-700">→</span>
                                <span className="text-[10px] text-zinc-500 uppercase font-semibold px-1">End</span>
                                <DatePicker
                                    date={task.deadline}
                                    setDate={(date) => {
                                        if (date) {
                                            date.setHours(12, 0, 0, 0);
                                            onUpdateTask(task.id, { deadline: date });
                                        } else {
                                            onUpdateTask(task.id, { deadline: undefined });
                                        }
                                    }}
                                    className="w-[110px] bg-transparent border-none text-xs h-auto p-0 hover:bg-transparent"
                                    label="Pick end"
                                />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold leading-relaxed">
                            <input
                                className="bg-transparent border-none outline-none focus:ring-0 w-full p-0 text-2xl font-bold text-zinc-100 placeholder:text-zinc-600"
                                value={task.title}
                                onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                            />
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Timeline View • Drag items to reorder
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto bg-dots-pattern relative min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="relative min-h-full p-8 pb-32">
                        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-0">
                            {items.map((subtask, index) => (
                                <TimelineItem
                                    key={subtask.id}
                                    subtask={subtask}
                                    index={index}
                                    isLast={index === items.length - 1}
                                    onToggle={() => onToggleSubtask(task.id, subtask.id)}
                                    onUpdate={(updates) => onUpdateSubtask(task.id, subtask.id, updates)}
                                    onDelete={() => onDeleteSubtask(task.id, subtask.id)}
                                />
                            ))}
                        </Reorder.Group>

                        {items.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-zinc-600 italic">No activities yet. Add one below.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800 bg-zinc-900 z-20 flex justify-between items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this plan?')) {
                                onDeleteTask(task.id);
                                onClose();
                            }
                        }}
                        className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                    >
                        <Trash2 size={18} />
                    </Button>

                    <form onSubmit={handleAddSubtask} className="flex gap-2 flex-1 justify-end">
                        <DatePicker
                            date={newSubtaskDate}
                            setDate={setNewSubtaskDate}
                            className="bg-zinc-950 border border-zinc-700 rounded-md px-2 h-9 text-zinc-300 w-[130px]"
                            label="Due date"
                        />
                        <Input
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            placeholder="Add new activity..."
                            className="bg-zinc-950 border-zinc-700 focus-visible:ring-indigo-500/50"
                        />
                        <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">
                            <Plus size={18} />
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
