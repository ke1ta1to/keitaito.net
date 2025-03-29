import { OverviewCard } from "@/components/overview-card";

export function ContactCard() {
  return (
    <OverviewCard title="Contact">
      <div className="prose max-w-none">
        <h2>Get in Touch</h2>
        <p>Feel free to reach out to us!</p>
        <p>Email: contact@example.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </OverviewCard>
  );
}
