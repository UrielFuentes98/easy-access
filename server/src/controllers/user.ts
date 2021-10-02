import { wrap } from "@mikro-orm/core";
import { DI } from "../index";

export interface UserInfo {
  answer_public?: string;
  answer_private: string;
  question_public?: string;
  question_private: string;
}

export async function saveUserInfo(
  userInfo: UserInfo,
  user: Express.User
): Promise<boolean> {
  const registeredUser = await DI.userRepository.findOne({
    issuer: user.issuer,
  });

  if (registeredUser) {
    wrap(registeredUser).assign({
      question_private: parseInt(userInfo.question_private),
      answer_private: userInfo.answer_private,
    });

    if (userInfo.question_public) {
      wrap(registeredUser).assign({
        question_public: parseInt(userInfo.question_public),
        answer_public: userInfo.answer_public,
      });
    }
    await DI.userRepository.persistAndFlush(registeredUser);
  }

  return true;
}
