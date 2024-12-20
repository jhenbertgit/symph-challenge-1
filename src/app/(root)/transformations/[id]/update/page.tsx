import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { getImageById } from "@/lib/actions/image.actions";

const Page = async ({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) => {
  const resolvedParams = await params; // Await params to resolve it
  const { id } = resolvedParams;

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = await getImageById(id);

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={user._id}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
