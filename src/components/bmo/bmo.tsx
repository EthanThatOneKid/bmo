"use client";

import { useState, useRef } from "react";
import type { BmoMessage } from "@/lib/bmo";
import styles from "./bmo.module.css";

export function Bmo(props: BmoProps) {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [uiState, setUIState] = useState<BmoUIState>(BmoUIState.IDLE);
  const [messages, setMessages] = useState<BmoMessage[]>([]);

  function resetMessages() {
    if (uiState === BmoUIState.LOADING) {
      return;
    }

    setMessages([]);
  }

  async function sendMessage() {
    if (
      chatInputRef.current === null ||
      chatInputRef.current.value.length === 0 ||
      uiState === BmoUIState.LOADING
    ) {
      return;
    }

    setUIState(BmoUIState.LOADING);
    const currentMessages: BmoMessage[] = [
      ...messages,
      {
        actor: "user",
        content: chatInputRef.current.value,
        dateString: new Date().toISOString(),
      },
    ];
    chatInputRef.current.value = "";
    setMessages(currentMessages);

    generateText(currentMessages)
      .then((response) => {
        if (!response.ok) {
          console.error(response);
          throw new Error("Failed to generate text");
        }

        return response.text();
      })
      .then((text) => {
        currentMessages.push({
          actor: "bmo",
          content: text,
          dateString: new Date().toISOString(),
        });

        setMessages(currentMessages);
      })
      .finally(() => {
        setUIState(BmoUIState.IDLE);
      });
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <button
          onClick={() => resetMessages()}
          disabled={uiState === BmoUIState.LOADING}
        >
          Reset
        </button>

        <details>
          <summary>
            <strong>BMO</strong> (System Prompt)
          </summary>
          <pre className={styles.systemPrompt}>
            <code>{props.systemPrompt}</code>
          </pre>
        </details>

        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <div className={styles.message}>
                <>
                  {message.actor === "bmo" ? (
                    <strong>BMO</strong>
                  ) : (
                    <strong>You</strong>
                  )}
                  <pre>
                    <code>{message.content}</code>
                  </pre>
                </>
              </div>
            </li>
          ))}
        </ul>

        {uiState === BmoUIState.LOADING && (
          <div className={styles.loading}>Loading...</div>
        )}

        <hr />

        <label htmlFor="chatInput">
          Chat:
          <br />
          <textarea
            ref={chatInputRef}
            className={styles.chatInput}
            id="chatInput"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
        </label>
        <br />
        <button
          onClick={() => sendMessage()}
          disabled={uiState === BmoUIState.LOADING}
        >
          Send
        </button>
      </aside>

      <Screen />
    </>
  );
}

export interface BmoProps {
  systemPrompt: string;
}

export enum BmoUIState {
  IDLE = "idle",
  LOADING = "loading",
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
      strokeWidth="2"
      fill="transparent"
      strokeLinecap="round"
    />
  );
}

function generateText(messages: BmoMessage[]) {
  return fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });
}
