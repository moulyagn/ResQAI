// ResQAI API client service with intelligent fallback

const API_BASE = '/api';

export async function fetchIncidentsData() {
  try {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (error) {
    console.warn('[ResQAI API] Using client-side fallback mode:', error.message);
    return null;
  }
}

export async function ingestReport(reportData) {
  try {
    const res = await fetch(`${API_BASE}/incidents/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    if (!res.ok) throw new Error('Failed to ingest report');
    return await res.json();
  } catch (error) {
    console.warn('[ResQAI API] Ingestion fallback:', error.message);
    return null;
  }
}

export async function updateIncidentStatus(id, status, assignedAgency) {
  try {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedAgency })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  } catch (error) {
    console.warn('[ResQAI API] Status update fallback:', error.message);
    return null;
  }
}

export async function resetScenario(scenarioKey) {
  try {
    const res = await fetch(`${API_BASE}/incidents/reset-scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioKey })
    });
    if (!res.ok) throw new Error('Failed to reset scenario');
    return await res.json();
  } catch (error) {
    console.warn('[ResQAI API] Reset scenario fallback:', error.message);
    return null;
  }
}

export async function fetchCoordinationLogs() {
  try {
    const res = await fetch(`${API_BASE}/coordination`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function postCoordinationLog(logData) {
  try {
    const res = await fetch(`${API_BASE}/coordination`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (!res.ok) throw new Error('Failed to post log');
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchResourceMatrix() {
  try {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function dispatchResource(resourceCategory, count, incidentId) {
  try {
    const res = await fetch(`${API_BASE}/resources/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceCategory, count, incidentId })
    });
    if (!res.ok) throw new Error('Failed to dispatch resource');
    return await res.json();
  } catch (error) {
    return null;
  }
}
