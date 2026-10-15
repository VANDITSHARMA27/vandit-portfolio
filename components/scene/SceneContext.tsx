"use client";

import { createContext, useContext } from "react";

export type SceneId =
  | "hero"
  | "about"
  | "experience"
  | "work"
  | "credentials"
  | "skills"
  | "contact";

export const SCENES: { id: SceneId; label: string }[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "credentials", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export type Direction = "next" | "prev" | "jump";

interface SceneCtxValue {
  index: number;
  id: SceneId;
  transitioning: boolean;
  go: (to: SceneId | number) => void;
  next: () => void;
  prev: () => void;
}

export const SceneCtx = createContext<SceneCtxValue | null>(null);

export function useScene() {
  const ctx = useContext(SceneCtx);
  if (!ctx) throw new Error("useScene must be used within SceneController");
  return ctx;
}

export function sceneIndex(id: SceneId) {
  return SCENES.findIndex((s) => s.id === id);
}
