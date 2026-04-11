# NASS Branch Document Workflow Tracker — User Manual

**Version:** 1.0  
**Date:** April 2026  
**Classification:** RESTRICTED — For Authorised Personnel Only

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Accessing the Application](#2-accessing-the-application)
3. [Logging In](#3-logging-in)
4. [Application Layout](#4-application-layout)
5. [Dashboard Statistics](#5-dashboard-statistics)
6. [The Document Register](#6-the-document-register)
7. [Adding a New Record](#7-adding-a-new-record)
8. [Viewing a Record](#8-viewing-a-record)
9. [Editing a Record](#9-editing-a-record)
10. [Deleting a Record](#10-deleting-a-record)
11. [Searching and Filtering](#11-searching-and-filtering)
12. [Sorting the Table](#12-sorting-the-table)
13. [Exporting to CSV](#13-exporting-to-csv)
14. [Admin Panel](#14-admin-panel)
15. [Real-Time Collaboration](#15-real-time-collaboration)
16. [Logging Out](#16-logging-out)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Introduction

The **NASS Branch Document Workflow Tracker** is a secure, web-based application for the Naval Safety and Standards Branch at Naval Headquarters. It provides a centralised register to track the movement, status, and action history of branch documents and correspondence.

**Key capabilities:**
- Maintain a live register of all branch documents and actions
- Track current location, responsible officer, SLA, and due dates
- Filter and search records instantly
- Collaborate in real time — changes made by one user are immediately visible to all other logged-in users
- Export the full register to CSV for reporting

---

## 2. Accessing the Application

Open a web browser and navigate to the address provided by your system administrator (e.g. `http://localhost:54492` for local use, or the hosted URL if deployed online).

**Supported browsers:** Google Chrome, Microsoft Edge, Mozilla Firefox, Safari (current versions).

---

## 3. Logging In

When the application loads you will see the login screen.

1. Enter your **Email Address** in the first field
2. Enter your **Password** in the second field
3. Click **Sign In**

If your credentials are correct, the application will load the main tracker. If incorrect, an error message will appear below the fields — check your email and password and try again.

> Access is restricted to authorised NASS Branch personnel only. Contact your administrator if you do not have an account.

---

## 4. Application Layout

After login the screen is divided into the following areas:

```
┌──────────────────────────────────────────────────────────────┐
│  TOPBAR — Logo | Tracker tab | Admin tab | User email | Logout│
├──────────────────────────────────────────────────────────────┤
│  STATISTICS BAR — Total | Active | Completed | Overdue | Hold │
├──────────────────────────────────────────────────────────────┤
│  TOOLBAR — Search | Filters | Add Record | Export CSV         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  DOCUMENT REGISTER TABLE                                     │
│                                                              │
│  S/N | File Ref | Subject | Location | Officer | Action |    │
│       Date Rcvd | Date Moved | SLA | Due Date | Status |     │
│       Delay Flag | Remarks | [View] [Edit] [✕]               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Topbar tabs:**
- **Tracker** — the main document register (default view)
- **Admin** — manage dropdown lists (officers, locations, etc.)

---

## 5. Dashboard Statistics

The statistics bar at the top shows a live count of records:

| Tile | Meaning |
|---|---|
| **Total** | All records in the register |
| **Active** | Records with status = Active |
| **Completed** | Records with status = Completed |
| **Overdue** | Records where the Delay Flag = OVERDUE |
| **On Hold** | Records with status = On Hold |

These counts update automatically whenever records are added, edited, or deleted.

---

## 6. The Document Register

The main table displays all tracked documents. Each row represents one record with the following columns:

| Column | Description |
|---|---|
| **S/N** | Serial number — automatically assigned based on current view order |
| **File Ref No.** | The NHQ file reference number or signal DTG |
| **Subject / Description** | Brief description of the document or action item |
| **Current Location** | Where the document physically is right now |
| **Action Officer** | The officer responsible for the next action |
| **Last Action** | The most recent action taken on the document |
| **Date Received** | Date the document was received by the branch |
| **Date Moved** | Date the document was last moved |
| **SLA** | Service Level Agreement — number of days allowed to action |
| **Due Date** | Deadline date calculated from SLA |
| **Status** | Current workflow status (Active / Completed / On Hold / Cancelled / Filed) |
| **Delay Flag** | ON TIME (green) or OVERDUE (red) |
| **Remarks** | Additional notes or action instructions |

The last column contains three action buttons: **View**, **Edit**, and **✕** (Delete).

> **Tip:** Click on the **Subject / Description** cell of any row to open the full detail view for that record.

---

## 7. Adding a New Record

1. Click the **+ Add Record** button in the toolbar
2. The **Add New Record** form will open
3. Fill in the fields:
   - **File Ref No.** — type or select from the autocomplete list
   - **Subject / Description** — enter the document title or action description
   - **Current Location** — select from the dropdown
   - **Action Officer** — select the responsible officer
   - **Last Action** — select the most recent action
   - **Date Received** — pick a date (defaults to today)
   - **Date Moved** — pick the date the document was moved
   - **SLA (Days)** — enter the number of days allowed
   - **Due Date** — enter or calculate the deadline
   - **Status** — select the workflow status (defaults to Active)
   - **Delay Flag** — select ON TIME or OVERDUE (defaults to ON TIME)
   - **Remarks** — any additional notes
4. Click **Save**

The record will appear at the bottom of the register and the serial number will be assigned automatically. All connected users will see the new record immediately.

> **Note:** The Serial No. field is not shown — it is assigned automatically and cannot be manually set.

---

## 8. Viewing a Record

To open a read-only summary of a record:

- Click the **View** button on the row, **or**
- Click directly on the **Subject / Description** cell

The detail panel shows all fields for that record including status badges and delay flag. Click **Close** (or outside the panel) to dismiss it.

---

## 9. Editing a Record

1. Click the **Edit** button on the row
2. The record form opens with all fields populated and immediately editable
3. Make the required changes
4. Click **Save**

Changes are saved to the database instantly and all other users will see the updated record.

> You can also open the detail view first (View button) and then click **Edit** from there.

---

## 10. Deleting a Record

1. Click the **✕** button on the row you wish to delete
2. A confirmation prompt will appear — click **OK** to confirm or **Cancel** to abort
3. The record is permanently removed from the register

> **Warning:** Deletion is permanent and cannot be undone. Ensure you have the correct record selected before confirming.

---

## 11. Searching and Filtering

### Text Search

Type in the **Search** box to instantly filter the table. The search checks the following fields simultaneously:
- File Ref No.
- Subject / Description
- Current Location
- Action Officer
- Remarks

The table updates as you type. The serial numbers re-number to reflect the filtered view.

### Dropdown Filters

Use the filter dropdowns to narrow the view by:

| Filter | Options |
|---|---|
| **Status** | Active / Completed / On Hold / Cancelled / Filed |
| **Officer** | Any officer in the register |
| **Delay Flag** | ON TIME / OVERDUE |

Multiple filters can be active at the same time. The record count below the toolbar shows how many records match the current filters.

### Clearing Filters

Click the **Clear** button to reset all search and filter fields and display all records.

---

## 12. Sorting the Table

Click any **column header** to sort the table by that column in ascending order. Click the same header again to reverse to descending order. An arrow indicator (↑ or ↓) shows the active sort column and direction.

> Serial numbers always reflect the current sorted/filtered view — record 1 is always the first visible row.

---

## 13. Exporting to CSV

Click the **Export CSV** button in the toolbar to download the full register as a comma-separated values (CSV) file.

- The file is named `NASS_Branch_WorkflowTracker_2026.csv`
- It includes all records (not just the current filtered view)
- It can be opened in Microsoft Excel or any spreadsheet application

---

## 14. Admin Panel

The Admin Panel allows authorised users to manage the dropdown options used throughout the application. Click the **Admin** tab in the topbar to access it.

### Managed Lists

| List | Used In |
|---|---|
| **Officers** | Action Officer field |
| **File Index** | File Ref No. autocomplete |
| **Statuses** | Status field |
| **Locations** | Current Location field |
| **Actions** | Last Action field |

### Adding a New Option

1. Click the **+ Add** button next to the relevant list
2. Type the new value in the input box that appears
3. Click **Save** (or press Enter)

The new option will immediately appear in the relevant dropdown across the application.

### Removing an Option

Click the **×** button on any existing tag to remove it. A confirmation prompt will appear before the item is deleted.

> Removing an option from a list does not affect existing records that already use that value — it only removes it from the dropdown for future entries.

---

## 15. Real-Time Collaboration

The application supports multiple users working simultaneously. When one user makes a change (adds, edits, or deletes a record), all other users who are currently logged in will see the updated register automatically — no page reload required.

**Behaviour when a modal is open:**
If you are in the middle of editing or viewing a record when another user makes a change, your form will not be interrupted. The table will refresh silently in the background and display the latest state once you close your modal.

---

## 16. Logging Out

Click the **Logout** button in the top-right corner of the topbar. You will be signed out and returned to the login screen. Your session is securely terminated.

> Always log out when leaving an unattended workstation to prevent unauthorised access.

---

## 17. Troubleshooting

| Problem | Likely Cause | Solution |
|---|---|---|
| App stuck on loading screen | Network issue or Supabase connection failure | Check internet connection and refresh the page |
| Login error: "Invalid credentials" | Wrong email or password | Re-enter credentials; contact admin if forgotten |
| Changes not visible to other users | Broadcast channel disconnected | Refresh the browser; changes will resync on next save |
| Table shows old data after logging back in | localStorage cached stale data | Log out, clear browser cache, and log in again |
| Export file not downloading | Browser blocking downloads | Check browser download permissions / pop-up blocker |
| Dropdown option missing | Option was removed from Admin panel | Go to Admin tab and re-add the required option |
| Serial numbers appear out of order | Active sort or filter applied | Clear filters to restore natural order |

---

*This document is produced for internal use by the Naval Safety and Standards Branch, Naval Headquarters. Unauthorised distribution is prohibited.*
