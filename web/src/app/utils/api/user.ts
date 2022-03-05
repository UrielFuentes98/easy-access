import { SignUpFormVals } from "Pages/SignUp";

export async function loginUser(didToken: string | null): Promise<string> {
  const response = await fetch(`user/login`, {
    headers: new Headers({
      Authorization: "Bearer " + didToken,
    }),
    method: "POST",
  });
  const message = await response.text();
  return message;
}

export async function POST_LogoutUser() {
  const response = await fetch(`user/logout`, {
    method: "POST",
  });
  return response;
}

export async function POST_UserInfo(userData: SignUpFormVals) {
  const response = await fetch(`user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.ok;
}

export async function GET_SecretQuestions() {
  const response = await fetch(`user/questions`);
  return response;
}
