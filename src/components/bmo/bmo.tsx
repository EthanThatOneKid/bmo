"use client";

import { useState, useRef } from "react";
import styles from "./bmo.module.css";

export interface BmoProps {
  prompt: string;
}

export interface BmoMessage {
  actor: BmoActor;
  content: string;
  timestamp: number;
}

export type BmoActor = "user" | "bmo";

export function Bmo(props: BmoProps) {
  const initialMessageRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState([
    {
      actor: "bmo",
      content: props.prompt,
      timestamp: Date.now(),
    },
  ]);

  function resetMessages() {
    setMessages([
      {
        actor: "bmo",
        content: props.prompt,
        timestamp: Date.now(),
      },
    ]);
  }

  function appendMessage(message: BmoMessage) {
    setMessages((messages) => messages.concat(message));
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <textarea
          ref={initialMessageRef}
          cols={30}
          rows={10}
          placeholder="Bmo's initial system message."
          defaultValue={props.prompt}
        />
        <button onClick={() => resetMessages()}>Reset</button>
      </aside>

      <Screen />
    </>
  );
}

function Screen() {
  return (
    <div className={styles.screen}>
      <Face />
    </div>
  );
}

function Face() {
  return (
    <div className={styles.face}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <Eye x={33} y={30} />
        <Eye x={66} y={30} />
        <Mouth />
      </svg>
    </div>
  );
}

function Eye(props: { x: number; y: number }) {
  return <circle cx={props.x} cy={props.y} r={2} fill="black" />;
}

function Mouth(props: { x?: number; y?: number }) {
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  return (
    <path
      d={`M ${35 + x} ${45 + y} Q ${50 + x} ${55 + y} ${65 + x} ${45 + y}`}
      stroke="black"
      stroke-width="2"
      fill="transparent"
      stroke-linecap="round"
    />
  );
}
