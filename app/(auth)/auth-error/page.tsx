export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-hcg-bg flex items-center justify-center px-4">
      <div className="hcg-card rounded-2xl border border-hcg-border p-8 max-w-md w-full">
        <h1 className="font-display font-bold text-2xl text-white mb-4">
          Sign-in Error
        </h1>
        <p className="text-gray-400 mb-2">Error code:</p>
        <p className="font-mono text-hcg-red text-lg font-bold mb-6">
          {searchParams.error ?? "no error code"}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Share this error code so we can diagnose the issue.
        </p>
        <a
          href="/login"
          className="hcg-btn-primary w-full justify-center py-2.5 text-sm font-semibold rounded-lg inline-flex"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
