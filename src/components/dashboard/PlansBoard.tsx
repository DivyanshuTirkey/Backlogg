import { Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface PlansBoardProps {
    tasks: Task[];
    moveTask: (id: string, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'Upcoming', label: 'To Do', color: 'bg-zinc-500' },
    { id: 'Ongoing', label: 'In Progress', color: 'bg-amber-500' },
    { id: 'Done', label: 'Completed', color: 'bg-emerald-500' },
    { id: 'Backlog', label: 'Backlog', color: 'bg-zinc-700' },
];

// ... imports
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Sparkles, Plus } from "lucide-react";

interface PlansBoardProps {
    tasks: Task[];
    moveTask: (id: string, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
    onAddTask: (title: string, initialSubtask?: string) => void; // New prop
}

export function PlansBoard({ tasks, moveTask, onTaskClick, onAddTask }: PlansBoardProps) {
    const onDragEnd = (result: DropResult) => {
        // ... existing drag logic
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (source.droppableId !== destination.droppableId) {
            moveTask(draggableId, destination.droppableId as TaskStatus);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Hero Header Card */}
            <div className="mx-8 mt-6 mb-2 bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Your Roadmap</h1>
                        <p className="text-zinc-400">
                            Manage your tasks, track progress, and conquer your goals.
                            Use <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-mono">title / subtask</kbd> to add quickly.
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex-1 max-w-xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const input = (e.target as HTMLFormElement).elements.namedItem('quickAddHero') as HTMLInputElement;
                                const value = input.value.trim();
                                if (value) {
                                    const [title, subtask] = value.split('/').map(s => s.trim());
                                    onAddTask(title, subtask);
                                    input.value = '';
                                }
                            }}
                            className="relative group/input"
                        >
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Plus className="w-5 h-5 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                name="quickAddHero"
                                placeholder="What's the next big plan? (e.g. 'Launch V2 / Design System')"
                                className="w-full bg-zinc-950/50 border border-zinc-700/50 rounded-lg pl-12 pr-4 py-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-zinc-950 transition-all shadow-inner"
                                autoComplete="off"
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button type="submit" className="p-2 hover:bg-indigo-500/10 rounded-md text-zinc-400 hover:text-indigo-400 transition-colors">
                                    <Sparkles size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="flex h-full min-w-max px-8 pb-4 gap-8">
                        {COLUMNS.map((col) => {
                            const colTasks = tasks.filter((t) => t.status === col.id);
                            // ... existing column rendering (keep render logic identical)
                            return (
                                <div key={col.id} className="w-[320px] flex flex-col h-full pt-4">
                                    <div className="mb-4 flex items-center justify-between border-b border-zinc-800/50 pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full", col.color)} />
                                            <h3 className="font-semibold text-sm text-zinc-300 uppercase tracking-widest">{col.label}</h3>
                                        </div>
                                        <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                                            {colTasks.length}
                                        </span>
                                    </div>

                                    <Droppable droppableId={col.id}>
                                        {(provided) => (
                                            <ScrollArea
                                                className="flex-1 -mr-4 pr-4 transition-colors rounded-lg"
                                            >
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="flex flex-col pt-1 pb-10 min-h-[150px]"
                                                >
                                                    {colTasks.length > 0 ? (
                                                        colTasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{ ...provided.draggableProps.style }}
                                                                        className="mb-3"
                                                                    >
                                                                        <TaskCard task={task} onClick={() => onTaskClick(task)} />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))
                                                    ) : (
                                                        (colTasks.length === 0) && (
                                                            <div className="border border-dashed border-zinc-800/50 rounded-lg p-8 text-center mt-2">
                                                                <p className="text-xs text-zinc-600">No items</p>
                                                            </div>
                                                        )
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            </ScrollArea>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}
