"use client";

import { Mail01Icon, Attachment01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetEmail } from "@/lib/api/communication";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib";
import type { Email } from "@/types";
import { Loader } from "./loader";

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

export const EmailListItem = ({ email, isSelected, onClick }: EmailListItemProps) => {
  const preview = `${email.body?.slice(0, 50)}...` || "";
  const senderName = email.sender ? `${email.sender.first_name} ${email.sender.last_name}` : null;
  const avatarFallback = senderName
    ? getInitials(senderName)
    : email.recipient_scope?.slice(0, 2).toUpperCase() || "EM";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-3 text-left transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{email.subject || "No Subject"}</p>
            {email.attachment_urls && email.attachment_urls.length > 0 && (
              <HugeiconsIcon icon={Attachment01Icon} className="text-muted-foreground size-3.5 shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{preview || "No content"}</p>
          <p className="text-muted-foreground mt-1 text-[10px]">
            {email.sent_at ? format(new Date(email.sent_at), "MMM d, h:mm a") : "Draft"}
          </p>
        </div>
      </div>
    </button>
  );
};

interface EmailDetailProps {
  emailId: string;
  onClose?: () => void;
  defaultSenderName?: string;
}

export const EmailDetail = ({ emailId, onClose, defaultSenderName = "System Administrator" }: EmailDetailProps) => {
  const { data: email, isPending } = useGetEmail(emailId);

  if (isPending) {
    return (
      <div className="grid h-full place-items-center">
        <Loader />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="grid h-full place-items-center">
        <p className="text-muted-foreground text-sm">Email not found</p>
      </div>
    );
  }

  const senderName = email.sender ? `${email.sender.first_name} ${email.sender.last_name}` : defaultSenderName;
  const avatarFallback = getInitials(senderName);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{email.subject || "No Subject"}</h2>
          {onClose && (
            <Button onClick={onClose} size="icon-sm" variant="outline">
              <HugeiconsIcon className="size-4" icon={Cancel01Icon} />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{senderName}</p>
              <p className="text-muted-foreground text-xs">To: {email.recipient_scope?.replace(/_/g, " ") || "You"}</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            {email.sent_at ? format(new Date(email.sent_at), "MMMM d, yyyy 'at' h:mm a") : "Draft"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {email.html_body ? (
          <div
            className="prose prose-sm dark:prose-invert tiptap max-w-none"
            dangerouslySetInnerHTML={{ __html: email.html_body }}
          />
        ) : (
          <div className="text-sm whitespace-pre-wrap">{email.body || "No content"}</div>
        )}
      </div>
      {email.attachment_urls && email.attachment_urls.length > 0 && (
        <div className="border-t p-6">
          <p className="mb-3 text-sm font-medium">Attachments ({email.attachment_urls.length})</p>
          <div className="flex flex-wrap gap-2">
            {email.attachment_urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors"
              >
                <HugeiconsIcon icon={Attachment01Icon} className="size-4" />
                Attachment {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface EmailListProps {
  emails: Email[];
  selectedId: string;
  onSelect: (id: string) => void;
  emptyMessage?: string;
}

export const EmailList = ({ emails, selectedId, onSelect, emptyMessage = "No emails yet" }: EmailListProps) => {
  if (emails.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12">
        <HugeiconsIcon icon={Mail01Icon} className="text-muted-foreground mb-3 size-10" />
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-3">
      {emails.map((email) => (
        <EmailListItem
          key={email.id}
          email={email}
          isSelected={selectedId === email.id}
          onClick={() => onSelect(email.id)}
        />
      ))}
    </div>
  );
};

export const EmailEmptyState = ({ message = "Select an email to read" }: { message?: string }) => {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex flex-col items-center">
        <HugeiconsIcon icon={Mail01Icon} className="text-muted-foreground mb-3 size-12" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
};

interface EmailInboxLayoutProps {
  emails: Email[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
  emptyListMessage?: string;
  emptyDetailMessage?: string;
  defaultSenderName?: string;
}

export const EmailInboxLayout = ({
  emails,
  selectedId,
  onSelect,
  onClose,
  emptyListMessage,
  emptyDetailMessage,
  defaultSenderName,
}: EmailInboxLayoutProps) => {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-6 overflow-hidden border-t">
      <div className="col-span-2 flex flex-col border-r">
        <EmailList emails={emails} selectedId={selectedId} onSelect={onSelect} emptyMessage={emptyListMessage} />
      </div>
      <div className="col-span-4 flex flex-col overflow-hidden">
        {selectedId ? (
          <EmailDetail emailId={selectedId} onClose={onClose} defaultSenderName={defaultSenderName} />
        ) : (
          <EmailEmptyState message={emptyDetailMessage} />
        )}
      </div>
    </div>
  );
};
