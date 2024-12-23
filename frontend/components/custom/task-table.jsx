import React, { useState } from "react";

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

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import TaskEditForm from "@/components/ui/task-edit-form";

export const columns = [
  { name: "ASSIGNED TO", uid: "assignedTo" },
  { name: "TASK TITLE", uid: "title" },
  { name: "STATUS", uid: "status" },
  { name: "LAST UPDATED", uid: "updatedAt" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  TO_DO: "warning",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
};

export const EyeIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const DeleteIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

const TaskTable = ({ tasks, table }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalContent, setModalContent] = useState("details");

  const handleShowDetails = (task) => {
    setSelectedTask(task);
    setModalContent("view");
    onOpen();
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalContent("edit");
    onOpen();
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setModalContent("delete");
    onOpen();
  };

  const handleDeleteEndpoint = (task) => {
    fetch(`http://localhost:8080/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task deleted successfully");
          onOpenChange(); // Close the modal
          window.location.reload();
        } else {
          console.error("Failed to delete task");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveTask = (task) => {
    onOpenChange();
    window.location.reload();
  };

  console.log(tasks); // comment out later

  const renderCell = React.useCallback((task, columnKey) => {
    const cellValue = task[columnKey];

    switch (columnKey) {
      case "title":
        return task.title;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[task.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "assignedTo":
        return (
          <div className="flex text-center">
            <User
              avatarProps={{ radius: "lg", src: `https://i.pravatar.cc/150?u=${task.assignedToId}` }}
              name={cellValue}
            ></User>
            <div className="pt-3">{task.actualUsername}</div>
          </div>
        );
      case "updatedAt":
        return task.updatedAt
          ? new Date(task.updatedAt).toLocaleString()
          : "Not Updated";
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon onClick={() => handleShowDetails(task)} />
              </span>
            </Tooltip>
            {table !== "reportingTask" && (
              <>
                <Tooltip content="Edit Task">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon onClick={() => handleEditTask(task)} />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete Task">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon onClick={() => handleDeleteTask(task)} />
                  </span>
                </Tooltip>
              </>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const renderModalContent = () => {
    switch (modalContent) {
      case "view":
        return (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Task Details
            </ModalHeader>
            <ModalBody>
              {selectedTask && (
                <div>
                  <p>
                    <strong>ID:</strong> {selectedTask.id}
                  </p>
                  <p>
                    <strong>Title:</strong> {selectedTask.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTask.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedTask.status}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {selectedTask.actualUsername}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {selectedTask.updatedAt
                      ? new Date(selectedTask.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onOpenChange}>
                Close
              </Button>
            </ModalFooter>
          </>
        );
      case "edit":
        return (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Task</ModalHeader>
            <ModalBody>
              {selectedTask && (
                <TaskEditForm
                  task={selectedTask}
                  onSave={() => handleSaveTask(selectedTask)}
                  onCancel={onOpenChange}
                />
              )}
            </ModalBody>
          </>
        );
      case "delete":
        return (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Task
            </ModalHeader>
            <ModalBody>
              {selectedTask && (
                <div>
                  <p>
                    Are you sure you want to delete the task with ID:{" "}
                    {selectedTask.id}?
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onPress={onOpenChange}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  handleDeleteEndpoint(selectedTask);
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              // align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tasks}>
          {(task) => (
            <TableRow key={task.id}>
              {(columnKey) => (
                <TableCell>{renderCell(task, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-[999]">
        <ModalContent>{renderModalContent()}</ModalContent>
      </Modal>
    </>
  );
};

export default TaskTable;
