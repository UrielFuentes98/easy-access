import { LandingPage, HomePage, SignUp, NewTransfer, Question } from "Pages";
import { FC } from "react";

interface PagePath {
  path: string;
  page: FC;
}

export const SITE_PATHS = {
  LANDING: "/",
  HOME: "/home",
  SIGN_UP: "/signup",
  NEW_TRANSFER: "/newtransfer",
  QUESTION: "/question",
};
export const routes: PagePath[] = [
  {
    path: SITE_PATHS.LANDING,
    page: LandingPage,
  },
  {
    path: SITE_PATHS.HOME,
    page: HomePage,
  },
  {
    path: SITE_PATHS.SIGN_UP,
    page: SignUp,
  },
  {
    path: SITE_PATHS.NEW_TRANSFER,
    page: NewTransfer,
  },
  {
    path: SITE_PATHS.QUESTION,
    page: Question,
  },
];

export const defaultPage: FC = LandingPage;
