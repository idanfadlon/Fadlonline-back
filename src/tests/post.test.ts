import request from "supertest"
import app from "../server"
import mongoose from "mongoose"
import Post from "../models/post_model"
import User from "../models/user_model"

const newPostMessage = "This is the new test post message"
let newPostSender = ""
let newPostId = ""
const nonExistentsender = "idan"
const updatedPostMessage = "This is the updated post message"

const userEmail = "user1@gmail.com"
const userPassword = "12345"
let accessToken = ""

beforeAll(async () => {
  await Post.remove()
  await User.remove()
  const response = await request(app).post('/auth/register').send({
    "email": userEmail,
    "password":userPassword
  })
  newPostSender = response.body._id
});

async function loginUser() {
  const response = await request(app).post('/auth/login').send({
      "email": userEmail,
      "password": userPassword 
  })
  accessToken = response.body.accesstoken
}

beforeEach(async ()=>{
  await loginUser()
})

afterAll(async () => {
  await Post.remove()
  mongoose.connection.close()
});

describe("Posts Tests", () => {
  test("add new post", async () => {
    const response = await request(app).post("/post").set("Authorization", "JWT " + accessToken).send({
      message: newPostMessage,
      sender: newPostSender
    })
    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual(newPostMessage)
    expect(response.body.sender).toEqual(newPostSender)
    newPostId = response.body._id
  });

  test("get all posts", async () => {
    const response = await request(app).get("/post").set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body[0].message).toEqual(newPostMessage)
    expect(response.body[0].sender).toEqual(newPostSender)
  });

  test("get post by Id", async () => {
    const response = await request(app).get("/post/" + newPostId).set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual(newPostMessage)
    expect(response.body.sender).toEqual(newPostSender)
  });

  //negative test
  test("get post by non existent Id failed", async () => {
    const response = await request(app).get("/post/999999").set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(400)
  });

  test("get post by Sender", async () => {
    const response = await request(app).get("/post?sender=" + newPostSender).set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
    const recvpostmessage = response.body[0].message
    const recvpostsender = response.body[0].sender
    const recvpostid = response.body[0]._id
    expect(recvpostmessage).toEqual(newPostMessage)
    expect(recvpostsender).toEqual(newPostSender)
    expect(recvpostid).toEqual(newPostId)
  });

  //negative test
  test("get post by non existent Sender failed get data", async () => {
    const response = await request(app).get("/post?sender=" + nonExistentsender).set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.length).toEqual(0)
  });

  test("update post by Id", async () => {
    let response = await request(app).put("/post/" + newPostId).set("Authorization", "JWT " + accessToken).send({
        message: updatedPostMessage,
        sender: newPostSender,
      })
    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual(updatedPostMessage)
    expect(response.body.sender).toEqual(newPostSender)

    response = await request(app).get("/post/" + newPostId).set("Authorization", "JWT " + accessToken)
    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual(updatedPostMessage)
    expect(response.body.sender).toEqual(newPostSender)

    //negative test
    response = await request(app).put("/post/999999").set("Authorization", "JWT " + accessToken).send({
      message: updatedPostMessage,
      sender: newPostSender,
    })
    expect(response.statusCode).toEqual(400);

    response = await request(app).put("/post/" + newPostId).set("Authorization", "JWT " + accessToken).send({
        message: updatedPostMessage,
      })
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual(updatedPostMessage);
    expect(response.body.sender).toEqual(newPostSender);
  });
});
