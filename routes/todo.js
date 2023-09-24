import { Router } from "express";
import { todo } from "../models/index.js";
import { verifyToken } from "../middleware/index.js";
import { ObjectId } from "mongodb";

export const todoRouter = Router();
todoRouter.post("/todo", verifyToken, async (req, res) => {
  try {
    const { title, description, time } = req.body;

    if (!title || !description) {
      return res.sendStatus(400).send({
        message: "Title and Description are required",
        success: false,
      });
    }
    let response = await todo.create({
      title,
      description,
      time,
      user: new ObjectId(req.userId),
    });
    res.json(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(404).json({
      error: err.message,
      success: false,
    });
  }
});

todoRouter.get("/todo/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let userTodo = await todo.find({ user: new ObjectId(id) });
    if (userTodo.length === 0) {
      return res.status(404).send({
        error: "Todo not found for the specified user ID.",
        success: false,
      });
    }
    res.send({
      data: userTodo,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404).send({
      error: err.message,
      success: false,
    });
  }
});
todoRouter.delete("/todo/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let userTodo = await todo.deleteOne({ _id: new ObjectId(id) });
    if (userTodo.deletedCount < 1) {
      return res.send({
        message: "No document found with given id.",
      });
    }
    res.send({
      message: "deleted Successfuly",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404).send({
      error: err.message,
      success: false,
    });
  }
});
todoRouter.put("/todo/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let userTodo = await todo.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          time: req.body.time,
        },
      }
    );
    if (userTodo.modifiedCount >= 1) {
      return res.send({
        message: "Updated successfully!",
        success: true,
      });
    }
    res.sendStatus(404).send({
      message: "Nothing to update",
      success: false,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(404).send({
      error: err.message,
      success: false,
    });
  }
});
