export default function WhatsAppIcon({ className = "ic" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6a13 13 0 0 1-5-4.4c-.5-.8-.9-1.7-.9-2.7 0-1 .5-1.5.8-1.8.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.1.3.6 1 1.4 1.7.9.8 1.7 1.1 2 1.2.3.1.5.1.7-.1l.6-.7c.2-.3.4-.3.7-.2l2 1c.3.2.5.2.6.4.1.1.1.5-.1.8Z" />
    </svg>
  );
}
