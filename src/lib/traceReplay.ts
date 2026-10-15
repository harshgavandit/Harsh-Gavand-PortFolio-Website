export function startTraceReplay({
  onStep,
  onComplete,
  schedule = (callback: () => void, delay: number) =>
    setTimeout(callback, delay),
  cancel = (handle: ReturnType<typeof setTimeout>) => clearTimeout(handle),
}: {
  onStep: (step: number) => void;
  onComplete: () => void;
  schedule?: (
    callback: () => void,
    delay: number,
  ) => ReturnType<typeof setTimeout>;
  cancel?: (handle: ReturnType<typeof setTimeout>) => void;
}) {
  let stopped = false;
  onStep(0);
  const timers = [1, 2, 3, 4].map((step) =>
    schedule(() => {
      if (stopped) return;
      if (step < 4) onStep(step);
      else onComplete();
    }, step * 150),
  );
  return () => {
    stopped = true;
    timers.forEach(cancel);
  };
}
