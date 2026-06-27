// Returns true only if the employee's agent sent an event within the last 5 minutes.
// isCurrentlyWorking is never reset to false when the agent closes, so we derive
// "online" from lastSeenAt staleness instead.

export function isLiveActive(emp) {
  if (!emp?.isCurrentlyWorking || !emp?.lastSeenAt) return false;
  return (Date.now() - new Date(emp.lastSeenAt).getTime()) < 5 * 60 * 1000;
}
