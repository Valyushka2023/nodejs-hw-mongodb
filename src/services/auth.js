
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { randomBytes } from "crypto";
import SessionCollection from "../db/models/Session.js";
import { UsersCollection } from "../db/models/User.js";
import { accessTokenLifetime, refreshTokenLifetime } from "../constants/users.js";
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


const TEMPLATES_DIR = path.resolve('src/templates');

const createSession = () => {
  const accessToken = randomBytes(30).toString("hex");
  const refreshToken = randomBytes(30).toString("hex");
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(401, "Email or password invalid");

  await SessionCollection.deleteOne({ userId: user._id });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, "Email or password invalid");

  const sessionData = createSession();
  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) => SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) throw createHttpError(401, "Session not found");

  if (new Date() > oldSession.refreshTokenValidUntil) throw createHttpError(401, "Session token expired");

  const sessionData = createSession();
  const updatedSession = await SessionCollection.findByIdAndUpdate(
    sessionId,
    { ...sessionData },
    { new: true }
  );
  return updatedSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => UsersCollection.findOne(filter);

export const requestResetToken = async (email) => {
  try {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      { sub: user._id, email },
      env('JWT_SECRET'),
      { expiresIn: '15m' },
    );

    const resetPasswordTemplatePath = path.join(
      TEMPLATES_DIR,
      'reset-password-email.html',
    );

    const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();
    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.name,
      link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });


    console.log('Sending email to:', email, 'with reset link:', `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`);

    await sendEmail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html,
    });


    console.log('Reset password email sent successfully to:', email);

  } catch (error) {

    console.error('Error sending reset password email:', error);


    throw createHttpError(500, "Error sending reset password email");
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
