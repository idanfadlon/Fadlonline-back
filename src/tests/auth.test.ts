import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";

const userEmail = "user1@gmail.com";
const userPassword = "12345";
let accessToken = "";
let refreshToken = "";

beforeAll(async () => {
  await Post.remove();
  await User.remove();
});

afterAll(async () => {
  await Post.remove();
  await User.remove();
  mongoose.connection.close();
});

describe("Auth Tests", () => {
  test("Not authorized test", async () => {
    const response = await request(app).get("/ppst");
    expect(response.statusCode).not.toEqual(200);
  });

  test("Register test", async () => {
    const response = await request(app).post("/auth/register").send({
      email: userEmail,
      password: userPassword,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("Login test", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword,
    });
    expect(response.statusCode).toEqual(200);
    accessToken = response.body.accesstoken;
    expect(accessToken).not.toBeNull();
    refreshToken = response.body.refreshtoken;
    expect(refreshToken).not.toBeNull();
  });

  test("Worng password login test", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userEmail,
      password: userPassword+'6',
    });
    expect(response.statusCode).not.toEqual(200);
    const uAccessToken = response.body.accesstoken
    expect(uAccessToken).toBeUndefined()
  });


  test("Sing valid token test", async () => {
    const response = await request(app).get("/post").set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
  });

  test("Sing worng token test", async () => {
    const response = await request(app).get("/post").set("Authorization", "JWT 1" + accessToken)
    expect(response.statusCode).not.toEqual(200)
  });

  jest.setTimeout(30000);
  test("Token timeout test", async () => {
    await new Promise((r) => setTimeout(r, 20000))
    const response = await request(app).get("/post").set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).not.toEqual(200)
  });

  test("Refresh token test", async () => {
    let response = await request(app).get("/auth/refresh").set("Authorization", "JWT " + refreshToken)
    expect(response.statusCode).toEqual(200)
    const newAccessToken = response.body.accesstoken
    expect(newAccessToken).not.toBeNull();
    const newRefreshToken = response.body.refreshToken
    expect(newRefreshToken).not.toBeNull()

    response = await request(app).get("/post").set("Authorization", "JWT " + newAccessToken)
    expect(response.statusCode).toEqual(200)
  });

test("Logout test",async ()=>{
  const response = await request(app).get('/auth/logout').set('Authorization', 'JWT ' + refreshToken)
  expect(response.statusCode).toEqual(200)
}) 

});
