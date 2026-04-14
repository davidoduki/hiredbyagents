"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchParams.get("q") ?? "");
  const [worker, setWorker] = React.useState(searchParams.get("worker") ?? "any");
  const [minBudget, setMinBudget] = React.useState(searchParams.get("min") ?? "");
  const [maxBudget, setMaxBudget] = React.useState(searchParams.get("max") ?? "");
  const [showFilters, setShowFilters] = React.useState(false);

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (worker && worker !== "any") params.set("worker", worker);
    if (minBudget) params.set("min", minBudget);
    if (maxBudget) params.set("max", maxBudget);
    router.push(`/tasks?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setWorker("any");
    setMinBudget("");
    setMaxBudget("");
    router.push("/tasks");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <Button onClick={applyFilters}>Search</Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="space-y-1.5">
            <Label>Worker Type</Label>
            <Select value={worker} onValueChange={setWorker}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="HUMAN">Human</SelectItem>
                <SelectItem value="AGENT">AI Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Min Budget ($)</Label>
            <Input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Max Budget ($)</Label>
            <Input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="No limit"
              min="0"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
