import {contentAdapter} from "@/lib/contentAdapter";

export default async function TermsPage() {
  const content = await contentAdapter.getTermsOfService();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="text-lg mb-6">{content.description}</p>

      <h2 className="text-2xl font-semibold mb-3">Use of Services</h2>
      <p className="mb-4">{content.useOfServices}</p>

      <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
      <p className="mb-4">{content.intellectualProperty}</p>

      <h2 className="text-2xl font-semibold mb-3">Disclaimers</h2>
      <p className="mb-4">{content.disclaimers}</p>

      <h2 className="text-2xl font-semibold mb-3">Modifications</h2>
      <p className="mb-4">{content.modifications}</p>
    </div>
  );
}