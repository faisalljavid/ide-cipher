import { useState, useEffect, useCallback } from 'react'
import { WebContainer } from '@webcontainer/api'
import { TemplateFolder } from '@/features/playground/libs/path-to-json'

interface UseWebContainerProps {
    templateData: TemplateFolder;
}

interface UseWebContainerReturn {
    serverUrl: string | null;
    isLoading: boolean;
    error: string | null;
    instance: WebContainer | null;
    writeFileSync: (path: string, content: string) => Promise<void>;
    destroy: () => void;
}

// Global WebContainer instance cache (singleton pattern)
let globalWebContainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
    const [serverUrl, setServerUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [instance, setInstance] = useState<WebContainer | null>(null)


    useEffect(() => {
        let mounted = true;

        async function initializeWebContainer() {
            try {
                // Use cached instance if available
                if (globalWebContainerInstance) {
                    console.log('Reusing cached WebContainer instance');
                    if (mounted) {
                        setInstance(globalWebContainerInstance);
                        setIsLoading(false);
                    }
                    return;
                }

                // If boot is already in progress, wait for it
                if (bootPromise) {
                    console.log('Waiting for existing boot process...');
                    const webcontainerInstance = await bootPromise;
                    if (mounted) {
                        setInstance(webcontainerInstance);
                        setIsLoading(false);
                    }
                    return;
                }

                // Boot new instance
                console.log('Booting new WebContainer instance...');
                bootPromise = WebContainer.boot();
                const webcontainerInstance = await bootPromise;

                // Cache the instance
                globalWebContainerInstance = webcontainerInstance;
                bootPromise = null;

                if (!mounted) return

                setInstance(webcontainerInstance)
                setIsLoading(false)
            } catch (err) {
                console.error('Failed to initialize WebContainer:', err)
                bootPromise = null;
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer')
                    setIsLoading(false)
                }
            }
        }

        initializeWebContainer();

        return () => {
            mounted = false
            // Don't teardown the global instance, keep it cached
        }
    }, [])

    const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
        if (!instance) {
            throw new Error('WebContainer instance is not available')
        }

        try {
            // Ensure the folder structure exists
            const pathParts = path.split('/')
            const folderPath = pathParts.slice(0, -1).join('/') // Extract folder path

            if (folderPath) {
                await instance.fs.mkdir(folderPath, { recursive: true }) // Create folder structure recursively
            }

            // Write the file
            await instance.fs.writeFile(path, content)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to write file'
            console.error(`Failed to write file at ${path}:`, err)
            throw new Error(`Failed to write file at ${path}: ${errorMessage}`)
        }
    }, [instance])

    // Destroy function
    const destroy = useCallback(() => {
        if (instance) {
            instance.teardown()
            setInstance(null)
            setServerUrl(null)
        }
    }, [instance]);

    return {
        serverUrl,
        isLoading,
        error,
        instance,
        writeFileSync,
        destroy
    }
}