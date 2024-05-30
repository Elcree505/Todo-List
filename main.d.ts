export interface TodoItem {
    id: string;
    content: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt?: Date;
    completedAt?: Date;
}

export interface TodoList {
    todos: TodoItem[];
    addTodo(content: string): void;
    removeTodo(id: string): void;
    editTodo(id: string, newContent: string): void;
    toggleCompletion(id: string): void;
}

import { TodoItem, TodoList } from "./TodoInterfaces";

export class TodoManager implements TodoList {
    todos: TodoItem[] = [];

    constructor() {
        this.loadTodos();
    }

    addTodo(content: string): void {
        if (!this.isTodoValid(content)) {
            throw new Error("Todo cannot be empty or duplicate.");
        }
        const newTodo: TodoItem = {
            id: this.generateUniqueId(),
            content,
            isCompleted: false,
            createdAt: new Date(),
        };
        this.todos.push(newTodo);
        this.saveTodos();
    }

    removeTodo(id: string): void {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.saveTodos();
    }

    editTodo(id: string, newContent: string): void {
        let todo = this.todos.find((todo) => todo.id === id);
        if (todo) {
            todo.content = newContent;
            todo.updatedAt = new Date();
            this.saveTodos();
        }
    }

    toggleCompletion(id: string): void {
        let todo = this.todos.find((todo) => todo.id === id);
        if (todo) {
            todo.isCompleted = !todo.isCompleted;
            todo.completedAt = todo.isCompleted ? new Date() : undefined;
            this.saveTodos();
        }
    }

    private isTodoValid(content: string): boolean {
        return (
            content.trim() !== "" &&
            !this.todos.some(
                (todo) => todo.content.toLowerCase() === content.toLowerCase()
            )
        );
    }

    private generateUniqueId(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    private loadTodos(): void {
        // Load todos from local storage or a database
    }

    private saveTodos(): void {
        // Save todos to local storage or a database
    }
}
