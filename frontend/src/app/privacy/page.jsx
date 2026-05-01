import {contentAdapter} from "@/lib/contentAdapter";

export default async function Privacy() {
  const content = await contentAdapter.getPrivacyPolicy();

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold text-slate-900">
        {content?.title || "Privacy Policy"}
      </h1>

      <p className="mt-4 text-slate-600">
        {content?.description || ""}
      </p>

      <section className="mt-10 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {content?.dataCollection?.title || "Data Collection"}
          </h2>
          <p className="mt-2 text-slate-600">
            {content?.dataCollection?.description || ""}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {content?.dataUsage?.title || "Data Usage"}
          </h2>
          <p className="mt-2 text-slate-600">
            {content?.dataUsage?.description || ""}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {content?.dataSharing?.title || "Data Sharing"}
          </h2>
          <p className="mt-2 text-slate-600">
            {content?.dataSharing?.description || ""}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {content?.userRights?.title || "User Rights"}
          </h2>
          <p className="mt-2 text-slate-600">
            {content?.userRights?.description || ""}
          </p>
        </div>
      </section>
    </main>
  );
}