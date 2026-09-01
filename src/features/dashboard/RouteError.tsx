import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// Route-level errorElement: without one, an uncaught render/loader error in
// a dashboard route bubbles silently and the user is left looking at a
// blank or unexplained page with no way to tell what happened. This surfaces
// the error instead of hiding it.
export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unexpected error";

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <h1>Something went wrong</h1>
        <p>{message}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    </div>
  );
}
