export const mockIssues = [
    {
        id: 1,
        title: "Authentication fails on mobile devices",
        description: "Users on iOS 16 cannot log in via the main popup.",
        status: "open",
        priority: "urgent",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        assignee: { id: 101, name: "Alex Chen" },
        comments: [{}, {}], // Mock length 2
        labels: [{ name: "bug" }, { name: "urgent" }]
    },
    {
        id: 2,
        title: "Add dark mode support",
        description: "Implement dark theme across dashboard and settings.",
        status: "in_progress",
        priority: "high",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        assignee: { id: 102, name: "Mike Johnson" },
        comments: [{}],
        labels: [{ name: "feature" }, { name: "enhancement" }]
    },
    {
        id: 3,
        title: "Update API documentation for v2",
        description: "Swagger docs are outdated for the /issues endpoint.",
        status: "open",
        priority: "medium",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        assignee: { id: 103, name: "Emily Davis" },
        comments: [],
        labels: [{ name: "documentation" }]
    },
    {
        id: 4,
        title: "Performance degradation on large datasets",
        description: "Query takes >2s when rows > 10000.",
        status: "closed",
        priority: "high",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        assignee: { id: 101, name: "Alex Chen" },
        comments: [{}, {}, {}],
        labels: [{ name: "bug" }, { name: "enhancement" }]
    },
    {
        id: 5,
        title: "Add export to PDF functionality",
        description: "Allow exporting reports to PDF.",
        status: "open",
        priority: "low",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        assignee: null,
        comments: [],
        labels: [{ name: "feature" }, { name: "help-wanted" }]
    }
];

export const mockStats = {
    average_resolution_time: "48h 30m"
};

export const mockAssignees = [
    { assignee_id: 101, name: "Alex Chen", count: 12, resolved: 12, total: 15 },
    { assignee_id: 102, name: "Mike Johnson", count: 8, resolved: 8, total: 10 },
    { assignee_id: 103, name: "Emily Davis", count: 5, resolved: 5, total: 9 },
    { assignee_id: 104, name: "Sarah Kim", count: 6, resolved: 6, total: 7 }
];

export const mockLabels = [
    { id: 1, name: "bug" },
    { id: 2, name: "feature" },
    { id: 3, name: "documentation" },
    { id: 4, name: "urgent" }
];
