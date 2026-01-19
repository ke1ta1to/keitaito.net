import { Button } from "@/components/ui/button";
import { fetchAuthSession } from "aws-amplify/auth";

export function FetchTokenButton() {
  const handleFetchToken = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.idToken?.toString();
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    console.log("Access Token:", { accessToken });
    const res = await fetch(
      "https://kylwpt10s5.execute-api.ap-northeast-1.amazonaws.com/prod/activities",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    console.log("response data:", data);
  };
  return <Button variant="destructive" onClick={handleFetchToken}>Fetch Token</Button>;
}
