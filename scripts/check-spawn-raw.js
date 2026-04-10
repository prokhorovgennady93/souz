const { spawn } = require("child_process");
const ffmpegInstaller = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

const rtspUrl = "rtsp://185.154.72.229:554/user=www&password=654123&channel=1&stream=0?";
const filePath = path.resolve(__dirname, "../public/uploads/audits/spawn_test.jpg");

console.log("Starting minimal spawn test...");
console.log("Ffmpeg path:", ffmpegInstaller);
console.log("Output path:", filePath);

if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const ffmpegProcess = spawn(ffmpegInstaller, [
  "-y",
  "-rtsp_transport", "tcp",
  "-i", rtspUrl,
  "-frames:v", "1",
  "-update", "1",
  filePath
]);

let stderr = "";
ffmpegProcess.stderr.on("data", (data) => {
  stderr += data.toString();
});

ffmpegProcess.on("close", (code) => {
  if (code === 0 && fs.existsSync(filePath)) {
    console.log("✅ SUCCESS: Snapshot saved.");
  } else {
    console.log(`❌ FAILURE: Code ${code}`);
    console.log("Stderr:", stderr.slice(-300));
  }
  process.exit(code);
});

setTimeout(() => {
  ffmpegProcess.kill();
  console.log("Timeout reached.");
  process.exit(1);
}, 20000);
