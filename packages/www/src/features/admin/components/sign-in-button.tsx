import { signInWithRedirect, signOut } from "aws-amplify/auth";

export function SignInButton() {
  const handleSignIn = async () => {
    await signInWithRedirect();
  };
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
}
