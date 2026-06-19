import { redirect } from "next/navigation";

export default async function CertificateVerifyRedirectPage({ params }) {
  const { certificateId } = await params;
  redirect(`/career/certificate/verify/${certificateId}`);
}
