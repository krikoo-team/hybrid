import {ShareEmailApp} from './ShareEmailApp.enum';

export interface ShareOptionEmail {
    app?: ShareEmailApp;
    /**
     * Set an email list for email type apps
     */
    bcc?: Array<string>;
    /**
     * Set an email list for email type apps
     */
    body?: string;
    /**
     * Set an email list for email type apps
     */
    cc?: Array<string>;
    /**
     * Set an email list for email type apps
     */
    htmlBody?: string;
    /**
     * Set an email list for email type apps
     */
    subject?: string;
    /**
     * Set an email list for email type apps
     */
    to?: Array<string>;
}
