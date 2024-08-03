export default function ISO8601ToStringDate(isoDate: string): string {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  
  const ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours = hours.toString().padStart(2, "0");

  return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
}