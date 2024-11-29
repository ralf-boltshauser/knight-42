// Imports
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrismaInstrumentation } from "@prisma/instrumentation";

// Configure the OTLP trace exporter
const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces", // Default OTLP endpoint
});

// Initialize the NodeSDK
const sdk = new NodeSDK({
  serviceName: "knight-42", // Using the name from package.json
  traceExporter,
  instrumentations: [
    new PrismaInstrumentation({
      middleware: true,
    }),
  ],
});

// Start the SDK
sdk.start();

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  try {
    await sdk.shutdown();
    console.log("Tracing shut down successfully");
  } catch (err) {
    console.error("Error shutting down tracing", err);
  } finally {
    process.exit(0);
  }
});
