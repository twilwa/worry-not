// ABOUTME: Main React application component
// ABOUTME: Placeholder for game UI and PixiJS canvas
import { getVersion } from "@end-of-line/shared";

export default function App() {
  return (
    <div>
      <h1>End of Line</h1>
      <p>Version: {getVersion()}</p>
    </div>
  );
}
