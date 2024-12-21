"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";

export const columns = [
  { name: "TO-DO", uid: "name" },
  { name: "IN PROGRESS", uid: "role" },
  { name: "DONE", uid: "status" },
];

const KanbanBoard = () => {
  const [data, setData] = useState({
    tasks: {},
    columns: {
      "column-1": { id: "column-1", title: "To do", taskIds: [] },
      "column-2": { id: "column-2", title: "In-progress", taskIds: [] },
      "column-3": { id: "column-3", title: "Done", taskIds: [] },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasks = response.data;
      const newTasks = {};
      const toDoTaskIds = [];
      const inProgressTaskIds = [];
      const completedTaskIds = [];

      tasks.forEach((task) => {
        if (task.assignedToId == localStorage.getItem("userid")) {
          newTasks[task.id] = { id: task.id.toString(), content: task.title };
          if (task.status === "TO_DO") {
            toDoTaskIds.push(task.id.toString());
          } else if (task.status === "IN_PROGRESS") {
            inProgressTaskIds.push(task.id.toString());
          } else if (task.status === "COMPLETED") {
            completedTaskIds.push(task.id.toString());
          }
        }
      });

      const newData = {
        tasks: newTasks,
        columns: {
          "column-1": {
            ...data.columns["column-1"],
            taskIds: toDoTaskIds,
          },
          "column-2": {
            ...data.columns["column-2"],
            taskIds: inProgressTaskIds,
          },
          "column-3": {
            ...data.columns["column-3"],
            taskIds: completedTaskIds,
          },
        },
        columnOrder: data.columnOrder,
      };

      setData(newData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);

    // Update the task status in the backend
    const statusMap = {
      "column-1": "TO_DO",
      "column-2": "IN_PROGRESS",
      "column-3": "COMPLETED",
    };

    const newStatus = statusMap[destination.droppableId];
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `http://localhost:8080/tasks/${draggableId}/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: localStorage.getItem("userid"),
          },
        }
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pb-4 overflow-x-auto bg-background dark:bg-[#17171a] justify-center rounded-lg">
          <div className="justify-center pt-4 pb-4  bg-[#27272a]">
          <div className="flex justify-between">
            <div className="w-1/3 text-center">
              <h3 className="text-lg font-bold">To-Do</h3>
            </div>
            <div className="w-1/3 text-center">
              <h3 className="text-lg font-bold">In Progress</h3>
            </div>
            <div className="w-1/3 text-center">
              <h3 className="text-lg font-bold">Completed</h3>
            </div>
          </div>
          </div>
          <div className="flex gap-6 pt-4 justify-center ">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    className="bg-inherit dark:bg-[#171717a] rounded-lg p-4 w-72 flex flex-col"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* <h2 className="text-xl mb-4 text-background dark:text-background text-center">
                      {column.title}
                    </h2> */}
                    <div className="space-y-2 overflow-y-auto max-h-96">
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="p-2 bg-inherit dark:bg-[#27272a] rounded shadow"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span className="text-foreground dark:text-foreground">
                                {task.content}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
          </div>
          
        </div>
      </DragDropContext>
    </>
  );
};

export default KanbanBoard;
