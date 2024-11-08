export default function isNew(createdAt: string, days: number = 30): boolean {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();

  // Calculate the difference in time (milliseconds)
  const timeDifference = currentDate.getTime() - createdDate.getTime();

  // Convert the time difference to days
  const differenceInDays = timeDifference / (1000 * 3600 * 24);

  // If the product was created within the last 30 days, it's new
  return differenceInDays <= days;
}
