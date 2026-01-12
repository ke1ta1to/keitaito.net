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
      "https://z7xj2t3j71.execute-api.ap-northeast-1.amazonaws.com/prod/activities",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    console.log("response data:", data);
  };
  return <button onClick={handleFetchToken}>Fetch Token</button>;
}
