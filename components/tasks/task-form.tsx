"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { createTask, updateTask } from "@/actions/tasks";

interface TaskFormProps {
  /** When provided, the form operates in edit mode */
  taskId?: string;
  initialValues?: {
    title?: string;
    description?: string;
    requiredSkills?: string[];
    preferredWorker?: string;
    budget?: number;
    webhookUrl?: string;
  };
}

export function TaskForm({ taskId, initialValues }: TaskFormProps) {
  const isEditMode = Boolean(taskId);
  const [skills, setSkills] = React.useState<string[]>(initialValues?.requiredSkills ?? []);
  const [skillInput, setSkillInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  function addSkill(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    if (isEditMode && taskId) {
      const result = await updateTask(taskId, {
        title: data.get("title") as string,
        description: data.get("description") as string,
        requiredSkills: skills,
        preferredWorker: data.get("preferredWorker") as string,
        budget: parseFloat(data.get("budget") as string),
      });

      setLoading(false);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/tasks/${taskId}`);
        router.refresh();
      }
    } else {
      const result = await createTask({
        title: data.get("title") as string,
        description: data.get("description") as string,
        requiredSkills: skills,
        preferredWorker: data.get("preferredWorker") as string,
        budget: parseFloat(data.get("budget") as string),
        deadlineHours: data.get("deadlineHours")
          ? parseInt(data.get("deadlineHours") as string)
          : undefined,
        webhookUrl: (data.get("webhookUrl") as string) || undefined,
      });

      setLoading(false);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/tasks/${result.taskId}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Build a REST API for user authentication"
          required
          maxLength={120}
          defaultValue={initialValues?.title ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          placeholder="Describe exactly what you need done, deliverables, acceptance criteria..."
          required
          defaultValue={initialValues?.description ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Required Skills</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={addSkill}
          placeholder="Type a skill and press Enter (e.g. React, Python...)"
        />
        <p className="text-xs text-zinc-500">Press Enter or comma to add each skill</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="budget">Budget (USD) *</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 250.00"
            required
            defaultValue={initialValues?.budget ?? ""}
          />
        </div>

        {!isEditMode && (
          <div className="space-y-1.5">
            <Label htmlFor="deadlineHours">Deadline (hours from now)</Label>
            <Input
              id="deadlineHours"
              name="deadlineHours"
              type="number"
              min="1"
              placeholder="e.g. 72 (3 days)"
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="preferredWorker">Preferred Worker Type</Label>
        <Select
          name="preferredWorker"
          defaultValue={initialValues?.preferredWorker ?? "ANY"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ANY">Any (Human or Agent)</SelectItem>
            <SelectItem value="HUMAN">Human only</SelectItem>
            <SelectItem value="AGENT">AI Agent only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isEditMode && (
        <div className="space-y-1.5">
          <Label htmlFor="webhookUrl">Webhook URL (optional)</Label>
          <Input
            id="webhookUrl"
            name="webhookUrl"
            type="url"
            placeholder="https://myagent.com/hooks/task-done"
            defaultValue={initialValues?.webhookUrl ?? ""}
          />
          <p className="text-xs text-zinc-500">
            Receive callbacks when the task status changes
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
          {loading ? (isEditMode ? "Saving..." : "Sending...") : isEditMode ? "Save Changes" : "Send Task"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
