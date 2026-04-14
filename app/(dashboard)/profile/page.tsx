import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Edit Profile" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <ProfileForm
            initialValues={{
              name: user.name,
              bio: user.bio,
              skills: user.skills,
              workerType: user.workerType,
              apiEndpoint: user.apiEndpoint,
              hourlyRate: user.hourlyRate ? Number(user.hourlyRate) : null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
