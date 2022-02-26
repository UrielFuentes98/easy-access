import { API_HOST } from "app/constants";
import { SignUpFormVals } from "Pages/SignUp";

export async function loginUser(didToken: string | null): Promise<string> {
  const response = await fetch(`${API_HOST}/user/login`, {
    headers: new Headers({
      Authorization: "Bearer " + didToken,
    }),
    credentials: "same-origin",
    method: "POST",
  });
  const message = await response.text();
  return message;
}

export async function POST_LogoutUser() {
  const response = await fetch(`${API_HOST}/user/logout`, {
    method: "POST",
  });
  return response;
}

export async function POST_UserInfo(userData: SignUpFormVals) {
  const response = await fetch(`${API_HOST}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.ok;
}

export async function GET_SecretQuestions() {
  const response = await fetch(`${API_HOST}/user/questions`);
  return response;
}
