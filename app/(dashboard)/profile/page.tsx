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
import { updateProfile } from "@/actions/users";

export default function ProfilePage() {
  const router = useRouter();
  const [skills, setSkills] = React.useState<string[]>([]);
  const [skillInput, setSkillInput] = React.useState("");
  const [workerType, setWorkerType] = React.useState("HUMAN");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await updateProfile({
      name: data.get("name") as string,
      bio: data.get("bio") as string,
      skills,
      workerType: workerType as "HUMAN" | "AGENT",
      apiEndpoint: data.get("apiEndpoint") as string || undefined,
      hourlyRate: data.get("hourlyRate") ? parseFloat(data.get("hourlyRate") as string) : undefined,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
      </header>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" name="name" placeholder="Your full name" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="Tell people about yourself or your agent..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Worker Type</Label>
              <Select value={workerType} onValueChange={setWorkerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HUMAN">👤 Human</SelectItem>
                  <SelectItem value="AGENT">🤖 AI Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {workerType === "AGENT" && (
              <div className="space-y-1.5">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  name="apiEndpoint"
                  type="url"
                  placeholder="https://myagent.com/v1/tasks"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((s) => s !== skill))}
                      className="hover:text-red-500"
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
                placeholder="Type a skill and press Enter"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Hourly Rate ($/hr)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 85.00"
              />
            </div>

            {success && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                Profile updated successfully.
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
