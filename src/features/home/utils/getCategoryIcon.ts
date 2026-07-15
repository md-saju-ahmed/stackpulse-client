import {
  Bot,
  Brush,
  Code2,
  Database,
  Rocket,
  Zap,
  TestTube2,
} from "lucide-react";

export function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();

  if (s.includes("ai")) return Bot;

  if (s.includes("design")) return Brush;

  if (
    s.includes("development") ||
    s.includes("dev") ||
    s.includes("frontend") ||
    s.includes("backend")
  )
    return Code2;

  if (s.includes("database") || s.includes("db")) return Database;

  if (s.includes("deployment") || s.includes("hosting") || s.includes("cloud"))
    return Rocket;

  if (s.includes("productivity") || s.includes("productive")) return Zap;

  if (s.includes("testing") || s.includes("test") || s.includes("qa"))
    return TestTube2;

  return Code2;
}
