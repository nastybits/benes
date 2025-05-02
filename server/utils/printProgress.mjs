export function printProgress(curr, total) {
  const pct = ((curr / total) * 100).toFixed(0).padStart(3)
  process.stdout.write(`\rProgress: ${curr}/${total}  ${pct}%`)
}