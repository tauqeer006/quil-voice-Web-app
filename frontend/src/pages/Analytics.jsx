import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "../components/Layout.jsx";
import { documents } from "../api/client";

export default function Analytics() {
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    documents.list().then((docs) => {
      const counts = {};
      docs.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
      setStatusCounts(Object.entries(counts).map(([status, count]) => ({ status, count })));
    }).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1>Analytics</h1>
      <div className="card">
        <h3>Documents by status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={statusCounts}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4338ca" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}
