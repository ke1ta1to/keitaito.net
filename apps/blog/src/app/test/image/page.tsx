import Image from "next/image";

import exampleImage from "@/assets/sample.jpg";

export default async function TestImagePage() {
  return <Image alt="" src={exampleImage} />;
}
