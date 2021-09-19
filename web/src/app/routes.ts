import { LandingPage } from 'Pages'
import { FC } from 'react'

interface PagePath {
  path: string
  page: FC
}

export const routes: PagePath[] = [
  {
    path: '/',
    page: LandingPage,
  },
]

export const defaultPage: FC = LandingPage
