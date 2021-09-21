import { LandingPage, HomePage } from "Pages";
import { FC } from "react";

interface PagePath {
  path: string;
  page: FC;
}

export const routes: PagePath[] = [
  {
    path: "/",
    page: LandingPage,
  },
  {
    path: "/home",
    page: HomePage,
  },
];

export const defaultPage: FC = LandingPage;
