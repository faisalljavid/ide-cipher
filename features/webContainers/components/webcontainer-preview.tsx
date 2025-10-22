"use client";

import React, { useEffect, useState, useRef } from "react"
import type { TemplateFolder } from "@/features/playground/libs/path-to-json"
import { transformToWebContainerFormat } from "../hooks/transformer"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { WebContainer } from "@webcontainer/api"
import dynamic from "next/dynamic";

// Dynamically import Terminal component with SSR disabled
const TerminalComponent = dynamic(() => import("./terminal"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    ),
})
interface WebContainerPreviewProps {
    templateData: TemplateFolder
    serverUrl: string
    isLoading: boolean
    error: string | null
    instance: WebContainer | null
    writeFileSync: (path: string, content: string) => Promise<void>
    forceResetup?: boolean;// Optional prop to force re-setup
}

const WebContainerPreview = ({
    templateData,
    error,
    instance,
    isLoading,
    serverUrl,
    writeFileSync,
    forceResetup = false,
}: WebContainerPreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loadingState, setLoadingState] = useState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
    });
    const [currentStep, setCurrentStep] = useState(0)
    const totalSteps = 4
    const [setupError, setSetupError] = useState<string | null>(null)
    const [isSetupComplete, setIsSetupComplete] = useState(false)
    const [isSetupInProgress, setIsSetupInProgress] = useState(false)

    // Ref to access terminal methods
    const terminalRef = useRef<any>(null);

    // Ref to track if setup has been initiated for this instance
    const setupInitiatedRef = useRef<WebContainer | null>(null);

    // Ref to track the running server process
    const serverProcessRef = useRef<any>(null);

    // Reset setup state when forceResetup changes
    useEffect(() => {
        if (forceResetup) {
            setIsSetupComplete(false);
            setIsSetupInProgress(false);
            setPreviewUrl("");
            setCurrentStep(0);
            setupInitiatedRef.current = null;
            setLoadingState({
                transforming: false,
                mounting: false,
                installing: false,
                starting: false,
                ready: false,
            });
        }
    }, [forceResetup])


    useEffect(() => {
        async function setupContainer() {
            // Don't run setup if it's already complete, in progress, or has been initiated for this instance
            if (!instance || isSetupComplete || isSetupInProgress || setupInitiatedRef.current === instance) return;

            try {
                // Mark this instance as having setup initiated
                setupInitiatedRef.current = instance;
                setIsSetupInProgress(true);
                setSetupError(null);

                // Check if server is already running by testing if files are already mounted
                try {
                    const packageJsonExists = await instance.fs.readFile('package.json', 'utf8');
                    if (packageJsonExists) {
                        if (terminalRef.current?.writeToTerminal) {
                            terminalRef.current.writeToTerminal("🔄  Reconnecting to existing WebContainer session...\r\n");
                        }
                    }
                    instance.on("server-ready", (port: number, url: string) => {
                        console.log(`Reconnected to server on port ${port} at ${url}`)
                        setPreviewUrl(url);
                        setLoadingState((prev) => ({
                            ...prev,
                            starting: false,
                            ready: true,
                        }))
                        setIsSetupComplete(true);
                        setIsSetupInProgress(false);
                    })

                    setCurrentStep(4);
                    setLoadingState((prev) => ({ ...prev, starting: true }));
                    return;
                } catch (e) {
                    // Files don't exist, proceed with normal setup
                }
                // Step 1: Transform data
                setLoadingState((prev) => ({ ...prev, transforming: true }));
                setCurrentStep(1);

                // Write to terminal
                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("🔄  Transforming template data...\r\n");
                }


                // @ts-ignore
                const files = transformToWebContainerFormat(templateData)

                setLoadingState((prev) => ({
                    ...prev,
                    transforming: false,
                    mounting: true,
                }));
                setCurrentStep(2)



                // Step 2: Mount files

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("📁  Mounting files to WebContainer...\r\n");
                }

                await instance.mount(files);

                setLoadingState((prev) => ({
                    ...prev,
                    mounting: false,
                    installing: true,
                }));
                setCurrentStep(3)


                // Step 3: Install dependencies

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("📦  Installing dependencies...\r\n");
                }

                const installProcess = await instance.spawn("npm", ["install"])

                // Stream install output to terminal
                installProcess.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            // Write directly on terminal
                            if (terminalRef.current?.writeToTerminal) {
                                terminalRef.current.writeToTerminal(data);
                            }
                        },
                    })
                )

                const installExitCode = await installProcess.exit

                if (installExitCode !== 0) {
                    throw new Error(`Failed to install dependencies. Exit code: ${installExitCode}`);
                }

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("✅  Dependencies installed successfully\r\n");
                }

                setLoadingState((prev) => ({
                    ...prev,
                    installing: false,
                    starting: true,
                }));
                setCurrentStep(4);


                // Step 4: Start the server

                // Kill any existing server process before starting a new one
                if (serverProcessRef.current) {
                    try {
                        serverProcessRef.current.kill();
                        serverProcessRef.current = null;
                    } catch (e) {
                        console.error("Failed to kill existing process:", e);
                    }
                }

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal("🚀  Starting development server...\r\n");
                }

                const startProcess = await instance.spawn("npm", ["run", "start"]);
                serverProcessRef.current = startProcess;

                // Listen for server ready event
                instance.on("server-ready", (port: number, url: string) => {
                    console.log(`Server ready on port ${port} at ${url}`);
                    setPreviewUrl(url);
                    setLoadingState((prev) => ({
                        ...prev,
                        starting: false,
                        ready: true,
                    }))
                    setIsSetupComplete(true)
                    setIsSetupInProgress(false)
                })

                // Handle start process output - stream to terminal
                startProcess.output.pipeTo(
                    new WritableStream({
                        write(data) {
                            if (terminalRef.current?.writeToTerminal) {
                                terminalRef.current.writeToTerminal(data);
                            }
                        },
                    })
                )
            } catch (err) {
                console.error("Setup error:", error);
                const errorMessage = err instanceof Error ? err.message : String(err);

                if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal(`❌  Error: ${errorMessage}\r\n`);
                }

                setSetupError(errorMessage);
                setIsSetupInProgress(false);
            }
        }

        setupContainer();
    }, [instance, isSetupComplete, isSetupInProgress])

    // Cleanup function to prevent memory leaks
    useEffect(() => {
        return () => {
            // Kill the server process on unmount to prevent port conflicts
            if (serverProcessRef.current) {
                try {
                    serverProcessRef.current.kill();
                    serverProcessRef.current = null;
                } catch (e) {
                    console.error("Failed to kill server process on cleanup:", e);
                }
            }
        }
    }, [])

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                    <h3 className="text-lg font-medium">Initializing WebContainer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Setting up the environment for your project...
                    </p>
                </div>
            </div>
        )
    }

    if (error || setupError) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
                    <div className="flex items-center gap-2 mb-3">
                        <XCircle className="h-5 w-5" />
                        <h3 className="font-semibold">Error</h3>
                    </div>
                    <p className="text-sm">{error || setupError}</p>
                </div>
            </div>
        )
    }

    const getStepIcon = (stepIndex: number) => {
        if (stepIndex < currentStep) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else if (stepIndex === currentStep) {
            return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
        } else {
            return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
        }
    };

    const getStepText = (stepIndex: number, label: string) => {
        const isActive = stepIndex === currentStep;
        const isComplete = stepIndex < currentStep;

        return (
            <span className={`text-sm font-medium ${isComplete ? 'text-green-600' :
                isActive ? 'text-blue-600' :
                    'text-gray-500'
                }`}>
                {label}
            </span>
        )
    }

    return (
        <div className="h-full w-full flex flex-col">
            {!previewUrl ? (
                <div className="h-full flex flex-col">
                    <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">


                        <Progress
                            value={(currentStep / totalSteps) * 100}
                            className="h-2 mb-6"
                        />

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                {getStepIcon(1)}
                                {getStepText(1, "Transforming template data")}
                            </div>
                            <div className="flex items-center gap-3">
                                {getStepIcon(2)}
                                {getStepText(2, "Mounting files")}
                            </div>
                            <div className="flex items-center gap-3">
                                {getStepIcon(3)}
                                {getStepText(3, "Installing dependencies")}
                            </div>
                            <div className="flex items-center gap-3">
                                {getStepIcon(4)}
                                {getStepText(4, "Starting development server")}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <TerminalComponent
                            ref={terminalRef}
                            webContainerInstance={instance}
                            theme="dark"
                            className="h-full"
                        />
                    </div>

                </div>
            ) : (
                <div className="h-full flex flex-col">
                    {/* Preview */}
                    <div className="flex-1">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-none"
                            title="WebContainer Preview"
                        />
                    </div>

                    <div className="h-64 border-t">
                        <TerminalComponent
                            ref={terminalRef}
                            webContainerInstance={instance}
                            theme="dark"
                            className="h-full"
                        />
                    </div>

                </div>
            )}
        </div>
    )
}

export default WebContainerPreview;