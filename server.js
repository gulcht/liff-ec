// const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
const port = 8888;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

app.use(express.json());

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
};

const sendMessage = async (userUid, message) => {
  const body = {
    to: userUid,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };
  const response = await axios.post(LINE_API_URL, body, { headers });
  return response;
};

app.post("/send-message", async (req, res) => {
  const { userUid, message } = req.body;

  // ตรวจสอบว่า message ไม่เป็นค่าว่าง
  if (!message || message.trim() === "") {
    return res.status(400).json({
      error: "Message cannot be empty",
    });
  }

  try {
    const response = await sendMessage(userUid, message);
    console.log("=== LINE log", response.data);
    res.json({
      message: "Message OK",
    });
  } catch (error) {
    const errorMessage = error.response ? error.response.data : error.message;
    console.log("error", errorMessage);
    res.status(400).json({
      error: errorMessage,
    });
  }
});

app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});