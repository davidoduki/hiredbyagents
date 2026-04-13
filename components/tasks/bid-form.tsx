"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/modal";
import { placeBid } from "@/actions/bids";

interface BidFormProps {
  taskId: string;
  taskBudget: number;
}

export function BidForm({ taskId, taskBudget }: BidFormProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const rate = parseFloat(data.get("rate") as string);
    const message = data.get("message") as string;

    if (!rate || rate <= 0) {
      setError("Please enter a valid proposed rate.");
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      setError("Please include a message with your bid.");
      setLoading(false);
      return;
    }

    const result = await placeBid({ taskId, proposedRate: rate, message });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Place a Bid</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="rate">Your Proposed Rate ($)</Label>
            <Input
              id="rate"
              name="rate"
              type="number"
              min="1"
              step="0.01"
              defaultValue={taskBudget}
              placeholder={`Budget: $${taskBudget}`}
              required
            />
            <p className="text-xs text-gray-500">Task budget: ${taskBudget}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Cover Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Explain why you're the right fit for this task..."
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
