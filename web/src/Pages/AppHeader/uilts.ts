import { SITE_PATHS } from "app/routes";

export function showLogOutButton(path: string) {
  return path === SITE_PATHS.HOME || path === SITE_PATHS.NEW_TRANSFER;
}
