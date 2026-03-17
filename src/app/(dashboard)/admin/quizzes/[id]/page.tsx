"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Edit02Icon,
  Calendar03Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  QuestionIcon,
  ShuffleIcon,
} from "@hugeicons/core-free-icons";

import { Breadcrumb, Loader, StatusBadge } from "@/components/shared";
import { useGetQuiz, useUpdateQuiz } from "@/lib/api/quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { QuizStatus } from "@/types";
import { formatDate } from "@/lib";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="text-foreground text-sm font-medium">{value ?? "—"}</p>
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: typeof Calendar03Icon; label: string; value?: string | number }) => (
  <div className="flex items-center gap-3">
    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
      <HugeiconsIcon icon={icon} className="text-muted-foreground size-5" />
    </div>
    <Field label={label} value={value} />
  </div>
);

const Page = () => {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: quizData, isPending } = useGetQuiz(id);
  const quiz = quizData?.data;
  const updateQuiz = useUpdateQuiz(id);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    instructions: "",
    status: "" as QuizStatus,
    duration: 0,
    pass_threshold: 0,
    max_attempts: 0,
    shuffle_questions: false,
    shuffle_options: false,
    show_results: false,
    start_date: "",
    end_date: "",
  });

  const breadcrumbs = [
    { label: "Quizzes", href: "/admin/quizzes" },
    { label: "Quiz Details", href: `/admin/quizzes/${id}` },
  ];

  const openEdit = () => {
    if (quiz) {
      setEditForm({
        title: quiz.title || "",
        description: quiz.description || "",
        instructions: quiz.instructions || "",
        status: quiz.status,
        duration: quiz.duration || 30,
        pass_threshold: quiz.pass_threshold || 70,
        max_attempts: quiz.max_attempts || 1,
        shuffle_questions: quiz.shuffle_questions || false,
        shuffle_options: quiz.shuffle_options || false,
        show_results: quiz.show_results || false,
        start_date: quiz.start_date?.split("T")[0] || "",
        end_date: quiz.end_date?.split("T")[0] || "",
      });
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    await updateQuiz.mutateAsync(editForm);
    setEditOpen(false);
  };

  if (isPending) return <Loader />;

  const questions = quiz?.questions || [];

  return (
    <div className="space-y-6 p-6">
      <Breadcrumb items={breadcrumbs} />
      <Button onClick={() => router.push("/admin/quizzes")} size="sm" variant="outline">
        <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" className="size-4" />
        Back to Quizzes
      </Button>

      {/* Quiz Header */}
      <div className="bg-card relative overflow-hidden rounded-xl border">
        <div className="bg-primary/10 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="border-background bg-primary flex size-24 items-center justify-center rounded-xl border-4 shadow-lg">
                <HugeiconsIcon icon={QuestionIcon} className="text-primary-foreground size-12" />
              </div>
              <div className="pb-2">
                <h2 className="text-foreground text-2xl font-semibold">{quiz?.title}</h2>
                <p className="text-muted-foreground text-sm">{questions.length} Questions</p>
                <div className="mt-1">{quiz?.status && <StatusBadge status={quiz.status} />}</div>
              </div>
            </div>
            <Button variant="outline" onClick={openEdit}>
              <HugeiconsIcon icon={Edit02Icon} data-icon="inline-start" className="size-4" />
              Edit Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Description & Instructions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground text-sm">{quiz?.description || "No description provided."}</p>
        </div>
        <div className="bg-card rounded-xl border p-6">
          <h3 className="mb-2 text-lg font-semibold">Instructions</h3>
          <p className="text-muted-foreground text-sm">{quiz?.instructions || "No instructions provided."}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quiz Settings */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Quiz Settings</h3>
          <div className="space-y-4">
            <InfoItem icon={Clock01Icon} label="Duration" value={`${quiz?.duration || 0} minutes`} />
            <InfoItem icon={CheckmarkCircle02Icon} label="Pass Threshold" value={`${quiz?.pass_threshold || 0}%`} />
            <InfoItem icon={ShuffleIcon} label="Max Attempts" value={quiz?.max_attempts} />
          </div>
        </div>

        {/* Quiz Options */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Options</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Shuffle Questions</span>
              <span className={`text-sm font-medium ${quiz?.shuffle_questions ? "text-emerald-600" : "text-muted-foreground"}`}>
                {quiz?.shuffle_questions ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Shuffle Options</span>
              <span className={`text-sm font-medium ${quiz?.shuffle_options ? "text-emerald-600" : "text-muted-foreground"}`}>
                {quiz?.shuffle_options ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Results</span>
              <span className={`text-sm font-medium ${quiz?.show_results ? "text-emerald-600" : "text-muted-foreground"}`}>
                {quiz?.show_results ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-card space-y-4 rounded-xl border p-6">
          <h3 className="text-lg font-semibold">Availability</h3>
          <div className="space-y-4">
            <InfoItem icon={Calendar03Icon} label="Start Date" value={formatDate(quiz?.start_date)} />
            <InfoItem icon={Calendar03Icon} label="End Date" value={formatDate(quiz?.end_date)} />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="mb-4 text-lg font-semibold">Questions</h3>
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{question.text}</p>
                      <p className="text-muted-foreground text-xs">{question.type} • {question.points} pts</p>
                    </div>
                  </div>
                </div>
                {question.options && question.options.length > 0 && (
                  <div className="ml-11 mt-2 space-y-1">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-2 text-sm ${option.is_correct ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}
                      >
                        <span className={`size-2 rounded-full ${option.is_correct ? "bg-emerald-600" : "bg-muted-foreground"}`} />
                        {option.text}
                        {option.is_correct && " ✓"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No questions added yet.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>Update quiz settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as QuizStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Duration (minutes)"
              type="number"
              value={editForm.duration}
              onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 30 })}
            />
            <Input
              label="Pass Threshold (%)"
              type="number"
              value={editForm.pass_threshold}
              onChange={(e) => setEditForm({ ...editForm, pass_threshold: parseInt(e.target.value) || 70 })}
            />
            <Input
              label="Max Attempts"
              type="number"
              value={editForm.max_attempts}
              onChange={(e) => setEditForm({ ...editForm, max_attempts: parseInt(e.target.value) || 1 })}
            />
            <Input
              label="Start Date"
              type="date"
              value={editForm.start_date}
              onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={editForm.end_date}
              onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
            />
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="text-sm font-medium">Shuffle Questions</span>
              <Switch
                checked={editForm.shuffle_questions}
                onCheckedChange={(checked) => setEditForm({ ...editForm, shuffle_questions: checked })}
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="text-sm font-medium">Shuffle Options</span>
              <Switch
                checked={editForm.shuffle_options}
                onCheckedChange={(checked) => setEditForm({ ...editForm, shuffle_options: checked })}
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="text-sm font-medium">Show Results</span>
              <Switch
                checked={editForm.show_results}
                onCheckedChange={(checked) => setEditForm({ ...editForm, show_results: checked })}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="Instructions"
                value={editForm.instructions}
                onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateQuiz.isPending}>
              {updateQuiz.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
