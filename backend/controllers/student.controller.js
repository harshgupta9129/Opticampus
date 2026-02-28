import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import Issues from "../models/Issues.js";
import User from "../models/User.js";

export const createEvent = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { userId } = decoded;

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      expectedParticipants,
      purpose,
    } = req.body;

    console.log("Hello world");

    console.log(req.body);

    // basic validation
    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !expectedParticipants ||
      !purpose
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const event = await Event.create({
      studentId: userId,
      title,
      description,
      date,
      startTime,
      endTime,
      expectedParticipants,
      purpose,
      status: "Pending",
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

export const getEventsByStudentId = async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY,
    );

    const events = await Event.find({ studentId: userId });

    // console.log("Hello");

    if (!events.length) {
      return res.status(200).json({
        events: [],
        message: "No events found for this student",
      });
    }

    res.status(200).json({
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export const getIssuByStudentId = async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY,
    );

    const issues = await Issues.find({ studentId: userId });

    if (!issues.length) {
      return res.status(200).json({
        issues: [],
        message: "No events found for this student",
      });
    }

    res.status(200).json({
      issues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching issues",
      error: error.message,
    });
  }
};

export const createIssue = async (req, res) => {
  try {
    const token = req.cookies.token;

    console.log(req.cookies);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { userId } = decoded;

    const { description, issueType } = req.body;

    console.log("Hello world");
    console.log(req.body);

    const request = await Issues.create({
      studentId: userId,
      description,
      issueType,
      status: "Pending",
    });

    res.status(201).json({
      message: "Issue created successfully",
      request,
    });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({
      message: "Error creating Issue",
      error: error.message,
    });
  }
};

export const getGreenPoints = async (req, res) => {
  try {
    const token = req.cookies.token;

    // console.log(req.cookies);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { userId } = decoded;

    console.log("Hello world");

    const user = await User.findById(userId);
    const greenPoint = user.greenPoint;

    console.log(greenPoint);

    res.status(201).json({
      greenPoint,
    });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({
      message: "Error creating Gree Point",
      error: error.message,
    });
  }
};
