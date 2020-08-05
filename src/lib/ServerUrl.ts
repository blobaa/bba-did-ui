export default class ServerUrl {
    public static get(subPath: string): string {
        return process.env.linkPrefix + subPath;
    }
}