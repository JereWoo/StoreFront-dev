import { useRemoveAuthProviderMutation } from "@/generated/hooks";

type RemoveAuthButtonProps = {
  provider: "facebook" | "google";
};

export function RemoveAuthButton({ provider }: RemoveAuthButtonProps) {
  const mutation = useRemoveAuthProviderMutation();

  async function handleRemove() {
    try {
      const res = await mutation.mutateAsync({ provider });
      if (res.removeAuthProvider) {
        // ✅ success (true means provider removed)
        console.log(`${provider} unlinked successfully`);
      } else {
        console.warn(`${provider} unlink returned false`);
      }
    } catch (err) {
      console.error("Error unlinking provider:", err);
    }
  }

  return (
    <button
      className="px-3 py-1 bg-red-500 text-white rounded"
      onClick={handleRemove}
      disabled={mutation.isPending}
    >
      Remove {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
