"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "@/components/PieChart/PieChart";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [task, setTasks] = useState([]);
  const [assignedCount, setAssignedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [reportedCount, setReportedCount] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(
          "http://localhost:8080/user/get-profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function fetchOrganization() {
      try {
        const response = await axios.get(
          `http://localhost:8080/organizations/${localStorage.getItem(
            "organizationId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrganizationName(response.data.name);
      } catch (error) {
        console.error("Error fetching organizations: ", error);
      }
    }

    async function fetchTasks() {
      try {
        const response = await axios.get(`http://localhost:8080/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const allTasks = response.data;
        setTasks(allTasks);

        const userId = Number(localStorage.getItem("userid"));

        setAssignedCount(
          allTasks.filter((t: any) => t.assignedToId === userId).length
        );
        setCreatedCount(
          allTasks.filter((t: any) => t.createdById === userId).length
        );
        setReportedCount(
          allTasks.filter((t: any) => t.reporteeId === userId).length
        );
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    }

    fetchProfile();
    fetchOrganization();
    fetchTasks();
  }, []);

  console.log(profile);
  console.log(task);

  return (
    task &&
    profile && (
      <div className="p-6 min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-white overflow-hidden shadow-lg">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-1 right-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="max-w-md w-full bg-white rounded-lg  shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-700 mb-2">
              {profile.user.actualUsername}
            </h1>
            <p className="text-gray-500 mb-4">Member at {organizationName}</p>
            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 21v-2a4 4 0 00-3-3.87L12.9 15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M6 21v-2c0-1.104.895-2 2-2h8a2 2 0 012 2v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></circle>
                </svg>
                <span>Location: San Francisco, CA</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 4h16v16H4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M16 2v4M8 2v4M4 10h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span>Joined: January 2023</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span>Projects: 15</span>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-all">
              Edit Profile
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-2 text-center">
              Task Status
            </h2>
            <PieChart
              data={[
                { label: "Assigned", value: assignedCount, color: "#3B82F6" }, // Blue
                { label: "Created", value: createdCount, color: "#2563EB" }, // Darker Blue
                { label: "Reporting", value: reportedCount, color: "#93C5FD" }, // Lighter Blue
              ]}
              className="z-[9999]"
            />
          </div>
        </div>
      </div>
    )
  );
}
