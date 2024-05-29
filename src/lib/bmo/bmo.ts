export interface BmoMessage {
  actor: BmoActor;
  content: string;
  dateString?: string;
}

export type BmoActor = "user" | "bmo";
