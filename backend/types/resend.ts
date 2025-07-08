export interface mailProps{
  to: string;
  subject: "Successfully Recieved Donation" | "Successfully Sent Donation" | "Successfully Logged In";
  html: string;
}