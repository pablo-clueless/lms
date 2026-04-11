import { Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { AnswerDto, Question } from "@/types";
import { TextEditor } from "./text-editor";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { cn, fromSnakeCase } from "@/lib";

interface Props {
  question: Question;
  answer?: AnswerDto;
  onAnswer?: (question: Question, answer: AnswerDto) => void;
}

export const QuestionCard = ({ question, answer, onAnswer }: Props) => {
  const handleTextAnswer = (value: string) => {
    onAnswer?.(question, { ...(answer as AnswerDto), question_id: question.id, answer_text: value });
  };

  const handleOptionAnswer = (option: string) => {
    console.log({ option });
    const current = answer?.selected_options || [];
    const selected =
      question.type === "MULTIPLE_ANSWER"
        ? current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
        : [option];
    onAnswer?.(question, { ...(answer as AnswerDto), question_id: question.id, selected_options: selected });
  };

  const options = question.options || [];

  return (
    <div className="space-y-2 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="bg-muted-foreground text-background grid size-4 place-items-center rounded-full text-[10px]">
          {question.order_index + 1}
        </div>
        <div className="flex items-center gap-x-2">
          <p className="text-muted-foreground text-xs">{fromSnakeCase(question.type)}</p>
          <span className="bg-muted-foreground size-1 rounded-full"></span>
          <p className="text-muted-foreground text-xs">{question.marks} Mark</p>
        </div>
      </div>
      <h4 className="text-foreground">{question.text}</h4>
      <div>
        {question.type === "ESSAY" && <TextEditor onValueChange={handleTextAnswer} value={answer?.answer_text || ""} />}
        {question.type === "SHORT_ANSWER" && (
          <Textarea onChange={(e) => handleTextAnswer(e.target.value)} value={answer?.answer_text || ""} />
        )}
        {(question.type === "MULTIPLE_ANSWER" || question.type === "MULTIPLE_CHOICE") && (
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => {
              const selected = answer?.selected_options?.includes(option);
              return (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border p-2",
                    selected && "border-foreground",
                  )}
                  key={index}
                  type="button"
                  onClick={() => handleOptionAnswer(option)}
                >
                  <span className="text-foreground text-sm">{option}</span>
                  {selected && <HugeiconsIcon className="size-4" icon={Tick01Icon} />}
                </button>
              );
            })}
          </div>
        )}
        {question.type === "TRUE_FALSE" && (
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-md border p-2",
                  answer?.selected_options?.includes(option) && "border-primary",
                )}
                key={index}
                type="button"
                onClick={() => handleOptionAnswer(option)}
              >
                <div className="flex items-center gap-x-2">
                  <Checkbox
                    checked={answer?.selected_options?.includes(option)}
                    onCheckedChange={() => handleOptionAnswer(option)}
                  />
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
