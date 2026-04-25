import * as webllm from "@mlc-ai/web-llm";

export type LocalAIStatus = "idle" | "checking" | "loading" | "ready" | "error";

export class LocalAIService {
  private engine: webllm.MLCEngine | null = null;
  private selectedModel = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC"; // Much smaller and faster to load
  
  public onProgress: (progress: number, message: string) => void = () => {};
  public onStatusChange: (status: LocalAIStatus) => void = () => {};

  async checkWebGPU() {
    if (!("gpu" in navigator)) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        throw new Error("WebGPU is rarely supported on mobile browsers yet. Please use Cloud Mode or a Desktop browser.");
      }
      throw new Error("WebGPU is not supported in this browser. Please use Chrome or Edge on Desktop.");
    }
  }

  async init() {
    if (this.engine) return;

    try {
      this.onStatusChange("checking");
      await this.checkWebGPU();

      this.onStatusChange("loading");
      console.log("Initializing Local AI with model:", this.selectedModel);
      
      const initProgressCallback = (report: webllm.InitProgressReport) => {
        console.log("Local AI Progress:", report.text);
        this.onProgress(report.progress, report.text);
      };

      this.engine = await webllm.CreateMLCEngine(
        this.selectedModel,
        { 
          initProgressCallback,
          // Fallback to a smaller model if needed or specify more options
        }
      );
      
      this.onStatusChange("ready");
    } catch (err: any) {
      console.error("Local AI Init Error:", err);
      this.onStatusChange("error");
      this.onProgress(0, err.message || "Failed to initialize Local AI");
      throw err;
    }
  }

  async generateResponse(messages: { role: string; content: string }[]) {
    if (!this.engine) {
      await this.init();
    }

    if (!this.engine) throw new Error("Failed to initialize Local AI engine");

    const reply = await this.engine.chat.completions.create({
      messages: messages as any,
    });

    return reply.choices[0].message.content || "";
  }

  async generateResponseStream(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void
  ) {
    if (!this.engine) {
      await this.init();
    }

    if (!this.engine) throw new Error("Failed to initialize Local AI engine");

    const chunks = await this.engine.chat.completions.create({
      messages: messages as any,
      stream: true,
    });

    let fullText = "";
    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullText += content;
      onChunk(content);
    }
    return fullText;
  }

  getStatus(): LocalAIStatus {
    if (!this.engine) return "idle";
    return "ready";
  }
}

export const localAI = new LocalAIService();
