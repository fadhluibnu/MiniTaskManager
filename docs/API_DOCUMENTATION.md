# API Documentation — Mini Task Manager

Base URL: `http://localhost:8000/api`

---

## Health Check

### GET /api/status

Confirms the server is running.

**Request**

```
GET /api/status
```

No request body, params, or query required.

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "ok"
  }
}
```

---

## Upcoming Endpoints

The following endpoints will be documented here after implementation:

### Tasks

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | List all active tasks |
| `PATCH` | `/api/tasks/:id/status` | Update task status |
| `DELETE` | `/api/tasks/:id` | Soft delete a task |

### Audit Logs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tasks/:id/audit-logs` | Get audit logs for a specific task |
| `GET` | `/api/audit-logs` | Get global audit trail |

### Actors

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/actors` | List all actors |

---

## Response Shape

All endpoints return a consistent response shape:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null,
  "error": [ ... ]  // Optional, only on validation errors
}
```

## Error Codes

| Status | Meaning |
|--------|---------|
| `400` | Validation error — invalid request body/params/query |
| `404` | Resource or route not found |
| `500` | Internal server error |
