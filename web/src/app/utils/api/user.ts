import { SignUpFormVals } from "Pages/SignUp";

export async function loginUser(didToken: string | null): Promise<string> {
  const response = await fetch("/user/login", {
    headers: new Headers({
      Authorization: "Bearer " + didToken,
    }),
    credentials: "same-origin",
    method: "POST",
  });
  const message = await response.text();
  return message;
}

export async function completeUserInfo(userData: SignUpFormVals) {
  const response = await fetch("/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.ok;
}
