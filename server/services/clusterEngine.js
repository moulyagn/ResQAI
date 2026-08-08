// Intelligent Incident Clustering & Deduplication Engine for ResQAI

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

export function clusterReports(reports) {
  const clusters = [];
  const visited = new Set();
  const CLUSTER_RADIUS_KM = 1.5; // Group reports within 1.5km radius

  reports.forEach((report, index) => {
    if (visited.has(report.id)) return;

    // Start a new cluster
    const clusterMembers = [report];
    visited.add(report.id);

    // Search for near-by reports matching category or spatial proximity
    for (let j = index + 1; j < reports.length; j++) {
      const other = reports[j];
      if (visited.has(other.id)) continue;

      const dist = haversineDistance(report.coordinates, other.coordinates);
      const isSameCategory = report.category === other.category;
      const isCloseProximity = dist <= CLUSTER_RADIUS_KM;

      // Group if close proximity and same category, or extremely close proximity (< 0.5km)
      if (isCloseProximity && (isSameCategory || dist <= 0.5)) {
        clusterMembers.push(other);
        visited.add(other.id);
      }
    }

    // Compute cluster centroid
    const avgLat = clusterMembers.reduce((sum, r) => sum + r.coordinates[0], 0) / clusterMembers.length;
    const avgLng = clusterMembers.reduce((sum, r) => sum + r.coordinates[1], 0) / clusterMembers.length;

    // Compute merged severity
    const maxSeverity = Math.max(...clusterMembers.map(r => r.severity));
    // Frequency boost if multiple duplicate reports confirm the emergency
    const frequencyBoost = clusterMembers.length >= 3 ? 1 : 0;
    const mergedSeverity = Math.min(5, maxSeverity + frequencyBoost);

    // Merge resource requirements (unique union)
    const combinedResources = Array.from(new Set(clusterMembers.flatMap(r => r.resourceNeeds)));

    // Sum victim estimate
    const totalVictims = clusterMembers.reduce((sum, r) => sum + (r.extractedEntities?.trappedVictims || 0), 0);

    // Primary representative report
    const primaryReport = clusterMembers[0];

    const clusterId = `CLS-${100 + clusters.length + 1}`;
    
    // Assign clusterId back to individual report members
    clusterMembers.forEach(r => {
      r.clusterId = clusterId;
    });

    clusters.push({
      id: clusterId,
      title: `${primaryReport.category} Emergency Cluster — ${primaryReport.locationName}`,
      category: primaryReport.category,
      severity: mergedSeverity,
      centroid: [parseFloat(avgLat.toFixed(4)), parseFloat(avgLng.toFixed(4))],
      locationName: primaryReport.locationName,
      reportCount: clusterMembers.length,
      primaryReportId: primaryReport.id,
      reports: clusterMembers,
      combinedResources,
      totalVictims,
      status: clusterMembers.some(r => r.status === "In Progress") ? "In Progress" : clusterMembers.some(r => r.status === "Dispatched") ? "Dispatched" : "Unassigned",
      assignedAgency: clusterMembers.find(r => r.assignedAgency)?.assignedAgency || null,
      confidenceScore: Math.min(0.99, 0.85 + clusterMembers.length * 0.04),
      lastUpdated: new Date().toISOString()
    });
  });

  return clusters;
}
