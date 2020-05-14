export class KrikooUtils {

    public static debug: boolean = false;

    public static log(message?: any, ...optionalParams: any[]): void {
        if (KrikooUtils.debug) {
            console.log(message, optionalParams);
        }
    }

}
