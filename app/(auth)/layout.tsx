export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Individual auth pages (login, register) own their own full-screen layout.
  return <>{children}</>;
}
