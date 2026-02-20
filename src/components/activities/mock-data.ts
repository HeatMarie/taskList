import type { Activity, Process } from "./types"

export const MOCK_PROCESSES: Process[] = [
  { Process_ID: 1, Process_Name: "Winterize", Process_Description: "Full property winterization checklist" },
  { Process_ID: 2, Process_Name: "Dewinterize", Process_Description: "Spring startup and inspection" },
  { Process_ID: 3, Process_Name: "Heather's Process", Process_Description: "Custom deep-clean protocol" },
]

export const MOCK_ACTIVITIES: Activity[] = [
  {
    Activity_ID: 1,
    Activity_Name: "Drain all water supply lines",
    Activity_Description: "Fully drain all supply lines to prevent freeze damage.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 1, Process_ID: 1, Process_Name: "Winterize", Room_ID: 1, Room_Name: "Utility Room", Process_Order: 1, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 2,
    Activity_Name: "Add RV antifreeze to all drain traps",
    Activity_Description: "Use non-toxic antifreeze rated to -50°F.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 2, Process_ID: 1, Process_Name: "Winterize", Room_ID: 2, Room_Name: "Bathrooms", Process_Order: 2, Status_Name: "Active" },
      { Process_Activity_ID: 8, Process_ID: 3, Process_Name: "Heather's Process", Room_ID: 2, Room_Name: "Bathrooms", Process_Order: 1, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 3,
    Activity_Name: "Shut off main water valve",
    Activity_Description: "Locate and fully shut off the primary water supply.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 3, Process_ID: 1, Process_Name: "Winterize", Room_ID: 1, Room_Name: "Utility Room", Process_Order: 3, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 4,
    Activity_Name: "Flush all water lines until clear",
    Activity_Description: "Run each fixture for at least 2 minutes.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 4, Process_ID: 2, Process_Name: "Dewinterize", Room_ID: 2, Room_Name: "Bathrooms", Process_Order: 1, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 5,
    Activity_Name: "Check all fixtures for leaks",
    Activity_Description: "Inspect every connection point after water restored.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 5, Process_ID: 2, Process_Name: "Dewinterize", Room_ID: 2, Room_Name: "Bathrooms", Process_Order: 2, Status_Name: "Active" },
      { Process_Activity_ID: 9, Process_ID: 3, Process_Name: "Heather's Process", Room_ID: 2, Room_Name: "Bathrooms", Process_Order: 2, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 6,
    Activity_Name: "Shut down HVAC system",
    Activity_Description: undefined,
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 6, Process_ID: 1, Process_Name: "Winterize", Room_ID: 3, Room_Name: "Mechanical Room", Process_Order: 4, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 7,
    Activity_Name: "Inspect for water damage or mold",
    Activity_Description: "Document any issues found with photos.",
    Status_ID: 1,
    Status_Name: "Active",
    ProcessLinks: [
      { Process_Activity_ID: 7, Process_ID: 2, Process_Name: "Dewinterize", Room_ID: 4, Room_Name: "All Rooms", Process_Order: 5, Status_Name: "Active" },
      { Process_Activity_ID: 10, Process_ID: 3, Process_Name: "Heather's Process", Room_ID: 4, Room_Name: "All Rooms", Process_Order: 3, Status_Name: "Active" },
    ],
  },
  {
    Activity_ID: 8,
    Activity_Name: "Deep clean all surfaces",
    Activity_Description: "Wipe down all hard surfaces with approved cleaner.",
    Status_ID: 2,
    Status_Name: "Inactive",
    ProcessLinks: [
      { Process_Activity_ID: 11, Process_ID: 3, Process_Name: "Heather's Process", Room_ID: 5, Room_Name: "Kitchen", Process_Order: 1, Status_Name: "Active" },
    ],
  },
]
