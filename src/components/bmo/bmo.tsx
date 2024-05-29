"use client";

import { useState, useRef } from "react";
import styles from "./bmo.module.css";

export function Bmo(props: BmoProps) {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [uiState, setUIState] = useState<BmoUIState>(BmoUIState.IDLE);
  const [messages, setMessages] = useState<BmoMessage[]>([
    {
      actor: "bmo",
      content: props.systemPrompt,
      dateString: new Date().toISOString(),
    },
  ]);

  function resetMessages() {
    if (uiState === BmoUIState.LOADING) {
      return;
    }

    setMessages([
      {
        actor: "bmo",
        content: props.systemPrompt,
        dateString: new Date().toISOString(),
      },
    ]);
  }

  function appendMessage(message: BmoMessage) {
    setMessages((messages) => messages.concat(message));
  }

  function sendMessage() {
    if (
      chatInputRef.current === null ||
      chatInputRef.current.value.length === 0 ||
      uiState === BmoUIState.LOADING
    ) {
      return;
    }

    appendMessage({
      actor: "user",
      content: chatInputRef.current.value,
      dateString: new Date().toISOString(),
    });
    chatInputRef.current.value = "";
    getBmoMessage(props.systemPrompt, messages);
  }

  async function getBmoMessage(prompt: string, messages: BmoMessage[]) {
    setUIState(BmoUIState.LOADING);
    const llmPrompt = executePrompt(prompt, messages);
    console.log(llmPrompt);
    await sleep(2e3);
    appendMessage({
      actor: "bmo",
      content: "This is a response from BMO.",
      dateString: new Date().toISOString(),
    });
    setUIState(BmoUIState.IDLE);
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <button onClick={() => resetMessages()}>Reset</button>

        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <div className={styles.message}>
                {index === 0 ? (
                  <details>
                    <summary>
                      <strong>BMO</strong> (System Prompt)
                    </summary>
                    <pre>
                      <code>{message.content}</code>
                    </pre>
                  </details>
                ) : (
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
                )}
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function executePrompt(systemPrompt: string, messages: BmoMessage[]) {
  return [
    systemPrompt,
    "Below is a history of the messages that have been sent:",
    ...messages
      .slice(1)
      .map((message) => `- **${message.actor}**: ${message.content}`),
  ].join("\n");
}

export interface BmoMessage {
  actor: BmoActor;
  content: string;
  dateString?: string;
}

export type BmoActor = "user" | "bmo";

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
