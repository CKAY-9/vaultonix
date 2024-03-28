export const calculateLevelCost = (current_level: number) => {
  return 100 * (Math.pow(current_level, 5/4))
}