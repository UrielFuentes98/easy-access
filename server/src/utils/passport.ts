import { DI } from "../index";

/* 1️⃣ Setup Magic Admin SDK */
import { Magic, MagicUserMetadata } from "@magic-sdk/admin";
import { MAGIC_SECRET_KEY } from "../app_constants";
export const magic = new Magic(MAGIC_SECRET_KEY);

/* 2️⃣ Implement Auth Strategy */
import passport from "passport";
import { DoneFunc, MagicUser, Strategy as MagicStrategy } from "passport-magic";
import { User } from "../entities";
import { wrap } from "@mikro-orm/core";

const strategy = new MagicStrategy(
  async function (req, magicUser, done) {
    console.log("strategy");
    const userMetadata = await magic.users.getMetadataByIssuer(
      magicUser.issuer
    );
    const existingUser = await DI.userRepository.findOne({
      issuer: magicUser.issuer,
    });
    if (!existingUser) {
      /* Create new user if doesn't exist */
      req.wasLogin = false;
      return signup(magicUser, userMetadata, done);
    } else {
      /* Login user if otherwise */
      req.wasLogin = true;
      return login(magicUser, existingUser, done);
    }
  },
  { passReqToCallback: true }
);

passport.use(strategy);

/* 3️⃣ Implement Auth Behaviors */

/* Implement User Signup */
const signup = async (
  user: MagicUser,
  userMetadata: MagicUserMetadata,
  done: DoneFunc
) => {
  console.log("signup");
  let newUser = {
    issuer: user.issuer,
    email: userMetadata.email,
    lastLogin: user.claim.iat,
  };
  const userModel = DI.userRepository.create(newUser);
  await DI.userRepository.persistAndFlush(userModel);
  return done(null, newUser);
};

/* Implement User Login */
const login = async (
  magicUser: MagicUser,
  existingUser: User,
  done: DoneFunc
) => {
  console.log("login");
  /* Replay attack protection (https://go.magic.link/replay-attack) */
  if (magicUser.claim.iat <= existingUser.lastLogin) {
    return done(null, false, {
      message: `Replay attack detected for user ${magicUser.issuer}}.`,
    });
  }
  wrap(existingUser).assign({
    lastLoginAt: magicUser.claim.iat,
  });
  await DI.userRepository.persistAndFlush(existingUser);
  return done(null, magicUser);
};

/* 4️⃣ Implement Session Behavior */

/* Defines what data are stored in the user session */
passport.serializeUser((user, done) => {
  done(null, user.issuer);
});

/* Populates user data in the req.user object */
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await DI.userRepository.findOne({ issuer: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export const passAuth = passport;
