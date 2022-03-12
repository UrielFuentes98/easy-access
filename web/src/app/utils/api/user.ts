import { DOMAIN } from "app/constants";
import { SignUpFormVals } from "Pages/SignUp";

export async function loginUser(didToken: string | null): Promise<string> {
  const response = await fetch(`${DOMAIN}/user/login`, {
    headers: new Headers({
      Authorization: "Bearer " + didToken,
    }),
    method: "POST",
    credentials: "include",
  });
  const message = await response.text();
  return message;
}

export async function POST_LogoutUser() {
  const response = await fetch(`${DOMAIN}/user/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response;
}

export async function POST_UserInfo(userData: SignUpFormVals) {
  const response = await fetch(`${DOMAIN}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return response.ok;
}

export async function GET_SecretQuestions() {
  const response = await fetch(`${DOMAIN}/user/questions`);
  return response;
}
