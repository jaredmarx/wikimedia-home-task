// Importing EventSourcePolyfill to handle server-sent events
import { EventSourcePolyfill } from 'event-source-polyfill';

class WikimediaEventStream {
    // Declaring private variables
    private eventSource: EventSource | null = null;
    private listeners: ((event: any) => void)[] = [];
    private paused: boolean = false;

    constructor() {
        // Checking if the code is running in a browser environment
        if (typeof window !== 'undefined') {
            // Initializing EventSourcePolyfill to connect to the Wikimedia recent change stream
            this.eventSource = new EventSourcePolyfill('https://stream.wikimedia.org/v2/stream/recentchange');
            // Setting the onmessage handler to process incoming messages
            this.eventSource.onmessage = this.handleMessage.bind(this);
        }
    }

    // Method to handle incoming messages from the event stream
    private handleMessage(event: MessageEvent) {
        // If the stream is paused, do nothing
        if (this.paused) return;
        // Parse the incoming event data as JSON
        const data = JSON.parse(event.data);
        // Notify all registered listeners with the parsed data
        this.listeners.forEach(listener => listener(data));
    }

    // Method to add a new listener to the event stream
    public addListener(listener: (event: any) => void) {
        this.listeners.push(listener);
    }

    // Method to remove an existing listener from the event stream
    public removeListener(listener: (event: any) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    // Method to pause the event stream
    public pause() {
        this.paused = true;
    }

    // Method to resume the event stream
    public resume() {
        this.paused = false;
    }
}

// Creating an instance of WikimediaEventStream and exporting it for use in other parts of the application
const eventStream = new WikimediaEventStream();
export default eventStream;
