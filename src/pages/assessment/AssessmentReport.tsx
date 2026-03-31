import { useParams, Navigate } from "react-router-dom";

export default function AssessmentReport() {
  const { token } = useParams<{ token: string }>();
  return <Navigate to={`/report/${token}`} replace />;
}
