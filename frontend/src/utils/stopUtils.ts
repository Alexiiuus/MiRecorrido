export type StopType = "start" | "end" | "middle";

export function getStopSequence(stop: any, index: number): number {
  return Number(
    stop.sequence ??
    stop.stop_sequence ??
    stop.stopSequence ??
    index
  );
}

export function classifyStop(index: number, total: number): StopType {
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "middle";
}

export function sortStopsBySequence<T extends Record<string, any>>(stops: T[]): T[] {
  return [...stops].sort((a, b) => {
    const seqA = getStopSequence(a, 0);
    const seqB = getStopSequence(b, 1);
    return seqA - seqB;
  });
}
