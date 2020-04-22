import {ShareOptionFile} from './ShareOptionFile';
import {ShareOptionEmail} from './ShareOptionEmail';

export interface ShareOptions {
    /**
     * Set a title for the share modal. Android only
     */
    dialogTitle?: string;
    /**
     * TODO
     */
    email?: ShareOptionEmail
    /**
     * Set some text to share
     */
    text?: string;
    /**
     * Set a URL to share
     */
    url?: string;
    /**
     * Set a files to share.
     */
    files?: Array<ShareOptionFile>;
}
