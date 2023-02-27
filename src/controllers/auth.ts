import User from "../models/user_model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
function sendError(res: Response, error: string) {
  res.status(400).send({
    err: error,
  });
}
//FIXME:authHeader return JWT undefind
function getTokenFromRequest(req: Request): string {
  const authHeader = req.headers["authorization"];
  if (authHeader == undefined) return undefined;
  return authHeader.split(" ")[1];
}

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return sendError(res, "The email or password are empty please fill");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user != null) {
      return sendError(
        res,
        "This email already in use go to login or try another one"
      );
    }
  } catch (err) {
    console.log("error: " + err);
    return sendError(res, "email check failed");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encPass = await bcrypt.hash(password, salt);
    let newUser = new User({
      email: email,
      password: encPass,
    });
    newUser = await newUser.save();
    res.status(200).send(newUser); //TODO: change implementation
  } catch (err) {
    sendError(res, "faild");
  }
};
const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return sendError(res, "The email or password are empty please fill");
  }
  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return sendError(res, "incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, "incorrect email or password");
    }

    const accessToken = await jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );
    const refreshToken = await jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    if (user.refresh_tokens == null) user.refresh_tokens = [refreshToken];
    else user.refresh_tokens.push(refreshToken);
    await user.save();

    return res.status(200).send({
      accesstoken: accessToken,
      refreshtoken: refreshToken,
    });
  } catch (err) {
    console.log("error: " + err);
    return sendError(res, "email check failed");
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = getTokenFromRequest(req);
  if (refreshToken == undefined) return sendError(res, "authentication missing")

  try {
    const user = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const userObj = await User.findById({ id: user["_id"] });
    if (userObj == null) return sendError(res, "fail validating token")

    if (!userObj.refresh_tokens.includes(refreshToken)) {
      userObj.refresh_tokens = [];
      await userObj.save();
      return sendError(res, "fail validating token");
    }

    const newAccessToken = await jwt.sign(
      { id: user["_id"] },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    )

    const newRefreshToken = await jwt.sign(
      { id: user["_id"] },
      process.env.REFRESH_TOKEN_SECRET
    )

    userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)];
    await userObj.save();

    return res.status(200).send({
      accesstoken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return sendError(res, "fail validating token");
  }
};
//BUG:authorization headers return JWT undifiend insted JWT only
const logout = async (req: Request, res: Response) => {
  const authHeaders = req.headers['authorization'];
  const refreshToken = authHeaders && authHeaders.split(' ')[1];
  if (refreshToken == null) return sendError(res, "authentication missing")
  try {
    const user = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const userObj = await User.findById({ id: user["id"] })
    if (userObj == null) return sendError(res, "fail validating token")

    if (!userObj.refresh_tokens.includes(refreshToken)) {
      userObj.refresh_tokens = []
      await userObj.save()
      return sendError(res, "fail validating token")
    }
    userObj.refresh_tokens.slice(
      userObj.refresh_tokens.indexOf(refreshToken),
      1
    )
    await userObj.save()
    res.status(200).send()
  } catch (err) {
    return sendError(res, "fail validating token")
  }
};

//FIXME:use function
const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"]
  const token = authHeaders && authHeaders.split(" ")[1]
  if (token == null) return sendError(res, "authentication missing")
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.body.userId = user["_id"]
    console.log("token user: " + user)
    next();
  } catch (err) {
    return sendError(res, "fail validating token")
  }
};

export = { login, refresh, register, logout, authenticateMiddleware }
