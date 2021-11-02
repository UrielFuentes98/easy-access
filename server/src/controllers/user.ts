import { wrap } from "@mikro-orm/core";
import { GET_QUESTIONS, RES_MESSAGES } from "../constants";
import { Question } from "../entities";
import { DI } from "../index";

interface questionReturnInfo {
  id: number;
  question: string;
}

interface questionsResponse {
  status: number;
  message: string;
  data?: questionReturnInfo[];
}

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
  try {
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
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getQuestions(): Promise<questionsResponse> {
  try {
    const questions = await DI.questionRepository.findAll();
    const questionsReturnInfo = getQuestionsReturnInfo(questions);
    return {
      status: GET_QUESTIONS.SUCCESS,
      message: RES_MESSAGES[GET_QUESTIONS.SUCCESS],
      data: questionsReturnInfo,
    };
  } catch (err) {
    return {
      status: GET_QUESTIONS.ERROR,
      message: RES_MESSAGES[GET_QUESTIONS.ERROR],
    };
  }
}

function getQuestionsReturnInfo(questions: Question[]): questionReturnInfo[] {
  const questionsReturnInfo = questions.map((question) => {
    return {
      id: question.id,
      question: question.question,
    } as questionReturnInfo;
  });
  return questionsReturnInfo;
}
