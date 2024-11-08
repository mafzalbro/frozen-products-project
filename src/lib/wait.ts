// Utility function to simulate wait/delay
export default function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }